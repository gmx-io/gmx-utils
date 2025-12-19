import {
  createPublicClient,
  decodeFunctionResult,
  encodeFunctionData,
  http,
  type PublicClient,
  withRetry,
} from "viem";
import { zeroAddress } from "viem";

import { abis } from "abis";
import type { ContractsChainId } from "configs/chains";
import { getViemChain } from "configs/chains";
import { getContract } from "configs/contracts";
import { isGlvEnabled } from "configs/glv";
import { convertTokenAddress } from "configs/tokens";
import { convertToContractPrice } from "domain/pricing/contractPrice";
import { SwapPricingType } from "domain/swap/types";
import { SignedTokenPermit } from "domain/tokens/types";
import { TokenPrices, TokensData } from "domain/tokens/types";
import { getTokenData } from "domain/tokens/utils";
import {
  CustomErrorName,
  ErrorData,
  TxErrorType,
  extendError,
  isContractError,
  parseError,
} from "lib/errors";
import {
  CreateOrderTxnParams,
  ExternalCallsPayload,
} from "transactions/batch/payloads/orderTransactions";

export type BlockTimestampData = {
  blockTimestamp: bigint;
  localTimestamp: bigint;
};

export type BlockTimestampResult = {
  blockTimestampData?: BlockTimestampData;
};

export function adjustBlockTimestamp(blockTimestampData: BlockTimestampData) {
  const nowInSeconds = BigInt(Math.floor(Date.now() / 1000));

  return (
    blockTimestampData.blockTimestamp +
    (nowInSeconds - blockTimestampData.localTimestamp)
  );
}

export type SimulateExecuteParams = {
  account: string;
  createMulticallPayload: string[];
  prices: SimulationPrices;
  value: bigint;
  tokenPermits: SignedTokenPermit[];
  isExpress: boolean;
  method?:
    | "simulateExecuteLatestDeposit"
    | "simulateExecuteLatestWithdrawal"
    | "simulateExecuteLatestOrder"
    | "simulateExecuteLatestShift"
    | "simulateExecuteLatestGlvDeposit"
    | "simulateExecuteLatestGlvWithdrawal";
  swapPricingType?: SwapPricingType;
  blockTimestampData: BlockTimestampData | undefined;
};

export function isSimulationPassed(errorData: ErrorData) {
  return isContractError(errorData, CustomErrorName.EndOfOracleSimulation);
}

function getPublicClient(chainId: ContractsChainId): PublicClient {
  const chain = getViemChain(chainId);
  const rpcUrl = chain.rpcUrls.default.http[0];

  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
}

function getExpressPublicClient(chainId: ContractsChainId): PublicClient {
  const chain = getViemChain(chainId);
  const rpcUrl = chain.rpcUrls.default.http[0];

  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
}

