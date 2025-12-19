import uniq from 'lodash/uniq';
import { zeroHash, zeroAddress, encodeFunctionData } from 'viem';
import { abis } from '../../../abis/index.js';
import ExchangeRouterAbi from '../../../abis/ExchangeRouter.js';
import ERC20ABI from '../../../abis/Token.js';
import { getHighExecutionFee, getExcessiveExecutionFee } from '../../../configs/chains.js';
import { getContract } from '../../../configs/contracts.js';
import { getToken, NATIVE_TOKEN_ADDRESS, getWrappedToken, convertTokenAddress } from '../../../configs/tokens.js';
import { DecreasePositionSwapType } from '../../../domain/decrease/types.js';
import { OrderType } from '../../../domain/orders/types.js';
import { isSwapOrderType, isIncreaseOrderType, isMarketOrderType } from '../../../domain/orders/utils.js';
import { convertToContractPrice } from '../../../domain/pricing/contractPrice.js';
import { applySlippageToMinOut, applySlippageToPrice } from '../../../domain/pricing/slippage.js';
import { convertToUsd } from '../../../domain/tokens/utils.js';
import { getTwapValidFromTime } from '../../../domain/twap/utils.js';
import { createTwapUiFeeReceiver } from '../../../domain/uiFeeReceiver/uiFeeReceiver.js';
import { MaxUint256, expandDecimals, USD_DECIMALS } from '../../../lib/numbers/index.js';
import { getByKey } from '../../../lib/objects/index.js';

