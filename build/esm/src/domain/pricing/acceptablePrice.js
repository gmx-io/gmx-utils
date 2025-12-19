import { DEFAULT_ACCEPTABLE_PRICE_IMPACT_BUFFER } from '../../configs/factors.js';
import { getPriceImpactByAcceptablePrice, getCappedPositionImpactUsd } from '../executionFee/index.js';
import { convertToTokenAmount } from '../tokens/utils.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { BASIS_POINTS_DIVISOR_BIGINT, roundUpMagnitudeDivision, expandDecimals, getBasisPoints } from '../../lib/numbers/index.js';
import { getShouldUseMaxPrice } from './utils.js';

function getAcceptablePriceInfo(p) {
  const {
    marketInfo,
    isIncrease,
    isLong,
    indexPrice,
    sizeDeltaUsd,
    maxNegativePriceImpactBps
  } = p;
  const { indexToken } = marketInfo;
  const values = {
    acceptablePrice: 0n,
    acceptablePriceDeltaBps: 0n,
    priceImpactDeltaAmount: 0n,
    priceImpactDeltaUsd: 0n,
    priceImpactDiffUsd: 0n,
    balanceWasImproved: false
  };
  if (sizeDeltaUsd <= 0 || indexPrice == 0n) {
    return values;
  }
  const shouldFlipPriceImpact = getShouldUseMaxPrice(p.isIncrease, p.isLong);
  if (maxNegativePriceImpactBps !== void 0 && maxNegativePriceImpactBps > 0) {
    let priceDelta = bigMath.mulDiv(
      indexPrice,
      maxNegativePriceImpactBps,
      BASIS_POINTS_DIVISOR_BIGINT
    );
    priceDelta = shouldFlipPriceImpact ? priceDelta * -1n : priceDelta;
    values.acceptablePrice = indexPrice - priceDelta;
    values.acceptablePriceDeltaBps = maxNegativePriceImpactBps * -1n;
    const priceImpact = getPriceImpactByAcceptablePrice({
      sizeDeltaUsd,
      acceptablePrice: values.acceptablePrice,
      indexPrice,
      isLong,
      isIncrease
    });
    values.priceImpactDeltaUsd = priceImpact.priceImpactDeltaUsd;
    values.priceImpactDeltaAmount = priceImpact.priceImpactDeltaAmount;
    return values;
  }
  const { priceImpactDeltaUsd, balanceWasImproved } = getCappedPositionImpactUsd(marketInfo, sizeDeltaUsd, isLong, isIncrease, {
    fallbackToZero: !isIncrease,
    shouldCapNegativeImpact: false
  });
  values.priceImpactDeltaUsd = priceImpactDeltaUsd;
  values.balanceWasImproved = balanceWasImproved;
  if (values.priceImpactDeltaUsd > 0) {
    values.priceImpactDeltaAmount = convertToTokenAmount(
      values.priceImpactDeltaUsd,
      indexToken.decimals,
      indexToken.prices.maxPrice
    );
  } else {
    values.priceImpactDeltaAmount = roundUpMagnitudeDivision(
      values.priceImpactDeltaUsd * expandDecimals(1, indexToken.decimals),
      indexToken.prices.minPrice
    );
  }
  const { priceImpactDeltaUsd: priceImpactDeltaUsdForAcceptablePrice } = getCappedPositionImpactUsd(marketInfo, sizeDeltaUsd, isLong, isIncrease, {
    fallbackToZero: !isIncrease,
    shouldCapNegativeImpact: false
  });
  const acceptablePriceValues = getAcceptablePriceByPriceImpact({
    isIncrease,
    isLong,
    indexPrice,
    sizeDeltaUsd,
    priceImpactDeltaUsd: priceImpactDeltaUsdForAcceptablePrice
  });
  values.acceptablePrice = acceptablePriceValues.acceptablePrice;
  values.acceptablePriceDeltaBps = acceptablePriceValues.acceptablePriceDeltaBps;
  return values;
}
function getAcceptablePriceByPriceImpact(p) {
  const { indexPrice, sizeDeltaUsd, priceImpactDeltaUsd } = p;
  if (sizeDeltaUsd <= 0 || indexPrice == 0n) {
    return {
      acceptablePrice: indexPrice,
      acceptablePriceDeltaBps: 0n,
      priceDelta: 0n
    };
  }
  const shouldFlipPriceImpact = getShouldUseMaxPrice(p.isIncrease, p.isLong);
  const priceImpactForPriceAdjustment = shouldFlipPriceImpact ? priceImpactDeltaUsd * -1n : priceImpactDeltaUsd;
  const acceptablePrice = bigMath.mulDiv(
    indexPrice,
    sizeDeltaUsd + priceImpactForPriceAdjustment,
    sizeDeltaUsd
  );
  const priceDelta = (indexPrice - acceptablePrice) * (shouldFlipPriceImpact ? 1n : -1n);
  const acceptablePriceDeltaBps = getBasisPoints(priceDelta, p.indexPrice);
  return {
    acceptablePrice,
    acceptablePriceDeltaBps,
    priceDelta
  };
}
function getDefaultAcceptablePriceImpactBps(p) {
  const {
    indexPrice,
    sizeDeltaUsd,
    priceImpactDeltaUsd,
    acceptablePriceImapctBuffer = DEFAULT_ACCEPTABLE_PRICE_IMPACT_BUFFER
  } = p;
  if (priceImpactDeltaUsd > 0) {
    return BigInt(acceptablePriceImapctBuffer);
  }
  const baseAcceptablePriceValues = getAcceptablePriceByPriceImpact({
    isIncrease: p.isIncrease,
    isLong: p.isLong,
    indexPrice,
    sizeDeltaUsd,
    priceImpactDeltaUsd
  });
  if (baseAcceptablePriceValues.acceptablePriceDeltaBps < 0) {
    return bigMath.abs(baseAcceptablePriceValues.acceptablePriceDeltaBps) + BigInt(acceptablePriceImapctBuffer);
  }
  return BigInt(acceptablePriceImapctBuffer);
}
function getNextPositionExecutionPrice(p) {
  if (p.sizeDeltaUsd == 0n) {
    return null;
  }
  const adjustedPriceImpactUsd = p.isIncrease ? p.isLong ? -p.priceImpactUsd : p.priceImpactUsd : p.isLong ? p.priceImpactUsd : -p.priceImpactUsd;
  const adjustment = bigMath.mulDiv(
    p.triggerPrice,
    adjustedPriceImpactUsd,
    p.sizeDeltaUsd
  );
  return p.triggerPrice + adjustment;
}

export { getAcceptablePriceByPriceImpact, getAcceptablePriceInfo, getDefaultAcceptablePriceImpactBps, getNextPositionExecutionPrice };
//# sourceMappingURL=acceptablePrice.js.map
//# sourceMappingURL=acceptablePrice.js.map