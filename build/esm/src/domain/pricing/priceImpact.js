import { getTokenPoolType, getOpenInterestForBalance } from '../markets/utils.js';
import { convertToTokenAmount, convertToUsd, getMidPrice } from '../tokens/utils.js';
import { bigNumberify } from '../tradeHistory/tradeHistory.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { getBasisPoints, expandDecimals, roundUpMagnitudeDivision, applyFactor } from '../../lib/numbers/index.js';

function getPriceImpactByAcceptablePrice(p) {
  const {
    sizeDeltaUsd,
    acceptablePrice,
    indexPrice: markPrice,
    isLong,
    isIncrease
  } = p;
  const shouldFlipPriceDiff = isIncrease ? !isLong : isLong;
  const priceDelta = (markPrice - acceptablePrice) * (shouldFlipPriceDiff ? -1n : 1n);
  const acceptablePriceDeltaBps = markPrice === 0n ? 0n : getBasisPoints(priceDelta, markPrice);
  const priceImpactDeltaUsd = acceptablePrice === 0n ? 0n : sizeDeltaUsd * priceDelta / acceptablePrice;
  const priceImpactDeltaAmount = markPrice === 0n ? 0n : priceImpactDeltaUsd / markPrice;
  return {
    priceImpactDeltaUsd,
    priceImpactDeltaAmount,
    priceDelta,
    acceptablePriceDeltaBps
  };
}
function applySwapImpactWithCap(marketInfo, token, priceImpactDeltaUsd) {
  const tokenPoolType = getTokenPoolType(marketInfo, token.address);
  if (!tokenPoolType) {
    throw new Error(
      `Token ${token.address} is not a collateral of the market ${marketInfo.marketTokenAddress}`
    );
  }
  const isLongCollateral = tokenPoolType === "long";
  const price = priceImpactDeltaUsd > 0 ? token.prices.maxPrice : token.prices.minPrice;
  let impactDeltaAmount;
  let cappedDiffUsd = 0n;
  if (priceImpactDeltaUsd > 0) {
    impactDeltaAmount = convertToTokenAmount(
      priceImpactDeltaUsd,
      token.decimals,
      price
    );
    const maxImpactAmount = isLongCollateral ? marketInfo.swapImpactPoolAmountLong : marketInfo.swapImpactPoolAmountShort;
    if (impactDeltaAmount > maxImpactAmount) {
      cappedDiffUsd = bigMath.mulDiv(
        impactDeltaAmount - maxImpactAmount,
        price,
        expandDecimals(1, token.decimals)
      );
      impactDeltaAmount = maxImpactAmount;
    }
  } else {
    impactDeltaAmount = roundUpMagnitudeDivision(
      priceImpactDeltaUsd * expandDecimals(1, token.decimals),
      price
    );
  }
  return { impactDeltaAmount, cappedDiffUsd };
}
function getCappedPositionImpactUsd(marketInfo, sizeDeltaUsd, isLong, isIncrease, opts = {}) {
  sizeDeltaUsd = isIncrease ? sizeDeltaUsd : sizeDeltaUsd * -1n;
  const { priceImpactDeltaUsd, balanceWasImproved } = getPriceImpactForPosition(
    marketInfo,
    sizeDeltaUsd,
    isLong,
    opts
  );
  if (priceImpactDeltaUsd < 0 && !opts.shouldCapNegativeImpact) {
    return { priceImpactDeltaUsd, balanceWasImproved };
  }
  const cappedImpactUsd = capPositionImpactUsdByMaxPriceImpactFactor(
    marketInfo,
    sizeDeltaUsd,
    priceImpactDeltaUsd
  );
  return {
    priceImpactDeltaUsd: cappedImpactUsd,
    balanceWasImproved
  };
}
function capPositionImpactUsdByMaxImpactPool(marketInfo, positionImpactDeltaUsd) {
  if (positionImpactDeltaUsd < 0) {
    return positionImpactDeltaUsd;
  }
  const { indexToken } = marketInfo;
  const impactPoolAmount = marketInfo.positionImpactPoolAmount;
  const maxPriceImpactUsdBasedOnImpactPool = convertToUsd(
    impactPoolAmount,
    indexToken.decimals,
    indexToken.prices.minPrice
  );
  if (positionImpactDeltaUsd > maxPriceImpactUsdBasedOnImpactPool) {
    positionImpactDeltaUsd = maxPriceImpactUsdBasedOnImpactPool;
  }
  return positionImpactDeltaUsd;
}
function capPositionImpactUsdByMaxPriceImpactFactor(marketInfo, sizeDeltaUsd, positionImpactDeltaUsd) {
  const { maxPositiveImpactFactor, maxNegativeImpactFactor } = getMaxPositionImpactFactors(marketInfo);
  const maxPriceImapctFactor = positionImpactDeltaUsd > 0 ? maxPositiveImpactFactor : maxNegativeImpactFactor;
  const maxPriceImpactUsdBasedOnMaxPriceImpactFactor = applyFactor(
    bigMath.abs(sizeDeltaUsd),
    maxPriceImapctFactor
  );
  if (bigMath.abs(positionImpactDeltaUsd) > maxPriceImpactUsdBasedOnMaxPriceImpactFactor) {
    positionImpactDeltaUsd = maxPriceImpactUsdBasedOnMaxPriceImpactFactor * (positionImpactDeltaUsd > 0 ? 1n : -1n);
  }
  return positionImpactDeltaUsd;
}
function getMaxPositionImpactFactors(marketInfo) {
  let maxPositiveImpactFactor = marketInfo.maxPositionImpactFactorPositive;
  const maxNegativeImpactFactor = marketInfo.maxPositionImpactFactorNegative;
  if (maxPositiveImpactFactor > maxNegativeImpactFactor) {
    maxPositiveImpactFactor = maxNegativeImpactFactor;
  }
  return { maxPositiveImpactFactor, maxNegativeImpactFactor };
}
function getPriceImpactForPosition(marketInfo, sizeDeltaUsd, isLong, opts = {}) {
  const longInterestUsd = getOpenInterestForBalance(marketInfo, true);
  const shortInterestUsd = getOpenInterestForBalance(marketInfo, false);
  const { currentLongUsd, currentShortUsd, nextLongUsd, nextShortUsd } = getNextOpenInterestParams({
    currentLongUsd: longInterestUsd,
    currentShortUsd: shortInterestUsd,
    usdDelta: sizeDeltaUsd,
    isLong
  });
  const { priceImpactDeltaUsd, balanceWasImproved } = getPriceImpactUsd({
    currentLongUsd,
    currentShortUsd,
    nextLongUsd,
    nextShortUsd,
    factorPositive: marketInfo.positionImpactFactorPositive,
    factorNegative: marketInfo.positionImpactFactorNegative,
    exponentFactorPositive: marketInfo.positionImpactExponentFactorPositive,
    exponentFactorNegative: marketInfo.positionImpactExponentFactorNegative,
    fallbackToZero: opts.fallbackToZero
  });
  if (priceImpactDeltaUsd > 0) {
    return {
      priceImpactDeltaUsd,
      balanceWasImproved
    };
  }
  if (bigMath.abs(marketInfo.virtualInventoryForPositions) <= 0) {
    return {
      priceImpactDeltaUsd,
      balanceWasImproved
    };
  }
  const virtualInventoryParams = getNextOpenInterestForVirtualInventory({
    virtualInventory: marketInfo.virtualInventoryForPositions,
    usdDelta: sizeDeltaUsd,
    isLong
  });
  const { priceImpactDeltaUsd: priceImpactUsdForVirtualInventory } = getPriceImpactUsd({
    currentLongUsd: virtualInventoryParams.currentLongUsd,
    currentShortUsd: virtualInventoryParams.currentShortUsd,
    nextLongUsd: virtualInventoryParams.nextLongUsd,
    nextShortUsd: virtualInventoryParams.nextShortUsd,
    factorPositive: marketInfo.positionImpactFactorPositive,
    factorNegative: marketInfo.positionImpactFactorNegative,
    exponentFactorPositive: marketInfo.positionImpactExponentFactorPositive,
    exponentFactorNegative: marketInfo.positionImpactExponentFactorNegative,
    fallbackToZero: opts.fallbackToZero
  });
  return {
    priceImpactDeltaUsd: priceImpactUsdForVirtualInventory < priceImpactDeltaUsd ? priceImpactUsdForVirtualInventory : priceImpactDeltaUsd,
    balanceWasImproved
  };
}
function getProportionalPendingImpactValues({
  sizeInUsd,
  pendingImpactAmount,
  sizeDeltaUsd,
  indexToken
}) {
  const proportionalPendingImpactDeltaAmount = sizeDeltaUsd !== 0n && sizeInUsd !== 0n ? bigMath.mulDiv(
    pendingImpactAmount,
    sizeDeltaUsd,
    sizeInUsd,
    pendingImpactAmount < 0n
  ) : 0n;
  const proportionalPendingImpactDeltaUsd = convertToUsd(
    proportionalPendingImpactDeltaAmount,
    indexToken.decimals,
    proportionalPendingImpactDeltaAmount > 0 ? indexToken.prices.minPrice : indexToken.prices.maxPrice
  );
  return {
    proportionalPendingImpactDeltaAmount,
    proportionalPendingImpactDeltaUsd
  };
}
function getPriceImpactForSwap(marketInfo, tokenA, tokenB, usdDeltaTokenA, usdDeltaTokenB, opts = {}) {
  const tokenAPoolType = getTokenPoolType(marketInfo, tokenA.address);
  const tokenBPoolType = getTokenPoolType(marketInfo, tokenB.address);
  if (tokenAPoolType === void 0 || tokenBPoolType === void 0 || tokenAPoolType === tokenBPoolType && !marketInfo.isSameCollaterals) {
    throw new Error(
      `Invalid tokens to swap ${marketInfo.marketTokenAddress} ${tokenA.address} ${tokenB.address}`
    );
  }
  const [longToken, shortToken] = tokenAPoolType === "long" ? [tokenA, tokenB] : [tokenB, tokenA];
  const [longDeltaUsd, shortDeltaUsd] = tokenAPoolType === "long" ? [usdDeltaTokenA, usdDeltaTokenB] : [usdDeltaTokenB, usdDeltaTokenA];
  const { longPoolUsd, shortPoolUsd, nextLongPoolUsd, nextShortPoolUsd } = getNextPoolAmountsParams({
    longToken,
    shortToken,
    longPoolAmount: marketInfo.longPoolAmount,
    shortPoolAmount: marketInfo.shortPoolAmount,
    longDeltaUsd,
    shortDeltaUsd
  });
  const { priceImpactDeltaUsd, balanceWasImproved } = getPriceImpactUsd({
    currentLongUsd: longPoolUsd,
    currentShortUsd: shortPoolUsd,
    nextLongUsd: nextLongPoolUsd,
    nextShortUsd: nextShortPoolUsd,
    factorPositive: marketInfo.swapImpactFactorPositive,
    factorNegative: marketInfo.swapImpactFactorNegative,
    exponentFactorPositive: marketInfo.swapImpactExponentFactor,
    exponentFactorNegative: marketInfo.swapImpactExponentFactor,
    fallbackToZero: opts.fallbackToZero
  });
  if (priceImpactDeltaUsd > 0) {
    return {
      priceImpactDeltaUsd,
      balanceWasImproved
    };
  }
  const virtualInventoryLong = marketInfo.virtualPoolAmountForLongToken;
  const virtualInventoryShort = marketInfo.virtualPoolAmountForShortToken;
  if (virtualInventoryLong <= 0 || virtualInventoryShort <= 0) {
    return {
      priceImpactDeltaUsd,
      balanceWasImproved
    };
  }
  const virtualInventoryParams = getNextPoolAmountsParams({
    longToken,
    shortToken,
    longPoolAmount: virtualInventoryLong,
    shortPoolAmount: virtualInventoryShort,
    longDeltaUsd,
    shortDeltaUsd
  });
  const { priceImpactDeltaUsd: priceImpactUsdForVirtualInventory } = getPriceImpactUsd({
    currentLongUsd: virtualInventoryParams.longPoolUsd,
    currentShortUsd: virtualInventoryParams.shortPoolUsd,
    nextLongUsd: virtualInventoryParams.nextLongPoolUsd,
    nextShortUsd: virtualInventoryParams.nextShortPoolUsd,
    factorPositive: marketInfo.swapImpactFactorPositive,
    factorNegative: marketInfo.swapImpactFactorNegative,
    exponentFactorPositive: marketInfo.swapImpactExponentFactor,
    exponentFactorNegative: marketInfo.swapImpactExponentFactor,
    fallbackToZero: opts.fallbackToZero
  });
  return {
    priceImpactDeltaUsd: priceImpactUsdForVirtualInventory < priceImpactDeltaUsd ? priceImpactUsdForVirtualInventory : priceImpactDeltaUsd,
    balanceWasImproved
  };
}
function getNextOpenInterestForVirtualInventory(p) {
  const { virtualInventory, usdDelta, isLong } = p;
  let currentLongUsd = 0n;
  let currentShortUsd = 0n;
  if (virtualInventory > 0) {
    currentShortUsd = virtualInventory;
  } else {
    currentLongUsd = virtualInventory * -1n;
  }
  if (usdDelta < 0) {
    const offset = bigMath.abs(usdDelta);
    currentLongUsd = currentLongUsd + offset;
    currentShortUsd = currentShortUsd + offset;
  }
  return getNextOpenInterestParams({
    currentLongUsd,
    currentShortUsd,
    usdDelta,
    isLong
  });
}
function getNextOpenInterestParams(p) {
  const { currentLongUsd, currentShortUsd, usdDelta, isLong } = p;
  let nextLongUsd = currentLongUsd;
  let nextShortUsd = currentShortUsd;
  if (isLong) {
    nextLongUsd = (currentLongUsd ?? 0n) + (usdDelta ?? 0n);
  } else {
    nextShortUsd = (currentShortUsd ?? 0n) + (usdDelta ?? 0n);
  }
  return {
    currentLongUsd,
    currentShortUsd,
    nextLongUsd,
    nextShortUsd
  };
}
function getNextPoolAmountsParams(p) {
  const {
    longToken,
    shortToken,
    longPoolAmount,
    shortPoolAmount,
    longDeltaUsd,
    shortDeltaUsd
  } = p;
  const longPrice = getMidPrice(longToken.prices);
  const shortPrice = getMidPrice(shortToken.prices);
  const longPoolUsd = convertToUsd(
    longPoolAmount,
    longToken.decimals,
    longPrice
  );
  const shortPoolUsd = convertToUsd(
    shortPoolAmount,
    shortToken.decimals,
    shortPrice
  );
  const nextLongPoolUsd = longPoolUsd + longDeltaUsd;
  const nextShortPoolUsd = shortPoolUsd + shortDeltaUsd;
  return {
    longPoolUsd,
    shortPoolUsd,
    nextLongPoolUsd,
    nextShortPoolUsd
  };
}
function getPriceImpactUsd(p) {
  const { nextLongUsd, nextShortUsd } = p;
  if (nextLongUsd < 0 || nextShortUsd < 0) {
    if (p.fallbackToZero) {
      return {
        priceImpactDeltaUsd: 0n,
        balanceWasImproved: false
      };
    } else {
      throw new Error("Negative pool amount");
    }
  }
  const currentDiff = bigMath.abs(p.currentLongUsd - p.currentShortUsd);
  const nextDiff = bigMath.abs(nextLongUsd - nextShortUsd);
  const isSameSideRebalance = p.currentLongUsd < p.currentShortUsd === nextLongUsd < nextShortUsd;
  const balanceWasImproved = nextDiff < currentDiff;
  let priceImpactDeltaUsd;
  if (isSameSideRebalance) {
    const hasPositiveImpact = nextDiff < currentDiff;
    const factor = hasPositiveImpact ? p.factorPositive : p.factorNegative;
    const exponentFactor = hasPositiveImpact ? p.exponentFactorPositive : p.exponentFactorNegative;
    priceImpactDeltaUsd = calculateImpactForSameSideRebalance({
      currentDiff,
      nextDiff,
      hasPositiveImpact,
      factor,
      exponentFactor
    });
  } else {
    priceImpactDeltaUsd = calculateImpactForCrossoverRebalance({
      currentDiff,
      nextDiff,
      factorPositive: p.factorPositive,
      factorNegative: p.factorNegative,
      exponentFactorPositive: p.exponentFactorPositive,
      exponentFactorNegative: p.exponentFactorNegative
    });
  }
  return {
    priceImpactDeltaUsd,
    balanceWasImproved
  };
}
function calculateImpactForSameSideRebalance(p) {
  const { currentDiff, nextDiff, hasPositiveImpact, factor, exponentFactor } = p;
  const currentImpact = applyImpactFactor(currentDiff, factor, exponentFactor);
  const nextImpact = applyImpactFactor(nextDiff, factor, exponentFactor);
  const deltaDiff = bigMath.abs(currentImpact - nextImpact);
  return hasPositiveImpact ? deltaDiff : -deltaDiff;
}
function calculateImpactForCrossoverRebalance(p) {
  const {
    currentDiff,
    nextDiff,
    factorNegative,
    factorPositive,
    exponentFactorPositive,
    exponentFactorNegative
  } = p;
  const positiveImpact = applyImpactFactor(
    currentDiff,
    factorPositive,
    exponentFactorPositive
  );
  const negativeImpactUsd = applyImpactFactor(
    nextDiff,
    factorNegative,
    exponentFactorNegative
  );
  const deltaDiffUsd = bigMath.abs(positiveImpact - negativeImpactUsd);
  return positiveImpact > negativeImpactUsd ? deltaDiffUsd : -deltaDiffUsd;
}
function applyImpactFactor(diff, factor, exponent) {
  const _diff = Number(diff) / 10 ** 30;
  const _exponent = Number(exponent) / 10 ** 30;
  let result = bigNumberify(BigInt(Math.round(_diff ** _exponent * 10 ** 30)));
  result = result * factor / expandDecimals(1, 30);
  return result;
}
function getCappedPriceImpactPercentageFromFees({
  fees,
  isSwap
}) {
  if (isSwap) {
    return fees?.swapPriceImpact?.precisePercentage ?? 0n;
  }
  return fees?.positionNetPriceImpact?.precisePercentage ?? 0n;
}

export { applyImpactFactor, applySwapImpactWithCap, calculateImpactForCrossoverRebalance, calculateImpactForSameSideRebalance, capPositionImpactUsdByMaxImpactPool, capPositionImpactUsdByMaxPriceImpactFactor, getCappedPositionImpactUsd, getCappedPriceImpactPercentageFromFees, getMaxPositionImpactFactors, getNextPoolAmountsParams, getPriceImpactByAcceptablePrice, getPriceImpactForPosition, getPriceImpactForSwap, getPriceImpactUsd, getProportionalPendingImpactValues };
//# sourceMappingURL=priceImpact.js.map
//# sourceMappingURL=priceImpact.js.map