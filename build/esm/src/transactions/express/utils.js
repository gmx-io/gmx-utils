import { encodeAbiParameters, keccak256 } from 'viem';
import { abis } from '../../abis/index.js';
import { BOTANIX } from '../../configs/chains.js';
import { getContract } from '../../configs/contracts.js';
import { convertTokenAddress, NATIVE_TOKEN_ADDRESS } from '../../configs/tokens.js';
import { getBestSwapStrategy } from '../../domain/externalSwap/utils.js';
import { getOppositeCollateral } from '../../domain/markets/utils.js';
import { getSwapAmountsByToValue } from '../../domain/swap/swapValues.js';
import { getByKey } from '../../lib/objects/index.js';
import { nowInSeconds } from '../../lib/time.js';
import { getEmptyExternalCallsPayload, combineExternalCalls, getExternalCallsPayload } from '../batch/payloads/orderTransactions.js';

function getExpressContractAddress(chainId, {
  isSubaccount,
  isMultichain,
  scope
}) {
  let contractName;
  if (isMultichain) {
    switch (scope) {
      case "claims":
        contractName = "MultichainClaimsRouter";
        break;
      case "order":
        contractName = "MultichainOrderRouter";
        break;
      case "subaccount":
        contractName = "MultichainSubaccountRouter";
        break;
      case "glv":
        contractName = "MultichainGlvRouter";
        break;
      case "gm":
        contractName = "MultichainGmRouter";
        break;
      case "transfer":
        contractName = "MultichainTransferRouter";
        break;
      default:
        throw new Error(`Invalid scope: ${scope}`);
    }
  } else {
    if (isSubaccount) {
      contractName = "SubaccountGelatoRelayRouter";
    } else {
      contractName = "GelatoRelayRouter";
    }
  }
  return getContract(chainId, contractName);
}
function getGelatoRelayRouterDomain(chainId, relayRouterAddress) {
  const name = "GmxBaseGelatoRelayRouter";
  return {
    name,
    version: "1",
    chainId,
    verifyingContract: relayRouterAddress
  };
}
function getOracleParams({
  chainId,
  tokenAddresses
}) {
  const uniqTokenAddresses = Array.from(
    new Set(
      tokenAddresses.map(
        (tokenAddress) => convertTokenAddress(chainId, tokenAddress, "wrapped")
      )
    )
  );
  const chainLinkPriceFeedProvider = getContract(
    chainId,
    "ChainlinkPriceFeedProvider"
  );
  return {
    tokens: uniqTokenAddresses,
    providers: Array(uniqTokenAddresses.length).fill(
      chainLinkPriceFeedProvider
    ),
    data: Array(uniqTokenAddresses.length).fill("0x")
  };
}
function getSwapPathOracleTokens({
  marketsInfoData,
  initialCollateralAddress,
  swapPath
}) {
  let currentToken = initialCollateralAddress;
  const tokenAddresses = [initialCollateralAddress];
  for (const marketAddress of swapPath) {
    const marketInfo = getByKey(marketsInfoData, marketAddress);
    if (!marketInfo) {
      throw new Error(`Market not found for oracle params: ${marketAddress}`);
    }
    const tokenOut = getOppositeCollateral(marketInfo, currentToken);
    if (!tokenOut?.address) {
      throw new Error(
        `Token not found for oracle params: ${initialCollateralAddress}`
      );
    }
    currentToken = tokenOut.address;
    tokenAddresses.push(currentToken, marketInfo.indexToken.address);
  }
  return tokenAddresses;
}
function getOracleParamsForRelayParams({
  chainId,
  gasPaymentTokenAddress,
  relayerFeeTokenAddress,
  feeSwapPath,
  externalCalls,
  marketsInfoData
}) {
  const tokenAddresses = [gasPaymentTokenAddress, relayerFeeTokenAddress];
  if (externalCalls) {
    tokenAddresses.push(...externalCalls.sendTokens);
  }
  if (feeSwapPath.length) {
    tokenAddresses.push(
      ...getSwapPathOracleTokens({
        marketsInfoData,
        initialCollateralAddress: gasPaymentTokenAddress,
        swapPath: feeSwapPath
      })
    );
  }
  return getOracleParams({ chainId, tokenAddresses });
}
function getRelayerFeeParams({
  chainId,
  account,
  gasPaymentToken,
  relayerFeeToken,
  relayerFeeAmount,
  totalRelayerFeeTokenAmount,
  gasPaymentTokenAsCollateralAmount,
  transactionExternalCalls,
  feeExternalSwapQuote,
  findFeeSwapPath
}) {
  const gasPaymentParams = {
    gasPaymentToken,
    relayFeeToken: relayerFeeToken,
    gasPaymentTokenAddress: gasPaymentToken.address,
    relayerFeeTokenAddress: relayerFeeToken.address,
    relayerFeeAmount,
    totalRelayerFeeTokenAmount,
    gasPaymentTokenAmount: 0n,
    gasPaymentTokenAsCollateralAmount
  };
  let feeParams;
  let externalCalls = transactionExternalCalls ?? getEmptyExternalCallsPayload();
  let feeExternalSwapGasLimit = 0n;
  if (relayerFeeToken.address === gasPaymentToken.address) {
    feeParams = {
      feeToken: relayerFeeToken.address,
      feeAmount: totalRelayerFeeTokenAmount,
      feeSwapPath: []
    };
    gasPaymentParams.gasPaymentTokenAmount = totalRelayerFeeTokenAmount;
  } else {
    let feeSwapAmounts;
    if (findFeeSwapPath) {
      feeSwapAmounts = getSwapAmountsByToValue({
        tokenIn: gasPaymentToken,
        tokenOut: relayerFeeToken,
        amountOut: totalRelayerFeeTokenAmount,
        isLimit: false,
        findSwapPath: findFeeSwapPath,
        swapOptimizationOrder: ["length"],
        uiFeeFactor: 0n,
        marketsInfoData: void 0,
        chainId,
        externalSwapQuoteParams: void 0
      });
    }
    const bestFeeSwapStrategy = getBestSwapStrategy({
      internalSwapAmounts: feeSwapAmounts,
      externalSwapQuote: feeExternalSwapQuote
    });
    if (bestFeeSwapStrategy?.swapPath) {
      feeParams = {
        feeToken: gasPaymentToken.address,
        feeAmount: bestFeeSwapStrategy.amountIn,
        feeSwapPath: bestFeeSwapStrategy.swapPath
      };
      gasPaymentParams.gasPaymentTokenAmount = bestFeeSwapStrategy.amountIn;
      gasPaymentParams.totalRelayerFeeTokenAmount = bestFeeSwapStrategy.amountOut;
    } else if (bestFeeSwapStrategy?.externalSwapQuote) {
      externalCalls = combineExternalCalls([
        externalCalls,
        getExternalCallsPayload({
          chainId,
          account,
          quote: bestFeeSwapStrategy.externalSwapQuote
        })
      ]);
      feeExternalSwapGasLimit = bestFeeSwapStrategy.externalSwapQuote.txnData.estimatedGas;
      feeParams = {
        feeToken: relayerFeeToken.address,
        feeAmount: 0n,
        feeSwapPath: []
      };
      gasPaymentParams.gasPaymentTokenAmount = bestFeeSwapStrategy.externalSwapQuote.amountIn;
      gasPaymentParams.totalRelayerFeeTokenAmount = bestFeeSwapStrategy.externalSwapQuote.amountOut;
    } else {
      return void 0;
    }
  }
  return {
    feeParams,
    externalCalls,
    feeExternalSwapGasLimit,
    gasPaymentParams
  };
}
function getRawRelayerParams({
  chainId,
  gasPaymentTokenAddress,
  relayerFeeTokenAddress,
  feeParams,
  externalCalls,
  tokenPermits,
  marketsInfoData
}) {
  const oracleParams = getOracleParamsForRelayParams({
    chainId,
    externalCalls,
    feeSwapPath: feeParams.feeSwapPath,
    gasPaymentTokenAddress,
    relayerFeeTokenAddress,
    marketsInfoData
  });
  const relayParamsPayload = {
    oracleParams,
    tokenPermits,
    externalCalls,
    fee: feeParams,
    desChainId: BigInt(chainId),
    userNonce: BigInt(nowInSeconds())
  };
  return relayParamsPayload;
}
function hashRelayParams(relayParams) {
  const encoded = encodeAbiParameters(abis.RelayParams, [
    {
      tokens: relayParams.oracleParams.tokens,
      providers: relayParams.oracleParams.providers,
      data: relayParams.oracleParams.data
    },
    {
      sendTokens: relayParams.externalCalls.sendTokens,
      sendAmounts: relayParams.externalCalls.sendAmounts,
      externalCallTargets: relayParams.externalCalls.externalCallTargets,
      externalCallDataList: relayParams.externalCalls.externalCallDataList,
      refundTokens: relayParams.externalCalls.refundTokens,
      refundReceivers: relayParams.externalCalls.refundReceivers
    },
    relayParams.tokenPermits,
    {
      feeToken: relayParams.fee.feeToken,
      feeAmount: relayParams.fee.feeAmount,
      feeSwapPath: relayParams.fee.feeSwapPath
    },
    relayParams.userNonce,
    relayParams.deadline,
    relayParams.desChainId
  ]);
  const hash = keccak256(encoded);
  return hash;
}
function getNeedTokenApprove(tokenAllowanceData, tokenAddress, amountToSpend, permits) {
  if (tokenAddress === NATIVE_TOKEN_ADDRESS || amountToSpend === void 0 || amountToSpend <= 0n) {
    return false;
  }
  if (!tokenAllowanceData || !tokenAddress || tokenAllowanceData?.[tokenAddress] === void 0) {
    return true;
  }
  const shouldApprove = amountToSpend > tokenAllowanceData[tokenAddress];
  const signedPermit = permits.find(
    (permit) => permit.token === tokenAddress && BigInt(permit.value) >= amountToSpend && Number(permit.deadline) > nowInSeconds()
  );
  return shouldApprove && !signedPermit;
}
function getGasPaymentValidations({
  gasPaymentToken,
  gasPaymentTokenAmount,
  gasPaymentTokenAsCollateralAmount,
  gasPaymentAllowanceData,
  tokenPermits,
  isGmxAccount
}) {
  const gasTokenAmountWithBuffer = gasPaymentTokenAmount * 13n / 10n;
  const totalGasPaymentTokenAmount = gasPaymentTokenAsCollateralAmount + gasTokenAmountWithBuffer;
  const tokenBalance = isGmxAccount ? gasPaymentToken.gmxAccountBalance : gasPaymentToken.walletBalance;
  const isOutGasTokenBalance = tokenBalance === void 0 || totalGasPaymentTokenAmount > tokenBalance;
  const needGasPaymentTokenApproval = isGmxAccount ? false : getNeedTokenApprove(
    gasPaymentAllowanceData,
    gasPaymentToken?.address,
    totalGasPaymentTokenAmount,
    tokenPermits
  );
  return {
    isOutGasTokenBalance,
    needGasPaymentTokenApproval,
    isValid: !isOutGasTokenBalance && !needGasPaymentTokenApproval
  };
}
function getIsValidExpressParams({
  chainId,
  gasPaymentValidations,
  isSponsoredCall
}) {
  if (chainId === BOTANIX && !isSponsoredCall) {
    return false;
  }
  return gasPaymentValidations.isValid;
}
function getOrderRelayRouterAddress(chainId, isSubaccount, isMultichain) {
  let contractName;
  if (isMultichain) {
    if (isSubaccount) {
      contractName = "MultichainSubaccountRouter";
    } else {
      contractName = "MultichainOrderRouter";
    }
  } else {
    if (isSubaccount) {
      contractName = "SubaccountGelatoRelayRouter";
    } else {
      contractName = "GelatoRelayRouter";
    }
  }
  return getContract(chainId, contractName);
}

export { getExpressContractAddress, getGasPaymentValidations, getGelatoRelayRouterDomain, getIsValidExpressParams, getNeedTokenApprove, getOracleParams, getOracleParamsForRelayParams, getOrderRelayRouterAddress, getRawRelayerParams, getRelayerFeeParams, getSwapPathOracleTokens, hashRelayParams };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map