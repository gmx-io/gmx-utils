import { maxUint256 } from 'viem';
import { DEFAULT_ACCEPTABLE_PRICE_IMPACT_BUFFER } from '../../configs/factors.js';
import { getPriceImpactForPosition, getPositionFee, getTotalSwapVolumeFromSwapStats, capPositionImpactUsdByMaxPriceImpactFactor, capPositionImpactUsdByMaxImpactPool } from '../executionFee/index.js';
import { OrderType } from '../orders/types.js';
import { getLeverage, getPriceImpactDiffUsd, getEntryPrice, getPositionPnlUsd, getLiquidationPrice } from '../positions/utils.js';
import { getAcceptablePriceInfo, getDefaultAcceptablePriceImpactBps } from '../pricing/acceptablePrice.js';
import { getOrderThresholdType, getMarkPrice } from '../pricing/utils.js';
import { getSwapAmountsByFromValue, getSwapAmountsByToValue } from '../swap/swapValues.js';
import { getTokensRatioByPrice } from '../swap/utils.js';
import { convertToUsd, convertToTokenAmount, getIsEquivalentTokens } from '../tokens/utils.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { BASIS_POINTS_DIVISOR_BIGINT, applyFactor } from '../../lib/numbers/index.js';

function getIncreasePositionAmounts(p) {
  const {
    marketInfo,
    indexToken,
    initialCollateralToken,
    collateralToken,
    initialCollateralAmount,
    indexTokenAmount,
    isLong,
    leverage,
    triggerPrice,
    limitOrderType,
    position,
    fixedAcceptablePriceImpactBps,
    acceptablePriceImpactBuffer,
    externalSwapQuote,
    findSwapPath,
    userReferralInfo,
    uiFeeFactor,
    strategy,
    marketsInfoData,
    chainId,
    externalSwapQuoteParams,
    isSetAcceptablePriceImpactEnabled
  } = p;
  const swapStrategy = {
    type: "noSwap",
    externalSwapQuote: void 0,
    swapPathStats: void 0,
    amountIn: 0n,
    amountOut: 0n,
    usdIn: 0n,
    usdOut: 0n,
    priceIn: 0n,
    priceOut: 0n,
    feesUsd: 0n
  };
  const values = {
    initialCollateralAmount: 0n,
    initialCollateralUsd: 0n,
    collateralDeltaAmount: 0n,
    collateralDeltaUsd: 0n,
    swapStrategy,
    indexTokenAmount: 0n,
    sizeDeltaUsd: 0n,
    sizeDeltaInTokens: 0n,
    estimatedLeverage: 0n,
    indexPrice: 0n,
    initialCollateralPrice: 0n,
    collateralPrice: 0n,
    triggerPrice: 0n,
    acceptablePrice: 0n,
    acceptablePriceDeltaBps: 0n,
    recommendedAcceptablePriceDeltaBps: 0n,
    positionFeeUsd: 0n,
    uiFeeUsd: 0n,
    swapUiFeeUsd: 0n,
    feeDiscountUsd: 0n,
    borrowingFeeUsd: 0n,
    fundingFeeUsd: 0n,
    positionPriceImpactDeltaUsd: 0n,
    potentialPriceImpactDiffUsd: 0n,
    limitOrderType,
    triggerThresholdType: void 0
  };
  const isLimit = limitOrderType !== void 0;
  const swapOptimizationOrder = isLimit ? ["length", "liquidity"] : void 0;
  const prices = getIncreasePositionPrices({
    triggerPrice,
    indexToken,
    initialCollateralToken,
    collateralToken,
    limitOrderType,
    isLong
  });
  values.indexPrice = prices.indexPrice;
  values.initialCollateralPrice = prices.initialCollateralPrice;
  values.collateralPrice = prices.collateralPrice;
  values.triggerPrice = prices.triggerPrice;
  values.triggerThresholdType = prices.triggerThresholdType;
  values.borrowingFeeUsd = position?.pendingBorrowingFeesUsd || 0n;
  values.fundingFeeUsd = position?.pendingFundingFeesUsd || 0n;
  if (values.indexPrice <= 0 || values.initialCollateralPrice <= 0 || values.collateralPrice <= 0) {
    return values;
  }
  if (strategy === "leverageByCollateral" && leverage !== void 0 && initialCollateralAmount !== void 0 && initialCollateralAmount > 0) {
    values.estimatedLeverage = leverage;
    values.initialCollateralAmount = initialCollateralAmount;
    values.initialCollateralUsd = convertToUsd(
      initialCollateralAmount,
      initialCollateralToken.decimals,
      values.initialCollateralPrice
    );
    if (externalSwapQuote) {
      const swapStrategy2 = {
        type: "externalSwap",
        externalSwapQuote,
        swapPathStats: void 0,
        ...externalSwapQuote
      };
      values.swapStrategy = swapStrategy2;
    } else {
      const swapAmounts = getSwapAmountsByFromValue({
        tokenIn: initialCollateralToken,
        tokenOut: collateralToken,
        amountIn: initialCollateralAmount,
        isLimit: false,
        findSwapPath,
        uiFeeFactor,
        swapOptimizationOrder,
        marketsInfoData,
        chainId,
        externalSwapQuoteParams
      });
      values.swapStrategy = swapAmounts.swapStrategy;
    }
    const swapAmountOut = values.swapStrategy.amountOut;
    const baseCollateralUsd = convertToUsd(
      swapAmountOut,
      collateralToken.decimals,
      values.collateralPrice
    );
    const baseSizeDeltaUsd = bigMath.mulDiv(
      baseCollateralUsd,
      leverage,
      BASIS_POINTS_DIVISOR_BIGINT
    );
    const { balanceWasImproved } = getPriceImpactForPosition(
      marketInfo,
      baseSizeDeltaUsd,
      isLong
    );
    const basePositionFeeInfo = getPositionFee(
      marketInfo,
      baseSizeDeltaUsd,
      balanceWasImproved,
      userReferralInfo
    );
    const baseUiFeeUsd = applyFactor(baseSizeDeltaUsd, uiFeeFactor);
    const totalSwapVolumeUsd = getTotalSwapVolumeFromSwapStats(
      values.swapStrategy.swapPathStats?.swapSteps
    );
    values.swapUiFeeUsd = applyFactor(totalSwapVolumeUsd, uiFeeFactor);
    values.sizeDeltaUsd = bigMath.mulDiv(
      baseCollateralUsd - basePositionFeeInfo.positionFeeUsd - baseUiFeeUsd - values.swapUiFeeUsd,
      leverage,
      BASIS_POINTS_DIVISOR_BIGINT
    );
    values.indexTokenAmount = convertToTokenAmount(
      values.sizeDeltaUsd,
      indexToken.decimals,
      values.indexPrice
    );
    const positionFeeInfo = getPositionFee(
      marketInfo,
      values.sizeDeltaUsd,
      balanceWasImproved,
      userReferralInfo
    );
    values.positionFeeUsd = positionFeeInfo.positionFeeUsd;
    values.feeDiscountUsd = positionFeeInfo.discountUsd;
    values.uiFeeUsd = applyFactor(values.sizeDeltaUsd, uiFeeFactor);
    values.collateralDeltaUsd = baseCollateralUsd - values.positionFeeUsd - values.borrowingFeeUsd - values.fundingFeeUsd - values.uiFeeUsd - values.swapUiFeeUsd;
    values.collateralDeltaAmount = convertToTokenAmount(
      values.collateralDeltaUsd,
      collateralToken.decimals,
      values.collateralPrice
    );
  } else if (strategy === "leverageBySize" && leverage !== void 0 && indexTokenAmount !== void 0 && indexTokenAmount > 0) {
    values.estimatedLeverage = leverage;
    values.indexTokenAmount = indexTokenAmount;
    values.sizeDeltaUsd = convertToUsd(
      indexTokenAmount,
      indexToken.decimals,
      values.indexPrice
    );
    const { balanceWasImproved } = getPriceImpactForPosition(
      marketInfo,
      values.sizeDeltaUsd,
      isLong
    );
    const positionFeeInfo = getPositionFee(
      marketInfo,
      values.sizeDeltaUsd,
      balanceWasImproved,
      userReferralInfo
    );
    values.positionFeeUsd = positionFeeInfo.positionFeeUsd;
    values.feeDiscountUsd = positionFeeInfo.discountUsd;
    values.uiFeeUsd = applyFactor(values.sizeDeltaUsd, uiFeeFactor);
    const { collateralDeltaUsd, collateralDeltaAmount, baseCollateralAmount } = leverageBySizeValues({
      collateralToken,
      leverage,
      sizeDeltaUsd: values.sizeDeltaUsd,
      collateralPrice: values.collateralPrice,
      positionFeeUsd: values.positionFeeUsd,
      borrowingFeeUsd: values.borrowingFeeUsd,
      fundingFeeUsd: values.fundingFeeUsd,
      uiFeeUsd: values.uiFeeUsd,
      swapUiFeeUsd: values.swapUiFeeUsd
    });
    values.collateralDeltaUsd = collateralDeltaUsd;
    values.collateralDeltaAmount = collateralDeltaAmount;
    if (externalSwapQuote) {
      const swapStrategy2 = {
        type: "externalSwap",
        externalSwapQuote,
        swapPathStats: void 0,
        ...externalSwapQuote
      };
      values.swapStrategy = swapStrategy2;
    } else {
      const swapAmounts = getSwapAmountsByToValue({
        tokenIn: initialCollateralToken,
        tokenOut: collateralToken,
        amountOut: baseCollateralAmount,
        isLimit: false,
        findSwapPath,
        uiFeeFactor,
        marketsInfoData,
        chainId,
        externalSwapQuoteParams
      });
      values.swapStrategy = swapAmounts.swapStrategy;
    }
    const swapAmountIn = values.swapStrategy.amountIn;
    values.initialCollateralAmount = swapAmountIn;
    values.initialCollateralUsd = convertToUsd(
      values.initialCollateralAmount,
      initialCollateralToken.decimals,
      values.initialCollateralPrice
    );
  } else if (strategy === "independent") {
    if (indexTokenAmount !== void 0 && indexTokenAmount > 0) {
      values.indexTokenAmount = indexTokenAmount;
      values.sizeDeltaUsd = convertToUsd(
        indexTokenAmount,
        indexToken.decimals,
        values.indexPrice
      );
      const { balanceWasImproved } = getPriceImpactForPosition(
        marketInfo,
        values.sizeDeltaUsd,
        isLong
      );
      const positionFeeInfo = getPositionFee(
        marketInfo,
        values.sizeDeltaUsd,
        balanceWasImproved,
        userReferralInfo
      );
      values.positionFeeUsd = positionFeeInfo.positionFeeUsd;
      values.feeDiscountUsd = positionFeeInfo.discountUsd;
      values.uiFeeUsd = applyFactor(values.sizeDeltaUsd, uiFeeFactor);
    }
    if (initialCollateralAmount !== void 0 && initialCollateralAmount > 0) {
      values.initialCollateralAmount = initialCollateralAmount;
      values.initialCollateralUsd = convertToUsd(
        initialCollateralAmount,
        initialCollateralToken.decimals,
        values.initialCollateralPrice
      );
      if (externalSwapQuote) {
        const swapStrategy2 = {
          type: "externalSwap",
          externalSwapQuote,
          swapPathStats: void 0,
          ...externalSwapQuote
        };
        values.swapStrategy = swapStrategy2;
      } else {
        const swapAmounts = getSwapAmountsByFromValue({
          tokenIn: initialCollateralToken,
          tokenOut: collateralToken,
          amountIn: initialCollateralAmount,
          isLimit: false,
          findSwapPath,
          uiFeeFactor,
          swapOptimizationOrder,
          marketsInfoData,
          chainId,
          externalSwapQuoteParams
        });
        values.swapStrategy = swapAmounts.swapStrategy;
      }
      const swapAmountIn = values.swapStrategy.amountIn;
      const baseCollateralUsd = convertToUsd(
        swapAmountIn,
        initialCollateralToken.decimals,
        values.initialCollateralPrice
      );
      values.collateralDeltaUsd = baseCollateralUsd - values.positionFeeUsd - values.borrowingFeeUsd - values.fundingFeeUsd - values.uiFeeUsd - values.swapUiFeeUsd;
      values.collateralDeltaAmount = convertToTokenAmount(
        values.collateralDeltaUsd,
        collateralToken.decimals,
        values.collateralPrice
      );
    }
    values.estimatedLeverage = getLeverage({
      sizeInUsd: values.sizeDeltaUsd,
      collateralUsd: values.collateralDeltaUsd,
      pnl: 0n,
      pendingBorrowingFeesUsd: 0n,
      pendingFundingFeesUsd: 0n
    });
  }
  const acceptablePriceInfo = getAcceptablePriceInfo({
    marketInfo,
    isIncrease: true,
    isLimit,
    isLong,
    indexPrice: values.indexPrice,
    sizeDeltaUsd: values.sizeDeltaUsd
  });
  values.positionPriceImpactDeltaUsd = acceptablePriceInfo.priceImpactDeltaUsd;
  values.potentialPriceImpactDiffUsd = getPriceImpactDiffUsd({
    totalImpactDeltaUsd: values.positionPriceImpactDeltaUsd,
    marketInfo,
    sizeDeltaUsd: values.sizeDeltaUsd
  });
  values.acceptablePrice = acceptablePriceInfo.acceptablePrice;
  values.acceptablePriceDeltaBps = acceptablePriceInfo.acceptablePriceDeltaBps;
  if (isLimit) {
    if (!isSetAcceptablePriceImpactEnabled || limitOrderType === OrderType.StopIncrease) {
      values.acceptablePrice = isLong ? maxUint256 : 0n;
    } else {
      let maxNegativePriceImpactBps = fixedAcceptablePriceImpactBps;
      values.recommendedAcceptablePriceDeltaBps = getDefaultAcceptablePriceImpactBps({
        isIncrease: true,
        isLong,
        indexPrice: values.indexPrice,
        sizeDeltaUsd: values.sizeDeltaUsd,
        priceImpactDeltaUsd: values.positionPriceImpactDeltaUsd,
        acceptablePriceImapctBuffer: acceptablePriceImpactBuffer || DEFAULT_ACCEPTABLE_PRICE_IMPACT_BUFFER
      });
      if (maxNegativePriceImpactBps === void 0) {
        maxNegativePriceImpactBps = values.recommendedAcceptablePriceDeltaBps;
      }
      const limitAcceptablePriceInfo = getAcceptablePriceInfo({
        marketInfo,
        isIncrease: true,
        isLimit,
        isLong,
        indexPrice: values.indexPrice,
        sizeDeltaUsd: values.sizeDeltaUsd,
        maxNegativePriceImpactBps
      });
      values.acceptablePrice = limitAcceptablePriceInfo.acceptablePrice;
      values.acceptablePriceDeltaBps = limitAcceptablePriceInfo.acceptablePriceDeltaBps;
    }
  }
  values.sizeDeltaInTokens = convertToTokenAmount(
    values.sizeDeltaUsd,
    indexToken.decimals,
    values.indexPrice
  );
  return values;
}
function getTokensRatio({
  fromToken,
  toToken,
  triggerRatioValue,
  markPrice
}) {
  const fromTokenPrice = fromToken?.prices.minPrice;
  const markRatio = getTokensRatioByPrice({
    fromToken,
    toToken,
    fromPrice: fromTokenPrice,
    toPrice: markPrice
  });
  if (triggerRatioValue === void 0) {
    return { markRatio };
  }
  const triggerRatio = {
    ratio: triggerRatioValue > 0 ? triggerRatioValue : markRatio.ratio,
    largestToken: markRatio.largestToken,
    smallestToken: markRatio.smallestToken
  };
  return {
    markRatio,
    triggerRatio
  };
}
function leverageBySizeValues({
  collateralToken,
  leverage,
  sizeDeltaUsd,
  collateralPrice,
  positionFeeUsd,
  borrowingFeeUsd,
  uiFeeUsd,
  swapUiFeeUsd,
  fundingFeeUsd
}) {
  const collateralDeltaUsd = bigMath.mulDiv(
    sizeDeltaUsd,
    BASIS_POINTS_DIVISOR_BIGINT,
    leverage
  );
  const collateralDeltaAmount = convertToTokenAmount(
    collateralDeltaUsd,
    collateralToken.decimals,
    collateralPrice
  );
  const baseCollateralUsd = collateralDeltaUsd !== 0n ? collateralDeltaUsd + positionFeeUsd + borrowingFeeUsd + fundingFeeUsd + uiFeeUsd + swapUiFeeUsd : 0n;
  const baseCollateralAmount = convertToTokenAmount(
    baseCollateralUsd,
    collateralToken.decimals,
    collateralPrice
  );
  return {
    collateralDeltaUsd,
    collateralDeltaAmount,
    baseCollateralUsd,
    baseCollateralAmount
  };
}
function getIncreasePositionPrices({
  triggerPrice,
  indexToken,
  initialCollateralToken,
  collateralToken,
  limitOrderType,
  isLong
}) {
  let indexPrice;
  let initialCollateralPrice;
  let triggerThresholdType;
  let collateralPrice;
  if (triggerPrice !== void 0 && triggerPrice > 0 && limitOrderType !== void 0) {
    indexPrice = triggerPrice;
    initialCollateralPrice = getIsEquivalentTokens(
      indexToken,
      initialCollateralToken
    ) ? triggerPrice : initialCollateralToken.prices.minPrice;
    collateralPrice = getIsEquivalentTokens(indexToken, collateralToken) ? triggerPrice : collateralToken.prices.minPrice;
    triggerThresholdType = getOrderThresholdType(limitOrderType, isLong);
  } else {
    indexPrice = getMarkPrice({
      prices: indexToken.prices,
      isIncrease: true,
      isLong
    });
    initialCollateralPrice = initialCollateralToken.prices.minPrice;
    collateralPrice = collateralToken.prices.minPrice;
  }
  return {
    indexPrice,
    initialCollateralPrice,
    collateralPrice,
    triggerThresholdType,
    triggerPrice
  };
}
function getNextPositionValuesForIncreaseTrade(p) {
  const {
    existingPosition,
    marketInfo,
    collateralToken,
    sizeDeltaUsd,
    sizeDeltaInTokens,
    collateralDeltaUsd,
    collateralDeltaAmount,
    indexPrice,
    isLong,
    showPnlInLeverage,
    minCollateralUsd,
    userReferralInfo,
    positionPriceImpactDeltaUsd
  } = p;
  const nextCollateralUsd = existingPosition ? existingPosition.collateralUsd + collateralDeltaUsd : collateralDeltaUsd;
  const nextCollateralAmount = existingPosition ? existingPosition.collateralAmount + collateralDeltaAmount : collateralDeltaAmount;
  const nextSizeUsd = existingPosition ? existingPosition.sizeInUsd + sizeDeltaUsd : sizeDeltaUsd;
  const nextSizeInTokens = existingPosition ? existingPosition.sizeInTokens + sizeDeltaInTokens : sizeDeltaInTokens;
  const nextEntryPrice = getEntryPrice({
    sizeInUsd: nextSizeUsd,
    sizeInTokens: nextSizeInTokens,
    indexToken: marketInfo.indexToken
  }) ?? indexPrice;
  const nextPnl = existingPosition ? getPositionPnlUsd({
    marketInfo,
    sizeInUsd: nextSizeUsd,
    sizeInTokens: nextSizeInTokens,
    markPrice: indexPrice,
    isLong
  }) : void 0;
  const nextLeverage = getLeverage({
    sizeInUsd: nextSizeUsd,
    collateralUsd: nextCollateralUsd,
    pnl: showPnlInLeverage ? nextPnl : void 0,
    pendingBorrowingFeesUsd: 0n,
    // deducted on order
    pendingFundingFeesUsd: 0n
    // deducted on order
  });
  const nextLiqPrice = getLiquidationPrice({
    marketInfo,
    collateralToken,
    sizeInUsd: nextSizeUsd,
    sizeInTokens: nextSizeInTokens,
    collateralUsd: nextCollateralUsd,
    collateralAmount: nextCollateralAmount,
    minCollateralUsd,
    pendingBorrowingFeesUsd: 0n,
    // deducted on order
    pendingFundingFeesUsd: 0n,
    // deducted on order
    pendingImpactAmount: existingPosition?.pendingImpactAmount ?? 0n,
    isLong,
    userReferralInfo
  });
  let nextPendingImpactDeltaUsd = existingPosition?.pendingImpactUsd !== void 0 ? existingPosition.pendingImpactUsd + positionPriceImpactDeltaUsd : positionPriceImpactDeltaUsd;
  const potentialPriceImpactDiffUsd = getPriceImpactDiffUsd({
    totalImpactDeltaUsd: nextPendingImpactDeltaUsd,
    marketInfo,
    sizeDeltaUsd: nextSizeUsd
  });
  if (nextPendingImpactDeltaUsd > 0) {
    nextPendingImpactDeltaUsd = capPositionImpactUsdByMaxPriceImpactFactor(
      marketInfo,
      nextSizeUsd,
      nextPendingImpactDeltaUsd
    );
  }
  nextPendingImpactDeltaUsd = capPositionImpactUsdByMaxImpactPool(
    marketInfo,
    nextPendingImpactDeltaUsd
  );
  return {
    nextSizeUsd,
    nextCollateralUsd,
    nextEntryPrice,
    nextLeverage,
    nextLiqPrice,
    nextPendingImpactDeltaUsd,
    potentialPriceImpactDiffUsd
  };
}

export { getIncreasePositionAmounts, getIncreasePositionPrices, getNextPositionValuesForIncreaseTrade, getTokensRatio, leverageBySizeValues };
//# sourceMappingURL=increase.js.map
//# sourceMappingURL=increase.js.map