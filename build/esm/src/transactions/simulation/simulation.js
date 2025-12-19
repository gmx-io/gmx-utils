import { zeroAddress, encodeFunctionData, decodeFunctionResult, withRetry, createPublicClient, http } from 'viem';
import { abis } from '../../abis/index.js';
import { getViemChain } from '../../configs/chains.js';
import { getContract } from '../../configs/contracts.js';
import { isGlvEnabled } from '../../configs/glv.js';
import { convertTokenAddress } from '../../configs/tokens.js';
import { convertToContractPrice } from '../../domain/pricing/contractPrice.js';
import { getTokenData } from '../../domain/tokens/utils.js';
import { isContractError, CustomErrorName, parseError, TxErrorType, extendError } from '../../lib/errors/index.js';

function adjustBlockTimestamp(blockTimestampData) {
  const nowInSeconds = BigInt(Math.floor(Date.now() / 1e3));
  return blockTimestampData.blockTimestamp + (nowInSeconds - blockTimestampData.localTimestamp);
}
function isSimulationPassed(errorData) {
  return isContractError(errorData, CustomErrorName.EndOfOracleSimulation);
}
function getPublicClient(chainId) {
  const chain = getViemChain(chainId);
  const rpcUrl = chain.rpcUrls.default.http[0];
  return createPublicClient({
    chain,
    transport: http(rpcUrl)
  });
}
function getExpressPublicClient(chainId) {
  const chain = getViemChain(chainId);
  const rpcUrl = chain.rpcUrls.default.http[0];
  return createPublicClient({
    chain,
    transport: http(rpcUrl)
  });
}
async function simulateExecution(chainId, p) {
  const publicClient = p.isExpress ? getExpressPublicClient(chainId) ?? getPublicClient(chainId) : getPublicClient(chainId);
  const multicallAddress = getContract(chainId, "Multicall");
  const exchangeRouterAddress = getContract(chainId, "ExchangeRouter");
  const glvRouterAddress = isGlvEnabled(chainId) ? getContract(chainId, "GlvRouter") : zeroAddress;
  let blockTimestamp;
  let blockTag;
  if (p.blockTimestampData) {
    blockTimestamp = adjustBlockTimestamp(p.blockTimestampData);
    blockTag = "latest";
  } else {
    const getCurrentBlockTimestampData = encodeFunctionData({
      abi: abis.Multicall,
      functionName: "getCurrentBlockTimestamp"
    });
    const result = await publicClient.simulateContract({
      address: multicallAddress,
      abi: abis.Multicall,
      functionName: "blockAndAggregate",
      args: [
        [
          {
            target: multicallAddress,
            callData: getCurrentBlockTimestampData
          }
        ]
      ],
      account: p.account
    });
    const [blockNumber, , returnData] = result.result;
    const decoded = decodeFunctionResult({
      abi: abis.Multicall,
      functionName: "getCurrentBlockTimestamp",
      data: returnData[0].returnData
    });
    blockTimestamp = decoded;
    blockTag = blockNumber;
  }
  const priceTimestamp = blockTimestamp + 120n;
  const method = p.method || "simulateExecuteLatestOrder";
  const isGlv = method === "simulateExecuteLatestGlvDeposit" || method === "simulateExecuteLatestGlvWithdrawal";
  const simulationPriceParams = {
    primaryTokens: p.prices.primaryTokens,
    primaryPrices: p.prices.primaryPrices,
    minTimestamp: priceTimestamp,
    maxTimestamp: priceTimestamp
  };
  let simulationPayloadData = [];
  if (p.tokenPermits.length > 0) {
    const externalCalls = {
      externalCallTargets: [],
      externalCallDataList: [],
      refundTokens: [],
      refundReceivers: []
    };
    for (const permit of p.tokenPermits) {
      externalCalls.externalCallTargets.push(permit.token);
      externalCalls.externalCallDataList.push(
        encodeFunctionData({
          abi: abis.ERC20PermitInterface,
          functionName: "permit",
          args: [
            permit.owner,
            permit.spender,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          ]
        })
      );
    }
    simulationPayloadData.push(
      encodeFunctionData({
        abi: abis.ExchangeRouter,
        functionName: "makeExternalCalls",
        args: [
          externalCalls.externalCallTargets.map(
            (t) => t
          ),
          externalCalls.externalCallDataList.map(
            (d) => d
          ),
          externalCalls.refundTokens.map(
            (t) => t
          ),
          externalCalls.refundReceivers.map(
            (r) => r
          )
        ]
      })
    );
  }
  simulationPayloadData.push(...p.createMulticallPayload);
  const routerAddress = isGlv ? glvRouterAddress : exchangeRouterAddress;
  const routerAbi = isGlv ? abis.GlvRouter : abis.ExchangeRouter;
  if (method === "simulateExecuteLatestWithdrawal") {
    if (p.swapPricingType === void 0) {
      throw new Error(
        "swapPricingType is required for simulateExecuteLatestWithdrawal"
      );
    }
    simulationPayloadData.push(
      encodeFunctionData({
        abi: routerAbi,
        functionName: "simulateExecuteLatestWithdrawal",
        args: [simulationPriceParams, p.swapPricingType]
      })
    );
  } else if (method === "simulateExecuteLatestDeposit") {
    simulationPayloadData.push(
      encodeFunctionData({
        abi: routerAbi,
        functionName: "simulateExecuteLatestDeposit",
        args: [simulationPriceParams]
      })
    );
  } else if (method === "simulateExecuteLatestOrder") {
    simulationPayloadData.push(
      encodeFunctionData({
        abi: routerAbi,
        functionName: "simulateExecuteLatestOrder",
        args: [simulationPriceParams]
      })
    );
  } else if (method === "simulateExecuteLatestShift") {
    simulationPayloadData.push(
      encodeFunctionData({
        abi: routerAbi,
        functionName: "simulateExecuteLatestShift",
        args: [simulationPriceParams]
      })
    );
  } else if (method === "simulateExecuteLatestGlvDeposit") {
    simulationPayloadData.push(
      encodeFunctionData({
        abi: abis.GlvRouter,
        functionName: "simulateExecuteLatestGlvDeposit",
        args: [simulationPriceParams]
      })
    );
  } else if (method === "simulateExecuteLatestGlvWithdrawal") {
    simulationPayloadData.push(
      encodeFunctionData({
        abi: abis.GlvRouter,
        functionName: "simulateExecuteLatestGlvWithdrawal",
        args: [simulationPriceParams]
      })
    );
  } else {
    throw new Error(`Unknown method: ${method}`);
  }
  try {
    await withRetry(
      () => {
        return publicClient.simulateContract({
          address: routerAddress,
          abi: routerAbi,
          functionName: "multicall",
          args: [
            simulationPayloadData.map(
              (d) => d
            )
          ],
          value: p.value,
          blockNumber: blockTag === "latest" ? void 0 : blockTag,
          account: p.account
        });
      },
      {
        retryCount: 2,
        delay: 200,
        shouldRetry: ({ error }) => {
          const errorData = parseError(error);
          return errorData?.errorMessage?.includes("unsupported block number") || errorData?.errorMessage?.toLowerCase().includes("failed to fetch") || errorData?.errorMessage?.toLowerCase().includes("load failed") || errorData?.errorMessage?.toLowerCase().includes("an error has occurred") || false;
        }
      }
    );
  } catch (txnError) {
    const errorData = parseError(txnError);
    const isPassed = errorData && isSimulationPassed(errorData);
    const shouldIgnoreExpressNativeTokenBalance = errorData?.txErrorType === TxErrorType.NotEnoughFunds && p.isExpress;
    if (isPassed || shouldIgnoreExpressNativeTokenBalance) {
      return;
    } else {
      throw extendError(txnError, {
        errorContext: "simulation"
      });
    }
  }
}
function getOrdersTriggerPriceOverrides(createOrderPayloads) {
  const overrides = [];
  for (const co of createOrderPayloads) {
    if (co.orderPayload.numbers.triggerPrice !== 0n && "indexTokenAddress" in co.params) {
      overrides.push({
        tokenAddress: co.params.indexTokenAddress,
        contractPrices: {
          minPrice: co.orderPayload.numbers.triggerPrice,
          maxPrice: co.orderPayload.numbers.triggerPrice
        }
      });
    }
  }
  return overrides;
}
function getSimulationPrices(chainId, tokensData, overrides) {
  const tokenAddresses = Object.keys(tokensData);
  const primaryTokens = [];
  const primaryPrices = [];
  for (const address of tokenAddresses) {
    const token = getTokenData(tokensData, address);
    const convertedAddress = convertTokenAddress(chainId, address, "wrapped");
    if (!token?.prices || primaryTokens.includes(convertedAddress)) {
      continue;
    }
    primaryTokens.push(convertedAddress);
    const currentPrice = {
      min: convertToContractPrice(token.prices.minPrice, token.decimals),
      max: convertToContractPrice(token.prices.maxPrice, token.decimals)
    };
    const override = overrides.find((o) => o.tokenAddress === address);
    const primaryOverriddenPrice = override?.contractPrices ?? override?.prices;
    if (primaryOverriddenPrice) {
      primaryPrices.push({
        min: primaryOverriddenPrice.minPrice,
        max: primaryOverriddenPrice.maxPrice
      });
    } else {
      primaryPrices.push(currentPrice);
    }
  }
  return {
    primaryTokens,
    primaryPrices
  };
}

export { adjustBlockTimestamp, getOrdersTriggerPriceOverrides, getSimulationPrices, isSimulationPassed, simulateExecution };
//# sourceMappingURL=simulation.js.map
//# sourceMappingURL=simulation.js.map