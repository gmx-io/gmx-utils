import { DEFAULT_ACCEPTABLE_PRICE_IMPACT_BUFFER } from "configs/factors";
import {
  getCappedPositionImpactUsd,
  getPriceImpactByAcceptablePrice,
} from "domain/executionFee";
import { MarketInfo } from "domain/markets/types";
import { convertToTokenAmount } from "domain/tokens/utils";
import { bigMath } from "lib/bigmath";
import { BASIS_POINTS_DIVISOR_BIGINT } from "lib/numbers";
import {
  expandDecimals,
  getBasisPoints,
  roundUpMagnitudeDivision,
} from "lib/numbers";

import { getShouldUseMaxPrice } from "./utils";

export function getAcceptablePriceInfo(p: {
  marketInfo: MarketInfo;
  isIncrease: boolean;
  isLimit: boolean;
  isLong: boolean;
  indexPrice: bigint;
  sizeDeltaUsd: bigint;
  maxNegativePriceImpactBps?: bigint;
}) {
  const {
    marketInfo,
    isIncrease,
    isLong,
    indexPrice,
    sizeDeltaUsd,
    maxNegativePriceImpactBps,
  } = p;
  const { indexToken } = marketInfo;

  const values = {
    acceptablePrice: 0n,
    acceptablePriceDeltaBps: 0n,
    priceImpactDeltaAmount: 0n,
    priceImpactDeltaUsd: 0n,
    priceImpactDiffUsd: 0n,
    balanceWasImproved: false,
  };

  if (sizeDeltaUsd <= 0 || indexPrice == 0n) {
    return values;
  }

  const shouldFlipPriceImpact = getShouldUseMaxPrice(p.isIncrease, p.isLong);

  // For Limit / Trigger orders
  if (
    maxNegativePriceImpactBps !== undefined &&
    maxNegativePriceImpactBps > 0
  ) {
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
      isIncrease,
    });

    values.priceImpactDeltaUsd = priceImpact.priceImpactDeltaUsd;
    values.priceImpactDeltaAmount = priceImpact.priceImpactDeltaAmount;

    return values;
  }

  const { priceImpactDeltaUsd, balanceWasImproved } =
    getCappedPositionImpactUsd(marketInfo, sizeDeltaUsd, isLong, isIncrease, {
      fallbackToZero: !isIncrease,
      shouldCapNegativeImpact: false,
    });

  /**
   * We display this value as price impact on action (increase or decrease)
   * But for acceptable price calculation uncapped price impact is used
   * Also on decrease action we calculate totalImpactUsd which will be deducted from the collateral
   */
  values.priceImpactDeltaUsd = priceImpactDeltaUsd;
  values.balanceWasImproved = balanceWasImproved;

  if (values.priceImpactDeltaUsd > 0) {
    values.priceImpactDeltaAmount = convertToTokenAmount(
      values.priceImpactDeltaUsd,
      indexToken.decimals,
      indexToken.prices.maxPrice
    )!;
  } else {
    values.priceImpactDeltaAmount = roundUpMagnitudeDivision(
      values.priceImpactDeltaUsd * expandDecimals(1, indexToken.decimals),
      indexToken.prices.minPrice
    );
  }

  // Use uncapped price impact for the acceptable price calculation
  const { priceImpactDeltaUsd: priceImpactDeltaUsdForAcceptablePrice } =
    getCappedPositionImpactUsd(marketInfo, sizeDeltaUsd, isLong, isIncrease, {
      fallbackToZero: !isIncrease,
      shouldCapNegativeImpact: false,
    });

  const acceptablePriceValues = getAcceptablePriceByPriceImpact({
    isIncrease,
    isLong,
    indexPrice,
    sizeDeltaUsd,
    priceImpactDeltaUsd: priceImpactDeltaUsdForAcceptablePrice,
  });

  values.acceptablePrice = acceptablePriceValues.acceptablePrice;
  values.acceptablePriceDeltaBps =
    acceptablePriceValues.acceptablePriceDeltaBps;

  return values;
}

export function getAcceptablePriceByPriceImpact(p: {
  isIncrease: boolean;
  isLong: boolean;
  indexPrice: bigint;
  sizeDeltaUsd: bigint;
  priceImpactDeltaUsd: bigint;
}) {
  const { indexPrice, sizeDeltaUsd, priceImpactDeltaUsd } = p;

  if (sizeDeltaUsd <= 0 || indexPrice == 0n) {
    return {
      acceptablePrice: indexPrice,
      acceptablePriceDeltaBps: 0n,
      priceDelta: 0n,
    };
  }

  const shouldFlipPriceImpact = getShouldUseMaxPrice(p.isIncrease, p.isLong);

  const priceImpactForPriceAdjustment = shouldFlipPriceImpact
    ? priceImpactDeltaUsd * -1n
    : priceImpactDeltaUsd;
  const acceptablePrice = bigMath.mulDiv(
    indexPrice,
    sizeDeltaUsd + priceImpactForPriceAdjustment,
    sizeDeltaUsd
  );

  const priceDelta =
    (indexPrice - acceptablePrice) * (shouldFlipPriceImpact ? 1n : -1n);
  const acceptablePriceDeltaBps = getBasisPoints(priceDelta, p.indexPrice);

  return {
    acceptablePrice,
    acceptablePriceDeltaBps,
    priceDelta,
  };
}

export function getDefaultAcceptablePriceImpactBps(p: {
  isIncrease: boolean;
  isLong: boolean;
  indexPrice: bigint;
  sizeDeltaUsd: bigint;
  priceImpactDeltaUsd: bigint;
  acceptablePriceImapctBuffer?: number;
}) {
  const {
    indexPrice,
    sizeDeltaUsd,
    priceImpactDeltaUsd,
    acceptablePriceImapctBuffer = DEFAULT_ACCEPTABLE_PRICE_IMPACT_BUFFER,
  } = p;

  if (priceImpactDeltaUsd > 0) {
    return BigInt(acceptablePriceImapctBuffer);
  }

  const baseAcceptablePriceValues = getAcceptablePriceByPriceImpact({
    isIncrease: p.isIncrease,
    isLong: p.isLong,
    indexPrice,
    sizeDeltaUsd,
    priceImpactDeltaUsd,
  });

  if (baseAcceptablePriceValues.acceptablePriceDeltaBps < 0) {
    return (
      bigMath.abs(baseAcceptablePriceValues.acceptablePriceDeltaBps) +
      BigInt(acceptablePriceImapctBuffer)
    );
  }

  return BigInt(acceptablePriceImapctBuffer);
}

export function getNextPositionExecutionPrice(p: {
  triggerPrice: bigint;
  priceImpactUsd: bigint;
  sizeDeltaUsd: bigint;
  isLong: boolean;
  isIncrease: boolean;
}): bigint | null {
  if (p.sizeDeltaUsd == 0n) {
    return null;
  }

  const adjustedPriceImpactUsd = p.isIncrease
    ? p.isLong
      ? -p.priceImpactUsd
      : p.priceImpactUsd
    : p.isLong
    ? p.priceImpactUsd
    : -p.priceImpactUsd;

  const adjustment = bigMath.mulDiv(
    p.triggerPrice,
    adjustedPriceImpactUsd,
    p.sizeDeltaUsd
  );

  return p.triggerPrice + adjustment;
}
