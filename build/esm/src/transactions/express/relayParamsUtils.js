import { encodeAbiParameters, keccak256 } from 'viem';
import { abis } from '../../abis/index.js';
import { getContract } from '../../configs/contracts.js';
import { getBestSwapStrategy } from '../../domain/externalSwap/utils.js';
import { getSwapAmountsByToValue } from '../../domain/swap/swapValues.js';
import { nowInSeconds } from '../../lib/time.js';
import { getEmptyExternalCallsPayload, combineExternalCalls, getExternalCallsPayload } from '../batch/payloads/orderTransactions.js';
import { getOracleParamsForRelayParams } from './oracleParamsUtils.js';

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
        // final token
        feeAmount: 0n,
        // fee already sent in external calls
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

export { getExpressContractAddress, getGelatoRelayRouterDomain, getRawRelayerParams, getRelayerFeeParams, hashRelayParams };
//# sourceMappingURL=relayParamsUtils.js.map
//# sourceMappingURL=relayParamsUtils.js.map