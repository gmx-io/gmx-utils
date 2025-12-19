import { HIGH_PRICE_IMPACT_BPS } from '../../configs/factors.js';
import { getOpenInterestForBalance } from '../markets/utils.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { applyFactor, getBasisPoints, PRECISION } from '../../lib/numbers/index.js';
export * from './estimateOraclePriceCount.js';
export * from './executionFee.js';
export * from '../pricing/priceImpact.js';

function getSwapFee(marketInfo, swapAmount, balanceWasImproved, isAtomicSwap) {
  let factor;
  if (isAtomicSwap) {
    factor = marketInfo.atomicSwapFeeFactor;
  } else {
    factor = balanceWasImproved ? marketInfo.swapFeeFactorForBalanceWasImproved : marketInfo.swapFeeFactorForBalanceWasNotImproved;
  }
  return applyFactor(swapAmount, factor);
}
function getPositionFee(marketInfo, sizeDeltaUsd, balanceWasImproved, referralInfo, uiFeeFactor) {
  const factor = balanceWasImproved ? marketInfo.positionFeeFactorForBalanceWasImproved : marketInfo.positionFeeFactorForBalanceWasNotImproved;
  let positionFeeUsd = applyFactor(sizeDeltaUsd, factor);
  const uiFeeUsd = applyFactor(sizeDeltaUsd, uiFeeFactor ?? 0n);
  if (!referralInfo) {
    return { positionFeeUsd, discountUsd: 0n, totalRebateUsd: 0n };
  }
  const totalRebateUsd = applyFactor(
    positionFeeUsd,
    referralInfo.totalRebateFactor
  );
  const discountUsd = applyFactor(totalRebateUsd, referralInfo.discountFactor);
  positionFeeUsd = positionFeeUsd - discountUsd;
  return {
    positionFeeUsd,
    discountUsd,
    totalRebateUsd,
    uiFeeUsd
  };
}
function getFundingFactorPerPeriod(marketInfo, isLong, periodInSeconds) {
  const { fundingFactorPerSecond, longsPayShorts } = marketInfo;
  const longInterestUsd = getOpenInterestForBalance(marketInfo, true);
  const shortInterestUsd = getOpenInterestForBalance(marketInfo, false);
  const payingInterestUsd = longsPayShorts ? longInterestUsd : shortInterestUsd;
  const receivingInterestUsd = longsPayShorts ? shortInterestUsd : longInterestUsd;
  const fundingForPayingSide = fundingFactorPerSecond;
  let fundingForReceivingSide = 0n;
  if (receivingInterestUsd !== 0n) {
    fundingForReceivingSide = bigMath.mulDiv(
      fundingForPayingSide,
      payingInterestUsd,
      receivingInterestUsd
    );
  }
  if (longsPayShorts && isLong || !longsPayShorts && !isLong) {
    return fundingForPayingSide * BigInt(periodInSeconds) * -1n;
  } else {
    return fundingForReceivingSide * BigInt(periodInSeconds);
  }
}
function getFundingFeeRateUsd(marketInfo, isLong, sizeInUsd, periodInSeconds) {
  const factor = getFundingFactorPerPeriod(marketInfo, isLong, periodInSeconds);
  return applyFactor(sizeInUsd, factor);
}
function getBorrowingFactorPerPeriod(marketInfo, isLong, periodInSeconds) {
  const factorPerSecond = isLong ? marketInfo.borrowingFactorPerSecondForLongs : marketInfo.borrowingFactorPerSecondForShorts;
  return factorPerSecond * BigInt(periodInSeconds || 1);
}
function getBorrowingFeeRateUsd(marketInfo, isLong, sizeInUsd, periodInSeconds) {
  const factor = getBorrowingFactorPerPeriod(
    marketInfo,
    isLong,
    periodInSeconds
  );
  return applyFactor(sizeInUsd, factor);
}
function getIsHighPriceImpact(positionPriceImpact, swapPriceImpact) {
  const totalPriceImpact = getTotalFeeItem([
    positionPriceImpact,
    swapPriceImpact
  ]);
  return totalPriceImpact.deltaUsd < 0 && bigMath.abs(totalPriceImpact.bps) >= HIGH_PRICE_IMPACT_BPS;
}
function getFeeItem(feeDeltaUsd, basis, opts = {}) {
  const { shouldRoundUp = false } = opts;
  if (feeDeltaUsd === void 0) return void 0;
  return {
    deltaUsd: feeDeltaUsd,
    bps: basis !== void 0 && basis > 0 ? getBasisPoints(feeDeltaUsd, basis, shouldRoundUp) : 0n,
    precisePercentage: basis !== void 0 && basis > 0 ? bigMath.mulDiv(feeDeltaUsd, PRECISION, basis) : 0n
  };
}
function getTotalFeeItem(feeItems) {
  const totalFeeItem = {
    deltaUsd: 0n,
    bps: 0n,
    precisePercentage: 0n
  };
  feeItems.filter(Boolean).forEach((feeItem) => {
    totalFeeItem.deltaUsd = totalFeeItem.deltaUsd + feeItem.deltaUsd;
    totalFeeItem.bps = totalFeeItem.bps + feeItem.bps;
    totalFeeItem.precisePercentage = totalFeeItem.precisePercentage + feeItem.precisePercentage;
  });
  return totalFeeItem;
}
function getTotalSwapVolumeFromSwapStats(swapSteps) {
  if (!swapSteps) return 0n;
  return swapSteps.reduce((acc, curr) => {
    return acc + curr.usdIn;
  }, 0n);
}

export { getBorrowingFactorPerPeriod, getBorrowingFeeRateUsd, getFeeItem, getFundingFactorPerPeriod, getFundingFeeRateUsd, getIsHighPriceImpact, getPositionFee, getSwapFee, getTotalFeeItem, getTotalSwapVolumeFromSwapStats };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map