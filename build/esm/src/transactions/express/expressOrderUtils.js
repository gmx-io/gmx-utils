import { size, encodeFunctionData, zeroHash, zeroAddress, recoverTypedDataAddress } from 'viem';
import { abis } from '../../abis/index.js';
import { BOTANIX } from '../../configs/chains.js';
import { getContract } from '../../configs/contracts.js';
import { GMX_SIMULATION_ORIGIN } from '../../configs/dataStore.js';
import { DEFAULT_EXPRESS_ORDER_DEADLINE_DURATION } from '../../configs/express.js';
import { isSourceChain } from '../../configs/multichain.js';
import { estimateBatchGasLimit, estimateRelayerGasLimit, approximateL1GasBuffer } from '../../domain/executionFee/executionFee.js';
import { getSubaccountValidations, hashSubaccountApproval } from '../../domain/subaccount/utils.js';
import { setUiFeeReceiverIsExpress } from '../../domain/uiFeeReceiver/uiFeeReceiver.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { extendError } from '../../lib/errors/index.js';
import { estimateGasLimit } from '../../lib/gas/estimateGasLimit.js';
import { gelatoRelay } from '../../lib/gelatoRelay/gelatoRelay.js';
import { emitMetricEvent } from '../../lib/metrics/index.js';
import { applyFactor, BASIS_POINTS_DIVISOR_BIGINT } from '../../lib/numbers/index.js';
import { getByKey } from '../../lib/objects/index.js';
import { signTypedData } from '../../lib/signing/signing.js';
import { nowInSeconds } from '../../lib/time.js';
import { getBatchTotalPayCollateralAmount, getBatchTotalExecutionFee, getBatchExternalCalls, getBatchRequiredActions, getBatchExternalSwapGasLimit, getIsEmptyBatch } from '../batch/payloads/orderTransactions.js';
import { getRelayerFeeParams, getRawRelayerParams, getGelatoRelayRouterDomain, hashRelayParams } from './relayParamsUtils.js';
import { getNeedTokenApprove } from './utils.js';