const EMPTY_BATCH_ORDER_PARAMS = {
  createOrderParams: [],
  updateOrderParams: [],
  cancelOrderParams: []
};
function buildSwapOrderPayload(p) {
  const tokenTransfersParams = buildTokenTransfersParamsForIncreaseOrSwap(p);
  const orderPayload = {
    addresses: {
      receiver: p.receiver,
      cancellationReceiver: zeroAddress,
      callbackContract: zeroAddress,
      uiFeeReceiver: p.uiFeeReceiver ?? zeroAddress,
      market: zeroAddress,
      initialCollateralToken: tokenTransfersParams.initialCollateralTokenAddress,
      swapPath: tokenTransfersParams.swapPath
    },
    numbers: {
      sizeDeltaUsd: 0n,
      initialCollateralDeltaAmount: tokenTransfersParams.initialCollateralDeltaAmount,
      // triggerRatio of limit swaps is used in trade history
      triggerPrice: p.triggerRatio ?? 0n,
      acceptablePrice: 0n,
      executionFee: p.executionFeeAmount,
      callbackGasLimit: 0n,
      minOutputAmount: applySlippageToMinOut(
        p.allowedSlippage,
        tokenTransfersParams.minOutputAmount
      ),
      validFromTime: p.validFromTime ?? 0n
    },
    orderType: p.orderType,
    decreasePositionSwapType: DecreasePositionSwapType.NoSwap,
    isLong: false,
    shouldUnwrapNativeToken: tokenTransfersParams.isNativePayment || tokenTransfersParams.isNativeReceive,
    autoCancel: p.autoCancel,
    referralCode: p.referralCode ?? zeroHash,
    dataList: []
  };
  return {
    params: p,
    orderPayload,
    tokenTransfersParams
  };
}
function buildIncreaseOrderPayload(p) {
  const tokenTransfersParams = buildTokenTransfersParamsForIncreaseOrSwap({
    ...p,
    minOutputAmount: 0n,
    receiveTokenAddress: void 0
  });
  const indexToken = getToken(p.chainId, p.indexTokenAddress);
  let acceptablePrice;
  if (p.acceptablePrice === MaxUint256) {
    acceptablePrice = MaxUint256;
  } else {
    acceptablePrice = convertToContractPrice(
      applySlippageToPrice(
        p.allowedSlippage,
        p.acceptablePrice,
        true,
        p.isLong
      ),
      indexToken.decimals
    );
  }
  let triggerPrice;
  if (p.triggerPrice === MaxUint256) {
    triggerPrice = MaxUint256;
  } else {
    triggerPrice = convertToContractPrice(
      p.triggerPrice ?? 0n,
      indexToken.decimals
    );
  }
  const orderPayload = {
    addresses: {
      receiver: p.receiver,
      cancellationReceiver: zeroAddress,
      callbackContract: zeroAddress,
      uiFeeReceiver: p.uiFeeReceiver ?? zeroAddress,
      market: p.marketAddress,
      initialCollateralToken: tokenTransfersParams.initialCollateralTokenAddress,
      swapPath: tokenTransfersParams.swapPath
    },
    numbers: {
      sizeDeltaUsd: p.sizeDeltaUsd,
      initialCollateralDeltaAmount: tokenTransfersParams.initialCollateralDeltaAmount,
      triggerPrice,
      acceptablePrice,
      executionFee: p.executionFeeAmount,
      callbackGasLimit: 0n,
      minOutputAmount: applySlippageToMinOut(
        p.allowedSlippage,
        tokenTransfersParams.minOutputAmount
      ),
      validFromTime: p.validFromTime ?? 0n
    },
    orderType: p.orderType,
    decreasePositionSwapType: DecreasePositionSwapType.NoSwap,
    isLong: p.isLong,
    shouldUnwrapNativeToken: tokenTransfersParams.isNativePayment,
    autoCancel: p.autoCancel,
    referralCode: p.referralCode ?? zeroHash,
    dataList: []
  };
  return {
    params: p,
    orderPayload,
    tokenTransfersParams
  };
}
function buildDecreaseOrderPayload(p) {
  const indexToken = getToken(p.chainId, p.indexTokenAddress);
  const tokenTransfersParams = buildTokenTransfersParamsForDecrease(p);
  let acceptablePrice;
  if (p.acceptablePrice === MaxUint256) {
    acceptablePrice = MaxUint256;
  } else {
    acceptablePrice = convertToContractPrice(
      applySlippageToPrice(
        p.allowedSlippage,
        p.acceptablePrice,
        false,
        p.isLong
      ),
      indexToken.decimals
    );
  }
  let triggerPrice;
  if (p.triggerPrice === MaxUint256) {
    triggerPrice = MaxUint256;
  } else {
    triggerPrice = convertToContractPrice(
      p.triggerPrice ?? 0n,
      indexToken.decimals
    );
  }
  const orderPayload = {
    addresses: {
      receiver: p.receiver,
      cancellationReceiver: zeroAddress,
      callbackContract: zeroAddress,
      uiFeeReceiver: p.uiFeeReceiver ?? zeroAddress,
      market: p.marketAddress,
      initialCollateralToken: tokenTransfersParams.initialCollateralTokenAddress,
      swapPath: tokenTransfersParams.swapPath
    },
    numbers: {
      sizeDeltaUsd: p.sizeDeltaUsd,
      initialCollateralDeltaAmount: tokenTransfersParams.initialCollateralDeltaAmount,
      triggerPrice,
      acceptablePrice,
      executionFee: p.executionFeeAmount,
      callbackGasLimit: 0n,
      minOutputAmount: applySlippageToMinOut(
        p.allowedSlippage,
        tokenTransfersParams.minOutputAmount
      ),
      validFromTime: p.validFromTime ?? 0n
    },
    orderType: p.orderType,
    decreasePositionSwapType: p.decreasePositionSwapType,
    isLong: p.isLong,
    shouldUnwrapNativeToken: p.receiveTokenAddress === NATIVE_TOKEN_ADDRESS,
    autoCancel: p.autoCancel,
    referralCode: p.referralCode ?? zeroHash,
    dataList: []
  };
  return {
    params: p,
    orderPayload,
    tokenTransfersParams
  };
}
function buildTwapOrdersPayloads(p, twapParams) {
  const uiFeeReceiver = createTwapUiFeeReceiver({
    numberOfParts: twapParams.numberOfParts
  });
  if (isSwapOrderType(p.orderType)) {
    return Array.from({ length: twapParams.numberOfParts }, (_, i) => {
      const params = p;
      return buildSwapOrderPayload({
        chainId: params.chainId,
        receiver: params.receiver,
        executionGasLimit: params.executionGasLimit,
        payTokenAddress: params.payTokenAddress,
        receiveTokenAddress: params.receiveTokenAddress,
        swapPath: params.swapPath,
        externalSwapQuote: void 0,
        minOutputAmount: 0n,
        triggerRatio: params.triggerRatio,
        referralCode: params.referralCode,
        autoCancel: params.autoCancel,
        allowedSlippage: 0,
        ...params.expectedOutputAmount !== void 0 && {
          expectedOutputAmount: params.expectedOutputAmount / BigInt(twapParams.numberOfParts)
        },
        payTokenAmount: params.payTokenAmount / BigInt(twapParams.numberOfParts),
        executionFeeAmount: params.executionFeeAmount / BigInt(twapParams.numberOfParts),
        validFromTime: getTwapValidFromTime(
          twapParams.duration,
          twapParams.numberOfParts,
          i
        ),
        orderType: OrderType.LimitSwap,
        uiFeeReceiver
      });
    });
  }
  if (isIncreaseOrderType(p.orderType)) {
    return Array.from({ length: twapParams.numberOfParts }, (_, i) => {
      const params = p;
      const acceptablePrice = params.isLong ? MaxUint256 : 0n;
      const triggerPrice = acceptablePrice;
      return buildIncreaseOrderPayload({
        chainId: params.chainId,
        receiver: params.receiver,
        executionGasLimit: params.executionGasLimit,
        referralCode: params.referralCode,
        autoCancel: params.autoCancel,
        swapPath: params.swapPath,
        externalSwapQuote: void 0,
        marketAddress: params.marketAddress,
        indexTokenAddress: params.indexTokenAddress,
        isLong: params.isLong,
        sizeDeltaUsd: params.sizeDeltaUsd / BigInt(twapParams.numberOfParts),
        sizeDeltaInTokens: params.sizeDeltaInTokens / BigInt(twapParams.numberOfParts),
        payTokenAddress: params.payTokenAddress,
        allowedSlippage: 0,
        payTokenAmount: params.payTokenAmount / BigInt(twapParams.numberOfParts),
        collateralTokenAddress: params.collateralTokenAddress,
        collateralDeltaAmount: params.collateralDeltaAmount / BigInt(twapParams.numberOfParts),
        executionFeeAmount: params.executionFeeAmount / BigInt(twapParams.numberOfParts),
        validFromTime: getTwapValidFromTime(
          twapParams.duration,
          twapParams.numberOfParts,
          i
        ),
        orderType: OrderType.LimitIncrease,
        acceptablePrice,
        triggerPrice,
        uiFeeReceiver
      });
    });
  }
  return Array.from({ length: twapParams.numberOfParts }, (_, i) => {
    const params = p;
    const acceptablePrice = !params.isLong ? MaxUint256 : 0n;
    const triggerPrice = acceptablePrice;
    return buildDecreaseOrderPayload({
      chainId: params.chainId,
      receiver: params.receiver,
      executionGasLimit: params.executionGasLimit,
      referralCode: params.referralCode,
      autoCancel: params.autoCancel,
      swapPath: params.swapPath,
      externalSwapQuote: void 0,
      marketAddress: params.marketAddress,
      indexTokenAddress: params.indexTokenAddress,
      isLong: params.isLong,
      collateralTokenAddress: params.collateralTokenAddress,
      collateralDeltaAmount: params.collateralDeltaAmount / BigInt(twapParams.numberOfParts),
      sizeDeltaUsd: params.sizeDeltaUsd / BigInt(twapParams.numberOfParts),
      sizeDeltaInTokens: params.sizeDeltaInTokens / BigInt(twapParams.numberOfParts),
      executionFeeAmount: params.executionFeeAmount / BigInt(twapParams.numberOfParts),
      validFromTime: getTwapValidFromTime(
        twapParams.duration,
        twapParams.numberOfParts,
        i
      ),
      orderType: OrderType.LimitDecrease,
      acceptablePrice,
      triggerPrice,
      allowedSlippage: 0,
      uiFeeReceiver,
      minOutputUsd: params.minOutputUsd / BigInt(twapParams.numberOfParts),
      receiveTokenAddress: params.receiveTokenAddress,
      decreasePositionSwapType: params.decreasePositionSwapType
    });
  });
}
function getIsTwapOrderPayload(p) {
  return p.numbers.validFromTime !== 0n;
}
function buildUpdateOrderPayload(p) {
  const indexToken = getToken(p.chainId, p.indexTokenAddress);
  return {
    params: p,
    updatePayload: {
      orderKey: p.orderKey,
      sizeDeltaUsd: p.sizeDeltaUsd,
      triggerPrice: isSwapOrderType(p.orderType) ? p.triggerPrice : convertToContractPrice(p.triggerPrice, indexToken.decimals),
      acceptablePrice: convertToContractPrice(
        p.acceptablePrice,
        indexToken.decimals
      ),
      minOutputAmount: p.minOutputAmount,
      autoCancel: p.autoCancel,
      validFromTime: 0n,
      executionFeeTopUp: p.executionFeeTopUp
    }
  };
}
function getBatchTotalExecutionFee({
  batchParams: { createOrderParams, updateOrderParams },
  tokensData,
  chainId
}) {
  let feeTokenAmount = 0n;
  let gasLimit = 0n;
  const wnt = getByKey(tokensData, getWrappedToken(chainId).address);
  if (!wnt) {
    return void 0;
  }
  for (const co of createOrderParams) {
    feeTokenAmount += co.orderPayload.numbers.executionFee;
    gasLimit += co.params.executionGasLimit;
  }
  for (const uo of updateOrderParams) {
    feeTokenAmount += uo.updatePayload.executionFeeTopUp;
  }
  const feeUsd = convertToUsd(
    feeTokenAmount,
    wnt.decimals,
    wnt.prices.maxPrice
  );
  const isFeeHigh = feeUsd > expandDecimals(getHighExecutionFee(chainId), USD_DECIMALS);
  const isFeeVeryHigh = feeUsd > expandDecimals(getExcessiveExecutionFee(chainId), USD_DECIMALS);
  return {
    feeTokenAmount,
    gasLimit,
    feeUsd,
    feeToken: wnt,
    isFeeHigh,
    isFeeVeryHigh
  };
}
function getBatchTotalPayCollateralAmount(batchParams) {
  const payAmounts = {};
  for (const co of batchParams.createOrderParams) {
    const payTokenAddress = co.tokenTransfersParams?.payTokenAddress;
    const payTokenAmount = co.tokenTransfersParams?.payTokenAmount;
    if (payTokenAddress && payTokenAmount !== void 0) {
      payAmounts[payTokenAddress] = (payAmounts[payTokenAddress] ?? 0n) + payTokenAmount;
    }
  }
  return payAmounts;
}
function getBatchExternalSwapGasLimit(batchParams) {
  return batchParams.createOrderParams.reduce((acc, co) => {
    const externalSwapQuote = co.params.externalSwapQuote;
    if (externalSwapQuote) {
      return acc + externalSwapQuote.txnData.estimatedGas;
    }
    return acc;
  }, 0n);
}
function buildTokenTransfersParamsForDecrease({
  chainId,
  executionFeeAmount,
  collateralTokenAddress,
  collateralDeltaAmount,
  swapPath,
  minOutputUsd,
  receiveTokenAddress
}) {
  const orderVaultAddress = getContract(chainId, "OrderVault");
  const { tokenTransfers, value } = combineTransfers([
    {
      tokenAddress: NATIVE_TOKEN_ADDRESS,
      destination: orderVaultAddress,
      amount: executionFeeAmount
    }
  ]);
  return {
    isNativePayment: false,
    isNativeReceive: receiveTokenAddress === NATIVE_TOKEN_ADDRESS,
    initialCollateralTokenAddress: convertTokenAddress(
      chainId,
      collateralTokenAddress,
      "wrapped"
    ),
    initialCollateralDeltaAmount: collateralDeltaAmount,
    tokenTransfers,
    payTokenAddress: zeroAddress,
    payTokenAmount: 0n,
    minOutputAmount: minOutputUsd,
    swapPath,
    value,
    externalCalls: void 0
  };
}
function buildTokenTransfersParamsForIncreaseOrSwap({
  chainId,
  receiver,
  payTokenAddress,
  payTokenAmount,
  receiveTokenAddress,
  executionFeeAmount,
  externalSwapQuote,
  minOutputAmount,
  swapPath
}) {
  const isNativePayment = payTokenAddress === NATIVE_TOKEN_ADDRESS;
  const isNativeReceive = receiveTokenAddress === NATIVE_TOKEN_ADDRESS;
  const orderVaultAddress = getContract(chainId, "OrderVault");
  const externalHandlerAddress = getContract(chainId, "ExternalHandler");
  let finalPayTokenAmount = payTokenAmount;
  const { tokenTransfers, value } = combineTransfers([
    {
      tokenAddress: NATIVE_TOKEN_ADDRESS,
      destination: orderVaultAddress,
      amount: executionFeeAmount
    },
    {
      tokenAddress: payTokenAddress,
      destination: externalSwapQuote ? externalHandlerAddress : orderVaultAddress,
      amount: payTokenAmount
    }
  ]);
  let initialCollateralTokenAddress = convertTokenAddress(
    chainId,
    payTokenAddress,
    "wrapped"
  );
  let initialCollateralDeltaAmount = payTokenAmount;
  let externalCalls;
  if (externalSwapQuote && receiver) {
    initialCollateralTokenAddress = convertTokenAddress(
      chainId,
      externalSwapQuote.outTokenAddress,
      "wrapped"
    );
    initialCollateralDeltaAmount = 0n;
    externalCalls = getExternalCallsPayload({
      chainId,
      account: receiver,
      quote: externalSwapQuote
    });
    finalPayTokenAmount = externalSwapQuote.amountIn;
  }
  return {
    isNativePayment,
    isNativeReceive,
    initialCollateralTokenAddress,
    initialCollateralDeltaAmount,
    tokenTransfers,
    payTokenAddress,
    payTokenAmount: finalPayTokenAmount,
    minOutputAmount,
    swapPath,
    value,
    externalCalls
  };
}
function getBatchExternalCalls(batchParams) {
  const externalCalls = [];
  for (const createOrderParams of batchParams.createOrderParams) {
    if (createOrderParams.tokenTransfersParams?.externalCalls) {
      externalCalls.push(createOrderParams.tokenTransfersParams.externalCalls);
    }
  }
  return combineExternalCalls(externalCalls);
}
function combineExternalCalls(externalCalls) {
  const sendTokensMap = {};
  const refundTokensMap = {};
  const externalCallTargets = [];
  const externalCallDataList = [];
  for (const call of externalCalls) {
    for (const [index, tokenAddress] of call.sendTokens.entries()) {
      sendTokensMap[tokenAddress] = (sendTokensMap[tokenAddress] ?? 0n) + call.sendAmounts[index];
    }
    for (const [index, tokenAddress] of call.refundTokens.entries()) {
      refundTokensMap[tokenAddress] = call.refundReceivers[index];
    }
    externalCallTargets.push(...call.externalCallTargets);
    externalCallDataList.push(...call.externalCallDataList);
  }
  return {
    sendTokens: Object.keys(sendTokensMap),
    sendAmounts: Object.values(sendTokensMap),
    externalCallTargets,
    externalCallDataList,
    refundReceivers: Object.values(refundTokensMap),
    refundTokens: Object.keys(refundTokensMap)
  };
}
function getEmptyExternalCallsPayload() {
  return {
    sendTokens: [],
    sendAmounts: [],
    externalCallTargets: [],
    externalCallDataList: [],
    refundReceivers: [],
    refundTokens: []
  };
}
function getExternalCallsPayload({
  chainId,
  account,
  quote
}) {
  const inTokenAddress = convertTokenAddress(
    chainId,
    quote.inTokenAddress,
    "wrapped"
  );
  const outTokenAddress = convertTokenAddress(
    chainId,
    quote.outTokenAddress,
    "wrapped"
  );
  const wntAddress = getWrappedToken(chainId).address;
  const refundTokens = uniq([inTokenAddress, outTokenAddress, wntAddress]);
  const payload = {
    sendTokens: [inTokenAddress],
    sendAmounts: [quote.amountIn],
    externalCallTargets: [],
    externalCallDataList: [],
    refundTokens,
    refundReceivers: Array.from({ length: refundTokens.length }, () => account)
  };
  if (quote.needSpenderApproval) {
    payload.externalCallTargets.push(inTokenAddress);
    payload.externalCallDataList.push(
      encodeFunctionData({
        abi: ERC20ABI,
        functionName: "approve",
        args: [quote.txnData.to, MaxUint256]
      })
    );
  }
  payload.externalCallTargets.push(quote.txnData.to);
  payload.externalCallDataList.push(quote.txnData.data);
  return payload;
}
function combineTransfers(tokenTransfers) {
  const transfersMap = {};
  let value = 0n;
  for (const transfer of tokenTransfers) {
    const key = `${transfer.tokenAddress}:${transfer.destination}`;
    if (!transfersMap[key]) {
      transfersMap[key] = { ...transfer };
    } else {
      transfersMap[key].amount += transfer.amount;
    }
    if (transfer.tokenAddress === NATIVE_TOKEN_ADDRESS) {
      value += transfer.amount;
    }
  }
  return { tokenTransfers: Object.values(transfersMap), value };
}
function getBatchOrderMulticallPayload({
  params
}) {
  const { createOrderParams, updateOrderParams, cancelOrderParams } = params;
  const multicall = [];
  let value = 0n;
  for (const params2 of createOrderParams) {
    const { multicall: createMulticall, value: createValue } = buildCreateOrderMulticall(params2);
    multicall.push(...createMulticall);
    value += createValue;
  }
  for (const update of updateOrderParams) {
    const { multicall: updateMulticall, value: updateValue } = buildUpdateOrderMulticall(update);
    multicall.push(...updateMulticall);
    value += updateValue;
  }
  for (const cancel of cancelOrderParams) {
    const { multicall: cancelMulticall, value: cancelValue } = buildCancelOrderMulticall({ params: cancel });
    multicall.push(...cancelMulticall);
    value += cancelValue;
  }
  const { encodedMulticall, callData } = encodeExchangeRouterMulticall(multicall);
  return { multicall, value, encodedMulticall, callData };
}
function buildCreateOrderMulticall(params) {
  const { tokenTransfersParams, orderPayload } = params;
  const {
    tokenTransfers = [],
    value = 0n,
    externalCalls = void 0
  } = tokenTransfersParams ?? {};
  const multicall = [];
  for (const transfer of tokenTransfers) {
    if (transfer.tokenAddress === NATIVE_TOKEN_ADDRESS) {
      multicall.push({
        method: "sendWnt",
        params: [transfer.destination, transfer.amount]
      });
    } else {
      multicall.push({
        method: "sendTokens",
        params: [transfer.tokenAddress, transfer.destination, transfer.amount]
      });
    }
  }
  if (externalCalls) {
    multicall.push({
      method: "makeExternalCalls",
      params: [
        externalCalls.externalCallTargets,
        externalCalls.externalCallDataList,
        externalCalls.refundTokens,
        externalCalls.refundReceivers
      ]
    });
  }
  multicall.push({
    method: "createOrder",
    params: [orderPayload]
  });
  return {
    multicall,
    value
  };
}
function buildUpdateOrderMulticall(updateTxn) {
  const { updatePayload, params: updateParams } = updateTxn;
  const { chainId } = updateParams;
  const orderVaultAddress = getContract(chainId, "OrderVault");
  const multicall = [];
  if (updatePayload.executionFeeTopUp > 0n) {
    multicall.push({
      method: "sendWnt",
      params: [orderVaultAddress, updatePayload.executionFeeTopUp]
    });
  }
  multicall.push({
    method: "updateOrder",
    params: [
      updatePayload.orderKey,
      updatePayload.sizeDeltaUsd,
      updatePayload.acceptablePrice,
      updatePayload.triggerPrice,
      updatePayload.minOutputAmount,
      0n,
      updatePayload.autoCancel
    ]
  });
  return {
    multicall,
    value: updatePayload.executionFeeTopUp
  };
}
function buildCancelOrderMulticall({
  params
}) {
  const { orderKey } = params;
  const multicall = [];
  multicall.push({
    method: "cancelOrder",
    params: [orderKey]
  });
  return {
    multicall,
    value: 0n
  };
}
function encodeExchangeRouterMulticall(multicall) {
  const encodedMulticall = multicall.map(
    (call) => encodeFunctionData({
      abi: abis.ExchangeRouter,
      functionName: call.method,
      args: call.params
    })
  );
  const callData = encodeFunctionData({
    abi: ExchangeRouterAbi,
    functionName: "multicall",
    args: [encodedMulticall]
  });
  return {
    encodedMulticall,
    callData
  };
}
function createCancelEncodedPayload(orderKeys = []) {
  return orderKeys.filter(Boolean).map(
    (orderKey) => encodeFunctionData({
      abi: abis.ExchangeRouter,
      functionName: "cancelOrder",
      args: [orderKey]
    })
  );
}
function createUpdateEncodedPayload({
  chainId,
  orderKey,
  sizeDeltaUsd,
  executionFee,
  indexToken,
  acceptablePrice,
  triggerPrice,
  minOutputAmount,
  autoCancel
}) {
  const orderVaultAddress = getContract(chainId, "OrderVault");
  const multicall = [];
  if (executionFee != void 0 && executionFee > 0) {
    multicall.push({
      method: "sendWnt",
      params: [orderVaultAddress, executionFee]
    });
  }
  multicall.push({
    method: "updateOrder",
    params: [
      orderKey,
      sizeDeltaUsd,
      acceptablePrice !== void 0 ? convertToContractPrice(acceptablePrice, indexToken?.decimals || 0) : 0n,
      triggerPrice !== void 0 ? convertToContractPrice(triggerPrice, indexToken?.decimals || 0) : 0n,
      minOutputAmount,
      0n,
      autoCancel
    ]
  });
  return multicall.filter(Boolean).map(
    (call) => encodeFunctionData({
      abi: abis.ExchangeRouter,
      functionName: call.method,
      args: call.params
    })
  );
}
function createDecreaseEncodedPayload({
  chainId,
  orderVaultAddress,
  ps,
  uiFeeReceiver
}) {
  const multicall = [
    ...ps.flatMap((p) => {
      const isNativeReceive = p.receiveTokenAddress === NATIVE_TOKEN_ADDRESS;
      const initialCollateralTokenAddress = convertTokenAddress(
        chainId,
        p.initialCollateralAddress,
        "wrapped"
      );
      const shouldApplySlippage = isMarketOrderType(p.orderType);
      const acceptablePrice = shouldApplySlippage ? applySlippageToPrice(
        p.allowedSlippage,
        p.acceptablePrice,
        false,
        p.isLong
      ) : p.acceptablePrice;
      const minOutputAmount = shouldApplySlippage ? applySlippageToMinOut(p.allowedSlippage, p.minOutputUsd) : p.minOutputUsd;
      const orderParams = {
        addresses: {
          cancellationReceiver: zeroAddress,
          receiver: p.account,
          initialCollateralToken: initialCollateralTokenAddress,
          callbackContract: zeroAddress,
          market: p.marketAddress,
          swapPath: p.swapPath,
          uiFeeReceiver: p.uiFeeReceiver || uiFeeReceiver || zeroAddress
        },
        numbers: {
          sizeDeltaUsd: p.sizeDeltaUsd,
          initialCollateralDeltaAmount: p.initialCollateralDeltaAmount,
          triggerPrice: convertToContractPrice(
            p.triggerPrice ?? 0n,
            p.indexToken.decimals
          ),
          acceptablePrice: convertToContractPrice(
            acceptablePrice,
            p.indexToken.decimals
          ),
          executionFee: p.executionFee,
          callbackGasLimit: 0n,
          minOutputAmount,
          validFromTime: 0n
        },
        orderType: p.orderType,
        decreasePositionSwapType: p.decreasePositionSwapType,
        isLong: p.isLong,
        shouldUnwrapNativeToken: isNativeReceive,
        autoCancel: p.autoCancel,
        referralCode: p.referralCode || zeroHash,
        dataList: p.dataList ?? []
      };
      return [
        { method: "sendWnt", params: [orderVaultAddress, p.executionFee] },
        {
          method: "createOrder",
          params: [orderParams]
        }
      ];
    })
  ];
  return multicall.filter(Boolean).map(
    (call) => encodeFunctionData({
      abi: abis.ExchangeRouter,
      functionName: call.method,
      args: call.params
    })
  );
}
function getBatchRequiredActions(orderParams) {
  if (!orderParams) {
    return 0;
  }
  return orderParams.createOrderParams.length + orderParams.updateOrderParams.length + orderParams.cancelOrderParams.length;
}
function getBatchSwapsCount(orderParams) {
  if (!orderParams) {
    return 0;
  }
  return orderParams.createOrderParams.reduce((acc, co) => {
    return acc + co.orderPayload.addresses.swapPath.length;
  }, 0);
}
function getIsEmptyBatch(orderParams) {
  if (!orderParams) {
    return true;
  }
  if (getBatchRequiredActions(orderParams) === 0) {
    return true;
  }
  const hasEmptyOrder = orderParams.createOrderParams.some(
    (o) => o.orderPayload.numbers.sizeDeltaUsd === 0n && o.orderPayload.numbers.initialCollateralDeltaAmount === 0n
  );
  return hasEmptyOrder;
}
function getBatchIsNativePayment(orderParams) {
  return orderParams.createOrderParams.some(
    (o) => o.tokenTransfersParams?.isNativePayment
  );
}
function getIsInvalidBatchReceiver(batchParams, signerAddress) {
  return batchParams.createOrderParams.some(
    (co) => co.orderPayload.addresses.receiver !== signerAddress
  );
}

export { EMPTY_BATCH_ORDER_PARAMS, buildCancelOrderMulticall, buildCreateOrderMulticall, buildDecreaseOrderPayload, buildIncreaseOrderPayload, buildSwapOrderPayload, buildTokenTransfersParamsForDecrease, buildTokenTransfersParamsForIncreaseOrSwap, buildTwapOrdersPayloads, buildUpdateOrderMulticall, buildUpdateOrderPayload, combineExternalCalls, createCancelEncodedPayload, createDecreaseEncodedPayload, createUpdateEncodedPayload, encodeExchangeRouterMulticall, getBatchExternalCalls, getBatchExternalSwapGasLimit, getBatchIsNativePayment, getBatchOrderMulticallPayload, getBatchRequiredActions, getBatchSwapsCount, getBatchTotalExecutionFee, getBatchTotalPayCollateralAmount, getEmptyExternalCallsPayload, getExternalCallsPayload, getIsEmptyBatch, getIsInvalidBatchReceiver, getIsTwapOrderPayload };
//# sourceMappingURL=orderTransactions.js.map
//# sourceMappingURL=orderTransactions.js.map