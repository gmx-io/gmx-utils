import { getTotalSwapVolumeFromSwapStats, getFeeItem, getTotalFeeItem } from '../executionFee/index.js';
import { isMarketOrderType, isLimitOrderType, isSwapOrderType } from '../orders/utils.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { getBasisPoints, PRECISION, applyFactor, BASIS_POINTS_DIVISOR_BIGINT } from '../../lib/numbers/index.js';
import { TradeType, TradeMode } from './types.js';

const getTradeFlags = (tradeType, tradeMode) => {
  const isLong = tradeType === TradeType.Long;
  const isShort = tradeType === TradeType.Short;
  const isSwap = tradeType === TradeType.Swap;
  const isPosition = isLong || isShort;
  const isMarket = tradeMode === TradeMode.Market;
  const isLimit = tradeMode === TradeMode.Limit || tradeMode === TradeMode.StopMarket;
  const isTrigger = tradeMode === TradeMode.Trigger;
  const isTwap = tradeMode === TradeMode.Twap;
  const isIncrease = isPosition && (isMarket || isLimit || isTwap);
  const tradeFlags = {
    isLong,
    isShort,
    isSwap,
    isPosition,
    isIncrease,
    isMarket,
    isLimit,
    isTrigger,
    isTwap
  };
  return tradeFlags;
};
function getTradeFlagsForOrder(order) {
  let tradeType;
  let tradeMode;
  if (isMarketOrderType(order.orderType)) {
    tradeMode = TradeMode.Market;
  } else if (isLimitOrderType(order.orderType)) {
    tradeMode = TradeMode.Limit;
  } else {
    tradeMode = TradeMode.Trigger;
  }
  if (isSwapOrderType(order.orderType)) {
    tradeType = TradeType.Swap;
  } else if (order.isLong) {
    tradeType = TradeType.Long;
  } else {
    tradeType = TradeType.Short;
  }
  return getTradeFlags(tradeType, tradeMode);
}
function getTradeFlagsForCollateralEdit(isLong, isIncrease) {
  return {
    isMarket: true,
    isIncrease,
    isLimit: false,
    isLong: Boolean(isLong),
    isShort: !isLong,
    isSwap: false,
    isPosition: true,
    isTrigger: false,
    isTwap: false
  };
}
function getPositionSellerTradeFlags(isLong, tradeMode) {
  return {
    isMarket: tradeMode === TradeMode.Market,
    isIncrease: false,
    isLimit: false,
    isLong: Boolean(isLong),
    isShort: !isLong,
    isSwap: false,
    isPosition: true,
    isTrigger: tradeMode === TradeMode.Trigger,
    isTwap: tradeMode === TradeMode.Twap
  };
}
function getTradeFees(p) {
  const {
    initialCollateralUsd,
    sizeInUsd,
    sizeDeltaUsd,
    collateralDeltaUsd,
    swapSteps,
    positionFeeUsd,
    swapPriceImpactDeltaUsd,
    increasePositionPriceImpactDeltaUsd,
    totalPendingImpactDeltaUsd,
    externalSwapQuote,
    priceImpactDiffUsd,
    borrowingFeeUsd,
    fundingFeeUsd,
    feeDiscountUsd,
    swapProfitFeeUsd,
    proportionalPendingImpactDeltaUsd,
    decreasePositionPriceImpactDeltaUsd,
    uiFeeFactor,
    type
  } = p;
  const swapFees = !externalSwapQuote && initialCollateralUsd > 0 ? swapSteps.map((step) => ({
    tokenInAddress: step.tokenInAddress,
    tokenOutAddress: step.tokenOutAddress,
    marketAddress: step.marketAddress,
    deltaUsd: step.swapFeeUsd * -1n,
    bps: step.usdIn != 0n ? getBasisPoints(step.swapFeeUsd * -1n, step.usdIn) : 0n,
    precisePercentage: step.usdIn != 0n ? bigMath.mulDiv(step.swapFeeUsd * -1n, PRECISION, step.usdIn) : 0n
  })) : void 0;
  const externalSwapFee = initialCollateralUsd > 0 && externalSwapQuote ? {
    aggregator: externalSwapQuote.aggregator,
    tokenInAddress: externalSwapQuote.inTokenAddress,
    tokenOutAddress: externalSwapQuote.outTokenAddress,
    deltaUsd: externalSwapQuote.feesUsd * -1n,
    bps: externalSwapQuote.usdIn != 0n ? getBasisPoints(
      externalSwapQuote.feesUsd * -1n,
      externalSwapQuote.usdIn
    ) : 0n,
    precisePercentage: externalSwapQuote.usdIn != 0n ? bigMath.mulDiv(
      externalSwapQuote.feesUsd * -1n,
      PRECISION,
      externalSwapQuote.usdIn
    ) : 0n
  } : void 0;
  const totalSwapVolumeUsd = getTotalSwapVolumeFromSwapStats(swapSteps);
  const uiFeeUsd = applyFactor(sizeDeltaUsd, uiFeeFactor);
  const uiSwapFeeUsd = applyFactor(totalSwapVolumeUsd, uiFeeFactor);
  const uiSwapFee = getFeeItem(uiSwapFeeUsd * -1n, totalSwapVolumeUsd, {
    shouldRoundUp: true
  });
  const uiFee = getFeeItem(uiFeeUsd * -1n, sizeDeltaUsd, {
    shouldRoundUp: true
  });
  const swapProfitFee = getFeeItem(
    swapProfitFeeUsd * -1n,
    initialCollateralUsd
  );
  const swapPriceImpact = !externalSwapQuote ? getFeeItem(swapPriceImpactDeltaUsd, initialCollateralUsd) : void 0;
  const positionFeeBeforeDiscount = getFeeItem(
    (positionFeeUsd + feeDiscountUsd) * -1n,
    sizeDeltaUsd
  );
  const positionFeeAfterDiscount = getFeeItem(
    positionFeeUsd * -1n,
    sizeDeltaUsd
  );
  const borrowFee = getFeeItem(borrowingFeeUsd * -1n, initialCollateralUsd);
  const fundingFee = getFeeItem(fundingFeeUsd * -1n, initialCollateralUsd);
  const increasePositionPriceImpact = getFeeItem(
    increasePositionPriceImpactDeltaUsd,
    sizeDeltaUsd
  );
  const decreasePositionPriceImpact = getFeeItem(
    decreasePositionPriceImpactDeltaUsd,
    sizeDeltaUsd
  );
  const proportionalPendingImpact = getFeeItem(
    proportionalPendingImpactDeltaUsd,
    sizeDeltaUsd
  );
  const totalPendingImpact = getFeeItem(
    totalPendingImpactDeltaUsd,
    sizeDeltaUsd
  );
  const priceImpactDiff = getFeeItem(priceImpactDiffUsd, sizeDeltaUsd);
  const positionNetPriceImpact = getTotalFeeItem([
    type === "increase" ? increasePositionPriceImpact : totalPendingImpact,
    priceImpactDiff
  ]);
  let collateralDeltaBasis;
  if (type === "increase") {
    collateralDeltaBasis = collateralDeltaUsd;
  } else {
    const sizeDeltaBps = sizeInUsd !== 0n ? getBasisPoints(sizeDeltaUsd, sizeInUsd) : 1n;
    const proportionalCollateralDeltaUsd = initialCollateralUsd !== void 0 ? initialCollateralUsd * sizeDeltaBps / BASIS_POINTS_DIVISOR_BIGINT : 0n;
    collateralDeltaBasis = proportionalCollateralDeltaUsd;
  }
  const positionCollateralPriceImpact = getFeeItem(
    type === "increase" ? increasePositionPriceImpactDeltaUsd : totalPendingImpactDeltaUsd,
    bigMath.abs(collateralDeltaBasis)
  );
  const collateralPriceImpactDiff = getFeeItem(
    priceImpactDiffUsd,
    collateralDeltaBasis
  );
  const collateralNetPriceImpact = getTotalFeeItem([
    positionCollateralPriceImpact,
    collateralPriceImpactDiff
  ]);
  const totalFees = getTotalFeeItem([
    ...swapFees || [],
    externalSwapFee,
    swapProfitFee,
    swapPriceImpact,
    type === "decrease" ? totalPendingImpact : void 0,
    type === "decrease" ? priceImpactDiff : void 0,
    positionFeeAfterDiscount,
    borrowFee,
    fundingFee,
    uiFee,
    uiSwapFee
  ]);
  return {
    totalFees,
    payTotalFees: totalFees,
    swapFees,
    swapProfitFee,
    swapPriceImpact,
    positionFee: positionFeeBeforeDiscount,
    priceImpactDiff,
    positionCollateralPriceImpact,
    proportionalPendingImpact,
    increasePositionPriceImpact,
    decreasePositionPriceImpact,
    totalPendingImpact,
    collateralPriceImpactDiff,
    positionNetPriceImpact,
    collateralNetPriceImpact,
    borrowFee,
    fundingFee,
    feeDiscountUsd,
    uiFee,
    uiSwapFee,
    externalSwapFee
  };
}

export { getPositionSellerTradeFlags, getTradeFees, getTradeFlags, getTradeFlagsForCollateralEdit, getTradeFlagsForOrder };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map