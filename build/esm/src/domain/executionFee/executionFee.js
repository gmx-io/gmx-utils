import { isContractsChain, getMinExecutionFeeUsd, getHighExecutionFee, getExcessiveExecutionFee } from '../../configs/chains.js';
import { NATIVE_TOKEN_ADDRESS } from '../../configs/tokens.js';
import { DecreasePositionSwapType } from '../decrease/types.js';
import { getTokenData, convertToTokenAmount, convertToUsd, convertBetweenTokens } from '../tokens/utils.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { applyFactor, expandDecimals, USD_DECIMALS } from '../../lib/numbers/index.js';

function getExecutionFee(chainId, gasLimits, tokensData, estimatedGasLimit, gasPrice, oraclePriceCount, numberOfParts) {
  const nativeToken = getTokenData(tokensData, NATIVE_TOKEN_ADDRESS);
  if (!nativeToken) return void 0;
  let baseGasLimit = gasLimits.estimatedGasFeeBaseAmount;
  baseGasLimit += gasLimits.estimatedGasFeePerOraclePrice * oraclePriceCount;
  const multiplierFactor = gasLimits.estimatedFeeMultiplierFactor;
  const gasLimit = baseGasLimit + applyFactor(estimatedGasLimit, multiplierFactor);
  const minGasCostUsd = isContractsChain(chainId) ? getMinExecutionFeeUsd(chainId) : void 0;
  const minGasCost = minGasCostUsd ? convertToTokenAmount(
    minGasCostUsd,
    nativeToken.decimals,
    nativeToken.prices.minPrice
  ) : void 0;
  let feeTokenAmountPerExecution = gasLimit * gasPrice;
  if (minGasCost !== void 0) {
    feeTokenAmountPerExecution = bigMath.max(
      feeTokenAmountPerExecution,
      minGasCost
    );
  }
  const feeTokenAmount = feeTokenAmountPerExecution * BigInt(numberOfParts ?? 1);
  const feeUsd = convertToUsd(
    feeTokenAmount,
    nativeToken.decimals,
    nativeToken.prices.minPrice
  );
  const isFeeHigh = feeUsd > expandDecimals(getHighExecutionFee(chainId), USD_DECIMALS);
  const isFeeVeryHigh = feeUsd > expandDecimals(getExcessiveExecutionFee(chainId), USD_DECIMALS);
  return {
    feeUsd,
    feeTokenAmount,
    feeToken: nativeToken,
    gasLimit,
    isFeeHigh,
    isFeeVeryHigh
  };
}
function estimateRelayerGasLimit({
  gasLimits,
  tokenPermitsCount,
  feeSwapsCount,
  feeExternalCallsGasLimit,
  oraclePriceCount,
  transactionPayloadGasLimit,
  l1GasLimit
}) {
  const feeSwapsGasLimit = gasLimits.singleSwap * BigInt(feeSwapsCount);
  const oraclePricesGasLimit = gasLimits.estimatedGasFeePerOraclePrice * BigInt(oraclePriceCount);
  const tokenPermitsGasLimit = gasLimits.tokenPermitGasLimit * BigInt(tokenPermitsCount);
  const relayParamsGasLimit = feeSwapsGasLimit + oraclePricesGasLimit + tokenPermitsGasLimit + feeExternalCallsGasLimit;
  return relayParamsGasLimit + transactionPayloadGasLimit + l1GasLimit;
}
function approximateL1GasBuffer({
  l1Reference,
  sizeOfData
}) {
  const evaluated = Math.round(
    Number(l1Reference.gasLimit) * Math.log(Number(sizeOfData)) / Math.log(Number(l1Reference.sizeOfData))
  );
  const l1GasLimit = Math.abs(evaluated) < Infinity ? BigInt(evaluated) : l1Reference.gasLimit;
  return l1GasLimit;
}
function estimateBatchGasLimit({
  gasLimits,
  createOrdersCount,
  updateOrdersCount,
  cancelOrdersCount,
  externalCallsGasLimit,
  isGmxAccount
}) {
  const createOrdersGasLimit = gasLimits.createOrderGasLimit * BigInt(createOrdersCount);
  const updateOrdersGasLimit = gasLimits.updateOrderGasLimit * BigInt(updateOrdersCount);
  const cancelOrdersGasLimit = gasLimits.cancelOrderGasLimit * BigInt(cancelOrdersCount);
  const gmxAccountOverhead = isGmxAccount ? gasLimits.gmxAccountCollateralGasLimit : 0n;
  return createOrdersGasLimit + updateOrdersGasLimit + cancelOrdersGasLimit + externalCallsGasLimit + gmxAccountOverhead;
}
function estimateBatchMinGasPaymentTokenAmount({
  chainId,
  gasPaymentToken,
  isGmxAccount,
  relayFeeToken,
  gasPrice,
  gasLimits,
  l1Reference,
  tokensData,
  createOrdersCount = 1,
  updateOrdersCount = 0,
  cancelOrdersCount = 0,
  executionFeeAmount
}) {
  const batchGasLimit = estimateBatchGasLimit({
    gasLimits,
    createOrdersCount,
    updateOrdersCount,
    cancelOrdersCount,
    externalCallsGasLimit: 0n,
    isGmxAccount
  });
  const relayerGasLimit = estimateRelayerGasLimit({
    gasLimits,
    tokenPermitsCount: 0,
    feeSwapsCount: relayFeeToken.address === gasPaymentToken.address ? 0 : 1,
    feeExternalCallsGasLimit: 0n,
    oraclePriceCount: 2,
    transactionPayloadGasLimit: batchGasLimit,
    l1GasLimit: l1Reference?.gasLimit ?? 0n
  });
  const gasLimit = relayerGasLimit + batchGasLimit;
  const feeAmount = gasLimit * gasPrice;
  const executionGasLimit = estimateExecuteIncreaseOrderGasLimit(gasLimits, {
    swapsCount: 2,
    callbackGasLimit: 0n
  });
  const executionFee = executionFeeAmount ?? getExecutionFee(
    chainId,
    gasLimits,
    tokensData,
    executionGasLimit,
    gasPrice,
    4n
  )?.feeTokenAmount;
  let totalFee = feeAmount + (executionFee ?? 0n);
  const minGasPaymentTokenBalance = convertBetweenTokens(
    totalFee,
    relayFeeToken,
    gasPaymentToken,
    false
  );
  return minGasPaymentTokenBalance;
}
function estimateExecuteIncreaseOrderGasLimit(gasLimits, order) {
  const gasPerSwap = gasLimits.singleSwap;
  const swapsCount = BigInt(order.swapsCount ?? 0);
  return gasLimits.increaseOrder + gasPerSwap * swapsCount + (order.callbackGasLimit ?? 0n);
}
function estimateExecuteDecreaseOrderGasLimit(gasLimits, order) {
  const gasPerSwap = gasLimits.singleSwap;
  let swapsCount = BigInt(order.swapsCount);
  if (order.decreaseSwapType !== DecreasePositionSwapType.NoSwap) {
    swapsCount += 1n;
  }
  return gasLimits.decreaseOrder + gasPerSwap * swapsCount + (order.callbackGasLimit ?? 0n);
}
function estimateExecuteSwapOrderGasLimit(gasLimits, order) {
  const gasPerSwap = gasLimits.singleSwap;
  const swapsCount = BigInt(order.swapsCount);
  return gasLimits.swapOrder + gasPerSwap * swapsCount + (order.callbackGasLimit ?? 0n);
}
function estimateExecuteDepositGasLimit(gasLimits, deposit) {
  const gasPerSwap = gasLimits.singleSwap;
  const swapsCount = BigInt(
    (deposit.longTokenSwapsCount ?? 0) + (deposit.shortTokenSwapsCount ?? 0)
  );
  const gasForSwaps = swapsCount * gasPerSwap;
  return gasLimits.depositToken + (deposit.callbackGasLimit ?? 0n) + gasForSwaps;
}
function estimateExecuteGlvDepositGasLimit(gasLimits, {
  marketsCount,
  isMarketTokenDeposit
}) {
  const gasPerGlvPerMarket = gasLimits.glvPerMarketGasLimit;
  const gasForGlvMarkets = gasPerGlvPerMarket * marketsCount;
  const glvDepositGasLimit = gasLimits.glvDepositGasLimit;
  const gasLimit = glvDepositGasLimit + gasForGlvMarkets;
  if (isMarketTokenDeposit) {
    return gasLimit;
  }
  return gasLimit + gasLimits.depositToken;
}
function estimateExecuteGlvWithdrawalGasLimit(gasLimits, {
  marketsCount
}) {
  const gasPerGlvPerMarket = gasLimits.glvPerMarketGasLimit;
  const gasForGlvMarkets = gasPerGlvPerMarket * marketsCount;
  const glvWithdrawalGasLimit = gasLimits.glvWithdrawalGasLimit;
  const gasLimit = glvWithdrawalGasLimit + gasForGlvMarkets;
  return gasLimit + gasLimits.withdrawalMultiToken;
}
function estimateExecuteWithdrawalGasLimit(gasLimits, withdrawal) {
  return gasLimits.withdrawalMultiToken + (withdrawal.callbackGasLimit ?? 0n);
}
function estimateExecuteShiftGasLimit(gasLimits, shift) {
  return gasLimits.shift + (shift.callbackGasLimit ?? 0n);
}

export { approximateL1GasBuffer, estimateBatchGasLimit, estimateBatchMinGasPaymentTokenAmount, estimateExecuteDecreaseOrderGasLimit, estimateExecuteDepositGasLimit, estimateExecuteGlvDepositGasLimit, estimateExecuteGlvWithdrawalGasLimit, estimateExecuteIncreaseOrderGasLimit, estimateExecuteShiftGasLimit, estimateExecuteSwapOrderGasLimit, estimateExecuteWithdrawalGasLimit, estimateRelayerGasLimit, getExecutionFee };
//# sourceMappingURL=executionFee.js.map
//# sourceMappingURL=executionFee.js.map