async function estimateBatchExpressParams({
  signer,
  provider,
  chainId,
  batchParams,
  isGmxAccount,
  globalExpressParams,
  requireValidations,
  estimationMethod = "approximate",
  subaccount
}) {
  if (!globalExpressParams) {
    return void 0;
  }
  const transactionParams = getBatchExpressEstimatorParams({
    signer,
    batchParams,
    gasLimits: globalExpressParams.gasLimits,
    gasPaymentToken: globalExpressParams.gasPaymentToken,
    chainId,
    tokensData: globalExpressParams.tokensData,
    isGmxAccount
  });
  if (!transactionParams) {
    return void 0;
  }
  const expressParams = await estimateExpressParams({
    chainId,
    provider,
    transactionParams,
    globalExpressParams,
    estimationMethod,
    requireValidations,
    isGmxAccount,
    subaccount
  });
  return expressParams;
}
function getBatchExpressEstimatorParams({
  signer,
  batchParams,
  gasLimits,
  gasPaymentToken,
  chainId,
  tokensData,
  isGmxAccount
}) {
  const payAmounts = getBatchTotalPayCollateralAmount(batchParams);
  const gasPaymentTokenAsCollateralAmount = getByKey(payAmounts, gasPaymentToken.address) ?? 0n;
  const executionFeeAmount = getBatchTotalExecutionFee({
    batchParams,
    chainId,
    tokensData
  });
  const transactionExternalCalls = getBatchExternalCalls(batchParams);
  const subaccountActions = getBatchRequiredActions(batchParams);
  const transactionPayloadGasLimit = estimateBatchGasLimit({
    gasLimits,
    createOrdersCount: batchParams.createOrderParams.length,
    updateOrdersCount: batchParams.updateOrderParams.length,
    cancelOrdersCount: batchParams.cancelOrderParams.length,
    externalCallsGasLimit: getBatchExternalSwapGasLimit(batchParams),
    isGmxAccount
  });
  if (!executionFeeAmount) {
    return void 0;
  }
  const expressTransactionBuilder = async ({
    relayParams,
    gasPaymentParams,
    subaccount
  }) => {
    return {
      txnData: await buildAndSignExpressBatchOrderTxn({
        chainId,
        batchParams,
        relayParamsPayload: relayParams,
        relayerFeeTokenAddress: gasPaymentParams.relayerFeeTokenAddress,
        relayerFeeAmount: gasPaymentParams.relayerFeeAmount,
        subaccount,
        signer,
        emptySignature: true,
        isGmxAccount
      })
    };
  };
  return {
    account: signer.address,
    gasPaymentTokenAsCollateralAmount,
    executionFeeAmount: executionFeeAmount.feeTokenAmount,
    executionGasLimit: executionFeeAmount.gasLimit,
    transactionPayloadGasLimit,
    transactionExternalCalls,
    subaccountActions,
    isValid: !getIsEmptyBatch(batchParams),
    expressTransactionBuilder
  };
}
async function estimateExpressParams({
  chainId,
  isGmxAccount,
  provider,
  transactionParams,
  globalExpressParams,
  estimationMethod = "approximate",
  requireValidations = true,
  subaccount: rawSubaccount
}) {
  if (requireValidations && !transactionParams.isValid) {
    return void 0;
  }
  const {
    findFeeSwapPath,
    gasLimits,
    gasPaymentToken,
    relayerFeeToken,
    l1Reference,
    tokenPermits: rawTokenPermits,
    gasPrice,
    isSponsoredCall,
    bufferBps,
    marketsInfoData,
    gasPaymentAllowanceData
  } = globalExpressParams;
  const {
    expressTransactionBuilder,
    gasPaymentTokenAsCollateralAmount,
    executionFeeAmount,
    executionGasLimit,
    transactionPayloadGasLimit,
    transactionExternalCalls,
    subaccountActions,
    account
  } = transactionParams;
  const subaccountValidations = rawSubaccount ? getSubaccountValidations({
    requiredActions: subaccountActions,
    subaccount: rawSubaccount,
    subaccountRouterAddress: getOrderRelayRouterAddress(
      chainId,
      true,
      isGmxAccount
    )
  }) : void 0;
  const subaccount = subaccountValidations?.isValid ? rawSubaccount : void 0;
  const tokenPermits = isGmxAccount ? [] : rawTokenPermits;
  const baseRelayerGasLimit = estimateRelayerGasLimit({
    gasLimits,
    tokenPermitsCount: tokenPermits.length,
    feeSwapsCount: 1,
    feeExternalCallsGasLimit: 0n,
    oraclePriceCount: 2,
    l1GasLimit: l1Reference?.gasLimit ?? 0n,
    transactionPayloadGasLimit
  });
  const baseRelayerFeeAmount = baseRelayerGasLimit * gasPrice;
  const baseTotalRelayerFeeTokenAmount = baseRelayerFeeAmount + executionFeeAmount;
  const baseRelayFeeParams = getRelayerFeeParams({
    chainId,
    account,
    gasPaymentToken,
    relayerFeeToken,
    relayerFeeAmount: baseRelayerFeeAmount,
    totalRelayerFeeTokenAmount: baseTotalRelayerFeeTokenAmount,
    gasPaymentTokenAsCollateralAmount,
    transactionExternalCalls,
    feeExternalSwapQuote: void 0,
    findFeeSwapPath
  });
  if (!baseRelayFeeParams) {
    return void 0;
  }
  const baseRelayParams = getRawRelayerParams({
    chainId,
    gasPaymentTokenAddress: gasPaymentToken.address,
    relayerFeeTokenAddress: relayerFeeToken.address,
    feeParams: baseRelayFeeParams.feeParams,
    externalCalls: baseRelayFeeParams.externalCalls,
    tokenPermits,
    marketsInfoData
  });
  const baseTxn = await expressTransactionBuilder({
    relayParams: baseRelayParams,
    gasPaymentParams: baseRelayFeeParams.gasPaymentParams,
    subaccount
  });
  const l1GasLimit = l1Reference ? approximateL1GasBuffer({
    l1Reference,
    sizeOfData: BigInt(size(baseTxn.txnData.callData))
  }) : 0n;
  let gasLimit;
  if (estimationMethod === "estimateGas" && provider) {
    const baseGasPaymentValidations = getGasPaymentValidations({
      gasPaymentToken,
      gasPaymentTokenAsCollateralAmount,
      gasPaymentTokenAmount: baseRelayFeeParams.gasPaymentParams.gasPaymentTokenAmount,
      gasPaymentAllowanceData,
      isGmxAccount,
      tokenPermits
    });
    if (baseGasPaymentValidations.isOutGasTokenBalance || baseGasPaymentValidations.needGasPaymentTokenApproval || !transactionParams.isValid) {
      return void 0;
    }
    try {
      gasLimit = await estimateGasLimit(provider, {
        from: GMX_SIMULATION_ORIGIN,
        to: baseTxn.txnData.to,
        data: baseTxn.txnData.callData,
        value: 0n
      });
    } catch (error) {
      const extendedError = extendError(error, {
        data: {
          estimationMethod
        }
      });
      emitMetricEvent({
        event: "expressOrders.estimateGas",
        isError: true,
        data: extendedError
      });
      return void 0;
    }
  } else {
    gasLimit = estimateRelayerGasLimit({
      gasLimits,
      tokenPermitsCount: tokenPermits.length,
      feeSwapsCount: baseRelayFeeParams.feeParams.feeSwapPath.length,
      feeExternalCallsGasLimit: baseRelayFeeParams.feeExternalSwapGasLimit,
      oraclePriceCount: baseRelayParams.oracleParams.tokens.length,
      l1GasLimit,
      transactionPayloadGasLimit
    });
  }
  let relayerFeeAmount;
  if (isSponsoredCall) {
    relayerFeeAmount = applyFactor(
      gasLimit * gasPrice,
      gasLimits.gelatoRelayFeeMultiplierFactor
    );
  } else {
    relayerFeeAmount = await gelatoRelay.getEstimatedFee(
      BigInt(chainId),
      relayerFeeToken.address,
      gasLimit,
      false
    );
  }
  const buffer = bigMath.mulDiv(
    relayerFeeAmount,
    BigInt(bufferBps),
    BASIS_POINTS_DIVISOR_BIGINT
  );
  relayerFeeAmount += buffer;
  const totalRelayerFeeTokenAmount = relayerFeeAmount + executionFeeAmount;
  const finalRelayFeeParams = getRelayerFeeParams({
    chainId,
    account,
    gasPaymentToken,
    relayerFeeToken,
    relayerFeeAmount,
    totalRelayerFeeTokenAmount,
    gasPaymentTokenAsCollateralAmount,
    transactionExternalCalls,
    feeExternalSwapQuote: void 0,
    findFeeSwapPath
  });
  if (!finalRelayFeeParams) {
    return void 0;
  }
  const finalRelayParams = getRawRelayerParams({
    chainId,
    gasPaymentTokenAddress: gasPaymentToken.address,
    relayerFeeTokenAddress: relayerFeeToken.address,
    feeParams: finalRelayFeeParams.feeParams,
    externalCalls: finalRelayFeeParams.externalCalls,
    tokenPermits,
    marketsInfoData
  });
  const gasPaymentValidations = getGasPaymentValidations({
    gasPaymentToken,
    gasPaymentTokenAmount: finalRelayFeeParams.gasPaymentParams.gasPaymentTokenAmount,
    gasPaymentTokenAsCollateralAmount,
    gasPaymentAllowanceData,
    isGmxAccount,
    tokenPermits
  });
  if (requireValidations && !getIsValidExpressParams({
    chainId,
    gasPaymentValidations,
    isSponsoredCall
  })) {
    return void 0;
  }
  return {
    chainId,
    subaccount,
    relayParamsPayload: finalRelayParams,
    isSponsoredCall,
    gasPaymentParams: finalRelayFeeParams.gasPaymentParams,
    executionFeeAmount,
    executionGasLimit,
    estimationMethod,
    gasLimit,
    l1GasLimit,
    gasPrice,
    subaccountValidations,
    gasPaymentValidations,
    isGmxAccount
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
async function buildAndSignExpressBatchOrderTxn({
  chainId,
  batchParams,
  relayParamsPayload,
  relayerFeeTokenAddress,
  relayerFeeAmount,
  subaccount,
  signer,
  isGmxAccount,
  emptySignature = false
}) {
  const messageSigner = subaccount ? subaccount.signer : signer;
  const relayRouterAddress = getOrderRelayRouterAddress(
    chainId,
    subaccount !== void 0,
    isGmxAccount
  );
  const params = {
    account: signer.address,
    messageSigner,
    relayPayload: {
      ...relayParamsPayload,
      deadline: BigInt(
        nowInSeconds() + DEFAULT_EXPRESS_ORDER_DEADLINE_DURATION
      ),
      userNonce: BigInt(nowInSeconds())
    },
    subaccountApproval: subaccount?.signedApproval,
    paramsLists: getBatchParamsLists(batchParams)
  };
  let signature;
  if (emptySignature) {
    signature = "0x";
  } else {
    const signatureParams = await getBatchSignatureParams({
      signer: params.messageSigner,
      relayParams: params.relayPayload,
      batchParams,
      chainId,
      account: params.account,
      subaccountApproval: params.subaccountApproval,
      relayRouterAddress
    });
    signature = await signTypedData(signatureParams);
    validateSignature({
      signatureParams,
      signature,
      expectedAccount: params.messageSigner.address,
      errorSource: "expressOrders.batch.signatureValidation",
      silent: true
    });
  }
  let batchCalldata;
  if (isGmxAccount) {
    const srcChainId = await getMultichainInfoFromSigner(signer, chainId) ?? chainId;
    if (!srcChainId) {
      throw new Error("No srcChainId");
    }
    if (subaccount) {
      batchCalldata = encodeFunctionData({
        abi: abis.MultichainSubaccountRouter,
        functionName: "batch",
        args: [
          {
            ...params.relayPayload,
            signature
          },
          subaccount.signedApproval,
          params.account,
          BigInt(srcChainId),
          subaccount.signedApproval?.subaccount,
          params.paramsLists
        ]
      });
    } else {
      batchCalldata = encodeFunctionData({
        abi: abis.MultichainOrderRouter,
        functionName: "batch",
        args: [
          {
            ...params.relayPayload,
            signature
          },
          params.account,
          BigInt(srcChainId),
          params.paramsLists
        ]
      });
    }
  } else {
    if (subaccount) {
      batchCalldata = encodeFunctionData({
        abi: abis.SubaccountGelatoRelayRouter,
        functionName: "batch",
        args: [
          {
            ...params.relayPayload,
            signature
          },
          subaccount.signedApproval,
          params.account,
          subaccount.signedApproval?.subaccount,
          params.paramsLists
        ]
      });
    } else {
      batchCalldata = encodeFunctionData({
        abi: abis.GelatoRelayRouter,
        functionName: "batch",
        args: [
          {
            ...params.relayPayload,
            signature
          },
          params.account,
          params.paramsLists
        ]
      });
    }
  }
  return {
    callData: batchCalldata,
    to: relayRouterAddress,
    feeToken: relayerFeeTokenAddress,
    feeAmount: relayerFeeAmount
  };
}
async function getBatchSignatureParams({
  signer,
  relayParams,
  batchParams,
  chainId,
  account,
  subaccountApproval,
  relayRouterAddress
}) {
  const types = {
    Batch: [
      { name: "account", type: "address" },
      { name: "createOrderParamsList", type: "CreateOrderParams[]" },
      { name: "updateOrderParamsList", type: "UpdateOrderParams[]" },
      { name: "cancelOrderKeys", type: "bytes32[]" },
      { name: "relayParams", type: "bytes32" },
      { name: "subaccountApproval", type: "bytes32" }
    ],
    CreateOrderParams: [
      { name: "addresses", type: "CreateOrderAddresses" },
      { name: "numbers", type: "CreateOrderNumbers" },
      { name: "orderType", type: "uint256" },
      { name: "decreasePositionSwapType", type: "uint256" },
      { name: "isLong", type: "bool" },
      { name: "shouldUnwrapNativeToken", type: "bool" },
      { name: "autoCancel", type: "bool" },
      { name: "referralCode", type: "bytes32" },
      { name: "dataList", type: "bytes32[]" }
    ],
    CreateOrderAddresses: [
      { name: "receiver", type: "address" },
      { name: "cancellationReceiver", type: "address" },
      { name: "callbackContract", type: "address" },
      { name: "uiFeeReceiver", type: "address" },
      { name: "market", type: "address" },
      { name: "initialCollateralToken", type: "address" },
      { name: "swapPath", type: "address[]" }
    ],
    CreateOrderNumbers: [
      { name: "sizeDeltaUsd", type: "uint256" },
      { name: "initialCollateralDeltaAmount", type: "uint256" },
      { name: "triggerPrice", type: "uint256" },
      { name: "acceptablePrice", type: "uint256" },
      { name: "executionFee", type: "uint256" },
      { name: "callbackGasLimit", type: "uint256" },
      { name: "minOutputAmount", type: "uint256" },
      { name: "validFromTime", type: "uint256" }
    ],
    UpdateOrderParams: [
      { name: "key", type: "bytes32" },
      { name: "sizeDeltaUsd", type: "uint256" },
      { name: "acceptablePrice", type: "uint256" },
      { name: "triggerPrice", type: "uint256" },
      { name: "minOutputAmount", type: "uint256" },
      { name: "validFromTime", type: "uint256" },
      { name: "autoCancel", type: "bool" },
      { name: "executionFeeIncrease", type: "uint256" }
    ]
  };
  const srcChainId = await getMultichainInfoFromSigner(signer, chainId);
  const domain = getGelatoRelayRouterDomain(
    srcChainId ?? chainId,
    relayRouterAddress
  );
  const paramsLists = getBatchParamsLists(batchParams);
  const typedData = {
    account: subaccountApproval ? account : zeroAddress,
    createOrderParamsList: paramsLists.createOrderParamsList,
    updateOrderParamsList: paramsLists.updateOrderParamsList,
    cancelOrderKeys: paramsLists.cancelOrderKeys,
    relayParams: hashRelayParams(relayParams),
    subaccountApproval: subaccountApproval ? hashSubaccountApproval(subaccountApproval) : zeroHash
  };
  return {
    signer,
    types,
    typedData,
    domain,
    shouldUseSignerMethod: subaccountApproval !== void 0
  };
}
function getBatchParamsLists(batchParams) {
  return {
    createOrderParamsList: batchParams.createOrderParams.map((p) => ({
      addresses: updateExpressOrdersAddresses(p.orderPayload.addresses),
      numbers: p.orderPayload.numbers,
      orderType: p.orderPayload.orderType,
      decreasePositionSwapType: p.orderPayload.decreasePositionSwapType,
      isLong: p.orderPayload.isLong,
      shouldUnwrapNativeToken: p.orderPayload.shouldUnwrapNativeToken,
      autoCancel: p.orderPayload.autoCancel,
      referralCode: p.orderPayload.referralCode,
      dataList: p.orderPayload.dataList
    })),
    updateOrderParamsList: batchParams.updateOrderParams.map((p) => ({
      key: p.updatePayload.orderKey,
      sizeDeltaUsd: p.updatePayload.sizeDeltaUsd,
      acceptablePrice: p.updatePayload.acceptablePrice,
      triggerPrice: p.updatePayload.triggerPrice,
      minOutputAmount: p.updatePayload.minOutputAmount,
      validFromTime: p.updatePayload.validFromTime,
      autoCancel: p.updatePayload.autoCancel,
      executionFeeIncrease: p.updatePayload.executionFeeTopUp
    })),
    cancelOrderKeys: batchParams.cancelOrderParams.map((p) => p.orderKey)
  };
}
async function getMultichainInfoFromSigner(signer, chainId) {
  const srcChainId = await signer.getNetwork().then((n) => Number(n.chainId));
  if (!isSourceChain(srcChainId)) {
    return void 0;
  }
  const isMultichain = srcChainId !== chainId;
  if (!isMultichain) {
    return void 0;
  }
  return srcChainId;
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
async function buildAndSignBridgeOutTxn({
  chainId,
  srcChainId,
  relayParamsPayload,
  params,
  signer,
  account,
  emptySignature = false,
  relayerFeeTokenAddress,
  relayerFeeAmount
}) {
  let signature;
  const relayParams = {
    ...relayParamsPayload,
    deadline: BigInt(nowInSeconds() + DEFAULT_EXPRESS_ORDER_DEADLINE_DURATION)
  };
  if (emptySignature) {
    signature = "0x";
  } else {
    if (!signer) {
      throw new Error("Signer is required");
    }
    signature = await signBridgeOutPayload({
      relayParams,
      params,
      signer,
      chainId,
      srcChainId
    });
  }
  const bridgeOutCallData = encodeFunctionData({
    abi: abis.MultichainTransferRouter,
    functionName: "bridgeOut",
    args: [
      {
        ...relayParams,
        signature
      },
      account,
      BigInt(srcChainId),
      params
    ]
  });
  return {
    callData: bridgeOutCallData,
    to: getContract(chainId, "MultichainTransferRouter"),
    feeToken: relayerFeeTokenAddress,
    feeAmount: relayerFeeAmount
  };
}
async function signBridgeOutPayload({
  signer,
  relayParams,
  params,
  chainId,
  srcChainId
}) {
  const types = {
    BridgeOut: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "minAmountOut", type: "uint256" },
      { name: "provider", type: "address" },
      { name: "data", type: "bytes" },
      { name: "relayParams", type: "bytes32" }
    ]
  };
  const typedData = {
    token: params.token,
    amount: params.amount,
    minAmountOut: params.minAmountOut,
    provider: params.provider,
    data: params.data,
    relayParams: hashRelayParams(relayParams)
  };
  const domain = getGelatoRelayRouterDomain(
    srcChainId,
    getContract(chainId, "MultichainTransferRouter")
  );
  return signTypedData({ signer, domain, types, typedData });
}
async function buildAndSignSetTraderReferralCodeTxn({
  chainId,
  relayParamsPayload,
  params,
  signer,
  emptySignature = false,
  relayerFeeTokenAddress,
  relayerFeeAmount
}) {
  const srcChainId = await getMultichainInfoFromSigner(signer, chainId);
  if (!srcChainId) {
    throw new Error("No srcChainId");
  }
  const address = signer.address;
  let signature;
  if (emptySignature) {
    signature = "0x";
  } else {
    signature = await signBridgeOutPayload({
      relayParams: relayParamsPayload,
      params,
      signer,
      chainId,
      srcChainId
    });
  }
  const bridgeOutCallData = encodeFunctionData({
    abi: abis.MultichainTransferRouter,
    functionName: "bridgeOut",
    args: [
      {
        ...relayParamsPayload,
        signature
      },
      address,
      BigInt(srcChainId),
      params
    ]
  });
  return {
    callData: bridgeOutCallData,
    to: getContract(chainId, "MultichainTransferRouter"),
    feeToken: relayerFeeTokenAddress,
    feeAmount: relayerFeeAmount
  };
}
async function signSetTraderReferralCode({
  signer,
  relayParams,
  referralCode,
  chainId,
  srcChainId,
  shouldUseSignerMethod
}) {
  const types = {
    SetTraderReferralCode: [
      { name: "referralCode", type: "bytes32" },
      { name: "relayParams", type: "bytes32" }
    ]
  };
  const domain = getGelatoRelayRouterDomain(
    srcChainId ?? chainId,
    getContract(chainId, "MultichainOrderRouter")
  );
  const typedData = {
    referralCode,
    relayParams: hashRelayParams(relayParams)
  };
  return signTypedData({
    signer,
    domain,
    types,
    typedData,
    shouldUseSignerMethod
  });
}
function updateExpressOrdersAddresses(addresses) {
  return {
    ...addresses,
    receiver: addresses.receiver ?? zeroAddress,
    uiFeeReceiver: setUiFeeReceiverIsExpress(addresses.uiFeeReceiver, true)
  };
}
async function validateSignature({
  signatureParams,
  signature,
  expectedAccount,
  silent = false,
  errorSource = "validateSignature"
}) {
  try {
    const recoveredAddress = await recoverTypedDataAddress({
      domain: {
        ...signatureParams.domain,
        verifyingContract: signatureParams.domain.verifyingContract
      },
      types: signatureParams.types,
      primaryType: "Batch",
      message: signatureParams.typedData,
      signature
    });
    const isValid = recoveredAddress.toLowerCase() === expectedAccount.toLowerCase();
    if (!isValid) {
      throw extendError(new Error("Signature validation failed"), {
        data: {
          recoveredAddress,
          expectedAccount,
          signature
        }
      });
    }
  } catch (error) {
    emitMetricEvent({
      event: errorSource || "unknown",
      isError: true,
      data: error
    });
    if (silent) {
      return;
    }
    throw extendError(error, {
      data: {
        signature,
        expectedAccount
      }
    });
  }
}

export { buildAndSignBridgeOutTxn, buildAndSignExpressBatchOrderTxn, buildAndSignSetTraderReferralCodeTxn, estimateBatchExpressParams, estimateExpressParams, getBatchSignatureParams, getGasPaymentValidations, getIsValidExpressParams, getMultichainInfoFromSigner, getOrderRelayRouterAddress, signSetTraderReferralCode, validateSignature };
//# sourceMappingURL=expressOrderUtils.js.map
//# sourceMappingURL=expressOrderUtils.js.map