import { getPositionFee, getPriceImpactForPosition, capPositionImpactUsdByMaxPriceImpactFactor, getProportionalPendingImpactValues, capPositionImpactUsdByMaxImpactPool, getMaxPositionImpactFactors } from '../executionFee/index.js';
import { getMarketPnl, getPoolUsdWithoutPnl, getCappedPoolPnl, getOpenInterestUsd } from '../markets/utils.js';
import { convertToUsd, getIsEquivalentTokens } from '../tokens/utils.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { expandDecimals, BASIS_POINTS_DIVISOR_BIGINT, applyFactor, PRECISION } from '../../lib/numbers/index.js';

function getPositionKey(account, marketAddress, collateralAddress, isLong) {
  return `${account}:${marketAddress}:${collateralAddress}:${isLong}`;
}
function parsePositionKey(positionKey) {
  const [account, marketAddress, collateralAddress, isLong] = positionKey.split(":");
  return {
    account,
    marketAddress,
    collateralAddress,
    isLong: isLong === "true"
  };
}
function getEntryPrice(p) {
  const { sizeInUsd, sizeInTokens, indexToken } = p;
  if (sizeInTokens <= 0) {
    return void 0;
  }
  return bigMath.mulDiv(
    sizeInUsd,
    expandDecimals(1, indexToken.decimals),
    sizeInTokens
  );
}
function getPositionPnlUsd(p) {
  const { marketInfo, sizeInUsd, sizeInTokens, markPrice, isLong } = p;
  const positionValueUsd = getPositionValueUsd({
    indexToken: marketInfo.indexToken,
    sizeInTokens,
    markPrice
  });
  let totalPnl = isLong ? positionValueUsd - sizeInUsd : sizeInUsd - positionValueUsd;
  if (totalPnl <= 0) {
    return totalPnl;
  }
  const poolPnl = getMarketPnl(marketInfo, isLong, true);
  const poolUsd = getPoolUsdWithoutPnl(marketInfo, isLong, "minPrice");
  const cappedPnl = getCappedPoolPnl({
    marketInfo,
    poolUsd,
    poolPnl,
    isLong
  });
  const WEI_PRECISION = expandDecimals(1, 18);
  if (cappedPnl !== poolPnl && cappedPnl > 0 && poolPnl > 0) {
    totalPnl = bigMath.mulDiv(
      totalPnl,
      cappedPnl / WEI_PRECISION,
      poolPnl / WEI_PRECISION
    );
  }
  return totalPnl;
}
function getPositionValueUsd(p) {
  const { indexToken, sizeInTokens, markPrice } = p;
  return convertToUsd(sizeInTokens, indexToken.decimals, markPrice);
}
function getPositionPendingFeesUsd(p) {
  const { pendingFundingFeesUsd, pendingBorrowingFeesUsd } = p;
  return pendingBorrowingFeesUsd + pendingFundingFeesUsd;
}
function getPositionNetValue(p) {
  const {
    pnl,
    closingFeeUsd,
    collateralUsd,
    uiFeeUsd,
    totalPendingImpactDeltaUsd,
    priceImpactDiffUsd
  } = p;
  const pendingFeesUsd = getPositionPendingFeesUsd(p);
  return collateralUsd - pendingFeesUsd - closingFeeUsd - uiFeeUsd + pnl + totalPendingImpactDeltaUsd + priceImpactDiffUsd;
}
function getPositionPnlAfterFees({
  pnl,
  pendingBorrowingFeesUsd,
  pendingFundingFeesUsd,
  closingFeeUsd,
  uiFeeUsd,
  totalPendingImpactDeltaUsd,
  priceImpactDiffUsd
}) {
  const pnlAfterFees = pnl - pendingBorrowingFeesUsd - pendingFundingFeesUsd - closingFeeUsd - uiFeeUsd + totalPendingImpactDeltaUsd + priceImpactDiffUsd;
  return pnlAfterFees;
}
function getLeverage(p) {
  const {
    pnl,
    sizeInUsd,
    collateralUsd,
    pendingBorrowingFeesUsd,
    pendingFundingFeesUsd
  } = p;
  const totalPendingFeesUsd = getPositionPendingFeesUsd({
    pendingFundingFeesUsd,
    pendingBorrowingFeesUsd
  });
  const remainingCollateralUsd = collateralUsd + (pnl ?? 0n) - totalPendingFeesUsd;
  if (remainingCollateralUsd <= 0) {
    return void 0;
  }
  return bigMath.mulDiv(
    sizeInUsd,
    BASIS_POINTS_DIVISOR_BIGINT,
    remainingCollateralUsd
  );
}
function getLiquidationPrice(p) {
  const {
    sizeInUsd,
    sizeInTokens,
    collateralUsd,
    collateralAmount,
    marketInfo,
    collateralToken,
    pendingFundingFeesUsd,
    pendingBorrowingFeesUsd,
    pendingImpactAmount,
    minCollateralUsd,
    isLong,
    userReferralInfo,
    useMaxPriceImpact
  } = p;
  if (sizeInUsd <= 0 || sizeInTokens <= 0) {
    return void 0;
  }
  const { indexToken } = marketInfo;
  const closingFeeUsd = getPositionFee(
    marketInfo,
    sizeInUsd,
    false,
    userReferralInfo
  ).positionFeeUsd;
  const totalPendingFeesUsd = getPositionPendingFeesUsd({
    pendingFundingFeesUsd,
    pendingBorrowingFeesUsd
  });
  const totalFeesUsd = totalPendingFeesUsd + closingFeeUsd;
  const maxNegativePriceImpactUsd = -1n * applyFactor(sizeInUsd, marketInfo.maxPositionImpactFactorForLiquidations);
  let priceImpactDeltaUsd = 0n;
  if (useMaxPriceImpact) {
    priceImpactDeltaUsd = maxNegativePriceImpactUsd;
  } else {
    const priceImpactForPosition = getPriceImpactForPosition(
      marketInfo,
      -sizeInUsd,
      isLong,
      { fallbackToZero: true }
    );
    priceImpactDeltaUsd = priceImpactForPosition.priceImpactDeltaUsd;
    if (priceImpactDeltaUsd > 0) {
      priceImpactDeltaUsd = capPositionImpactUsdByMaxPriceImpactFactor(
        marketInfo,
        sizeInUsd,
        priceImpactDeltaUsd
      );
    }
    const pendingImpactUsd = convertToUsd(
      pendingImpactAmount,
      marketInfo.indexToken.decimals,
      pendingImpactAmount > 0 ? marketInfo.indexToken.prices.minPrice : marketInfo.indexToken.prices.maxPrice
    );
    priceImpactDeltaUsd = priceImpactDeltaUsd + pendingImpactUsd;
    if (priceImpactDeltaUsd > 0) {
      priceImpactDeltaUsd = 0n;
    } else if (priceImpactDeltaUsd < maxNegativePriceImpactUsd) {
      priceImpactDeltaUsd = maxNegativePriceImpactUsd;
    }
  }
  let liquidationCollateralUsd = applyFactor(
    sizeInUsd,
    marketInfo.minCollateralFactorForLiquidation
  );
  if (liquidationCollateralUsd < minCollateralUsd) {
    liquidationCollateralUsd = minCollateralUsd;
  }
  let liquidationPrice;
  if (getIsEquivalentTokens(collateralToken, indexToken)) {
    if (isLong) {
      const denominator = sizeInTokens + collateralAmount;
      if (denominator == 0n) {
        return void 0;
      }
      liquidationPrice = (sizeInUsd + liquidationCollateralUsd - priceImpactDeltaUsd + totalFeesUsd) / denominator * expandDecimals(1, indexToken.decimals);
    } else {
      const denominator = sizeInTokens - collateralAmount;
      if (denominator == 0n) {
        return void 0;
      }
      liquidationPrice = (sizeInUsd - liquidationCollateralUsd + priceImpactDeltaUsd - totalFeesUsd) / denominator * expandDecimals(1, indexToken.decimals);
    }
  } else {
    if (sizeInTokens == 0n) {
      return void 0;
    }
    const remainingCollateralUsd = collateralUsd + priceImpactDeltaUsd - totalPendingFeesUsd - closingFeeUsd;
    if (isLong) {
      liquidationPrice = (liquidationCollateralUsd - remainingCollateralUsd + sizeInUsd) / sizeInTokens * expandDecimals(1, indexToken.decimals);
    } else {
      liquidationPrice = (liquidationCollateralUsd - remainingCollateralUsd - sizeInUsd) / -sizeInTokens * expandDecimals(1, indexToken.decimals);
    }
  }
  if (liquidationPrice <= 0) {
    return void 0;
  }
  return liquidationPrice;
}
function getNetPriceImpactDeltaUsdForDecrease({
  marketInfo,
  sizeInUsd,
  pendingImpactAmount,
  priceImpactDeltaUsd,
  sizeDeltaUsd
}) {
  const { proportionalPendingImpactDeltaUsd } = getProportionalPendingImpactValues({
    sizeInUsd,
    sizeDeltaUsd,
    pendingImpactAmount,
    indexToken: marketInfo.indexToken
  });
  let totalImpactDeltaUsd = priceImpactDeltaUsd + proportionalPendingImpactDeltaUsd;
  const priceImpactDiffUsd = getPriceImpactDiffUsd({
    totalImpactDeltaUsd,
    marketInfo,
    sizeDeltaUsd
  });
  if (totalImpactDeltaUsd > 0) {
    totalImpactDeltaUsd = capPositionImpactUsdByMaxPriceImpactFactor(
      marketInfo,
      sizeDeltaUsd,
      totalImpactDeltaUsd
    );
  }
  totalImpactDeltaUsd = capPositionImpactUsdByMaxImpactPool(
    marketInfo,
    totalImpactDeltaUsd
  );
  return {
    totalImpactDeltaUsd,
    proportionalPendingImpactDeltaUsd,
    priceImpactDiffUsd
  };
}
function getPriceImpactDiffUsd({
  totalImpactDeltaUsd,
  marketInfo,
  sizeDeltaUsd
}) {
  if (totalImpactDeltaUsd > 0) {
    return 0n;
  }
  const { maxNegativeImpactFactor } = getMaxPositionImpactFactors(marketInfo);
  const maxNegativeImpactUsd = -applyFactor(
    sizeDeltaUsd,
    maxNegativeImpactFactor
  );
  let priceImpactDiffUsd = 0n;
  if (totalImpactDeltaUsd < maxNegativeImpactUsd) {
    priceImpactDiffUsd = maxNegativeImpactUsd - totalImpactDeltaUsd;
  }
  return priceImpactDiffUsd;
}
function getMinCollateralFactorForPosition(position, openInterestDelta) {
  const marketInfo = position.marketInfo;
  const isLong = position.isLong;
  const openInterest = getOpenInterestUsd(marketInfo, isLong) + openInterestDelta;
  const minCollateralFactorMultiplier = isLong ? marketInfo.minCollateralFactorForOpenInterestLong : marketInfo.minCollateralFactorForOpenInterestShort;
  let minCollateralFactor = bigMath.mulDiv(
    openInterest,
    minCollateralFactorMultiplier,
    PRECISION
  );
  const minCollateralFactorForMarket = marketInfo.minCollateralFactor;
  if (minCollateralFactorForMarket > minCollateralFactor) {
    minCollateralFactor = minCollateralFactorForMarket;
  }
  return minCollateralFactor;
}

export { getEntryPrice, getLeverage, getLiquidationPrice, getMinCollateralFactorForPosition, getNetPriceImpactDeltaUsdForDecrease, getPositionKey, getPositionNetValue, getPositionPendingFeesUsd, getPositionPnlAfterFees, getPositionPnlUsd, getPositionValueUsd, getPriceImpactDiffUsd, parsePositionKey };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map