export async function simulateExecution(
  chainId: ContractsChainId,
  p: SimulateExecuteParams
) {
  const publicClient = p.isExpress
    ? getExpressPublicClient(chainId) ?? getPublicClient(chainId)
    : getPublicClient(chainId);

  const multicallAddress = getContract(chainId, "Multicall");
  const exchangeRouterAddress = getContract(chainId, "ExchangeRouter");
  const glvRouterAddress = isGlvEnabled(chainId)
    ? getContract(chainId, "GlvRouter")
    : zeroAddress;

  let blockTimestamp: bigint;
  let blockTag: "latest" | bigint;

  if (p.blockTimestampData) {
    blockTimestamp = adjustBlockTimestamp(p.blockTimestampData);
    blockTag = "latest";
  } else {
    const getCurrentBlockTimestampData = encodeFunctionData({
      abi: abis.Multicall,
      functionName: "getCurrentBlockTimestamp",
    });

    const result = await publicClient.simulateContract({
      address: multicallAddress,
      abi: abis.Multicall,
      functionName: "blockAndAggregate",
      args: [
        [
          {
            target: multicallAddress as `0x${string}`,
            callData: getCurrentBlockTimestampData,
          },
        ],
      ],
      account: p.account as `0x${string}`,
    });

    const [blockNumber, , returnData] = result.result;

    const decoded = decodeFunctionResult({
      abi: abis.Multicall,
      functionName: "getCurrentBlockTimestamp",
      data: returnData[0].returnData,
    });

    blockTimestamp = decoded as bigint;
    blockTag = blockNumber;
  }

  const priceTimestamp = blockTimestamp + 120n;
  const method = p.method || "simulateExecuteLatestOrder";

  const isGlv =
    method === "simulateExecuteLatestGlvDeposit" ||
    method === "simulateExecuteLatestGlvWithdrawal";

  const simulationPriceParams = {
    primaryTokens: p.prices.primaryTokens as readonly `0x${string}`[],
    primaryPrices: p.prices.primaryPrices as readonly {
      min: bigint;
      max: bigint;
    }[],
    minTimestamp: priceTimestamp,
    maxTimestamp: priceTimestamp,
  };

  let simulationPayloadData: string[] = [];

  if (p.tokenPermits.length > 0) {
    const externalCalls: ExternalCallsPayload = {
      sendTokens: [],
      sendAmounts: [],
      externalCallTargets: [],
      externalCallDataList: [],
      refundTokens: [],
      refundReceivers: [],
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
            permit.s,
          ],
        })
      );
    }

    simulationPayloadData.push(
      encodeFunctionData({
        abi: abis.ExchangeRouter,
        functionName: "makeExternalCalls",
        args: [
          externalCalls.externalCallTargets.map(
            (t) => t as `0x${string}`
          ) as readonly `0x${string}`[],
          externalCalls.externalCallDataList.map(
            (d) => d as `0x${string}`
          ) as readonly `0x${string}`[],
          externalCalls.refundTokens.map(
            (t) => t as `0x${string}`
          ) as readonly `0x${string}`[],
          externalCalls.refundReceivers.map(
            (r) => r as `0x${string}`
          ) as readonly `0x${string}`[],
        ],
      })
    );
  }

  simulationPayloadData.push(...p.createMulticallPayload);

  const routerAddress = isGlv ? glvRouterAddress : exchangeRouterAddress;
  const routerAbi = isGlv ? abis.GlvRouter : abis.ExchangeRouter;

  if (method === "simulateExecuteLatestWithdrawal") {
    if (p.swapPricingType === undefined) {
      throw new Error(
        "swapPricingType is required for simulateExecuteLatestWithdrawal"
      );
    }

    simulationPayloadData.push(
      encodeFunctionData({
        abi: routerAbi,
        functionName: "simulateExecuteLatestWithdrawal",
        args: [simulationPriceParams, p.swapPricingType],
      })
    );
  } else if (method === "simulateExecuteLatestDeposit") {
    simulationPayloadData.push(
      encodeFunctionData({
        abi: routerAbi,
        functionName: "simulateExecuteLatestDeposit",
        args: [simulationPriceParams],
      })
    );
  } else if (method === "simulateExecuteLatestOrder") {
    simulationPayloadData.push(
      encodeFunctionData({
        abi: routerAbi,
        functionName: "simulateExecuteLatestOrder",
        args: [simulationPriceParams],
      })
    );
  } else if (method === "simulateExecuteLatestShift") {
    simulationPayloadData.push(
      encodeFunctionData({
        abi: routerAbi,
        functionName: "simulateExecuteLatestShift",
        args: [simulationPriceParams],
      })
    );
  } else if (method === "simulateExecuteLatestGlvDeposit") {
    simulationPayloadData.push(
      encodeFunctionData({
        abi: abis.GlvRouter,
        functionName: "simulateExecuteLatestGlvDeposit",
        args: [simulationPriceParams],
      })
    );
  } else if (method === "simulateExecuteLatestGlvWithdrawal") {
    simulationPayloadData.push(
      encodeFunctionData({
        abi: abis.GlvRouter,
        functionName: "simulateExecuteLatestGlvWithdrawal",
        args: [simulationPriceParams],
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
              (d) => d as `0x${string}`
            ) as readonly `0x${string}`[],
          ],
          value: p.value,
          blockNumber: blockTag === "latest" ? undefined : blockTag,
          account: p.account as `0x${string}`,
        });
      },
      {
        retryCount: 2,
        delay: 200,
        shouldRetry: ({ error }) => {
          const errorData = parseError(error);
          return (
            errorData?.errorMessage?.includes("unsupported block number") ||
            errorData?.errorMessage
              ?.toLowerCase()
              .includes("failed to fetch") ||
            errorData?.errorMessage?.toLowerCase().includes("load failed") ||
            errorData?.errorMessage
              ?.toLowerCase()
              .includes("an error has occurred") ||
            false
          );
        },
      }
    );
  } catch (txnError: any) {
    const errorData = parseError(txnError);

    const isPassed = errorData && isSimulationPassed(errorData);
    const shouldIgnoreExpressNativeTokenBalance =
      errorData?.txErrorType === TxErrorType.NotEnoughFunds && p.isExpress;

    if (isPassed || shouldIgnoreExpressNativeTokenBalance) {
      return;
    } else {
      throw extendError(txnError, {
        errorContext: "simulation",
      });
    }
  }
}

export function getOrdersTriggerPriceOverrides(
  createOrderPayloads: CreateOrderTxnParams<any>[]
) {
  const overrides: PriceOverride[] = [];

  for (const co of createOrderPayloads) {
    if (
      co.orderPayload.numbers.triggerPrice !== 0n &&
      "indexTokenAddress" in co.params
    ) {
      overrides.push({
        tokenAddress: co.params.indexTokenAddress,
        contractPrices: {
          minPrice: co.orderPayload.numbers.triggerPrice,
          maxPrice: co.orderPayload.numbers.triggerPrice,
        },
      });
    }
  }

  return overrides;
}

export type SimulationPrices = ReturnType<typeof getSimulationPrices>;

export type PriceOverride = {
  tokenAddress: string;
  contractPrices?: TokenPrices;
  prices?: TokenPrices;
};

export function getSimulationPrices(
  chainId: number,
  tokensData: TokensData,
  overrides: PriceOverride[]
) {
  const tokenAddresses = Object.keys(tokensData);
  const primaryTokens: string[] = [];
  const primaryPrices: { min: bigint; max: bigint }[] = [];

  for (const address of tokenAddresses) {
    const token = getTokenData(tokensData, address);
    const convertedAddress = convertTokenAddress(chainId, address, "wrapped");

    if (!token?.prices || primaryTokens.includes(convertedAddress)) {
      continue;
    }

    primaryTokens.push(convertedAddress);

    const currentPrice = {
      min: convertToContractPrice(token.prices.minPrice, token.decimals),
      max: convertToContractPrice(token.prices.maxPrice, token.decimals),
    };

    const override = overrides.find((o) => o.tokenAddress === address);
    const primaryOverriddenPrice = override?.contractPrices ?? override?.prices;

    if (primaryOverriddenPrice) {
      primaryPrices.push({
        min: primaryOverriddenPrice.minPrice,
        max: primaryOverriddenPrice.maxPrice,
      });
    } else {
      primaryPrices.push(currentPrice);
    }
  }

  return {
    primaryTokens,
    primaryPrices,
  };
}
