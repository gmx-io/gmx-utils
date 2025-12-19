import { getAddress } from 'viem';
import { PRECISION, expandDecimals } from '../../../lib/numbers/index.js';
import { nowInSeconds } from '../../../lib/time.js';

function calculateRebateInfo(rawRebatesData, positionsConstants) {
  if (!positionsConstants) {
    return {
      accruedPositionPriceImpactFees: [],
      claimablePositionPriceImpactFees: []
    };
  }
  const res = {
    accruedPositionPriceImpactFees: [],
    claimablePositionPriceImpactFees: []
  };
  rawRebatesData?.forEach((rawRebateInfo) => {
    const factorByTime = BigInt(rawRebateInfo.factorByTime);
    const reductionFactor = BigInt(rawRebateInfo.reductionFactor);
    const timeKey = BigInt(rawRebateInfo.timeKey);
    const value = BigInt(rawRebateInfo.value);
    let factor = BigInt(rawRebateInfo.factor);
    if (factorByTime > factor) {
      factor = factorByTime;
    }
    const timeDiff = BigInt(nowInSeconds()) - timeKey * positionsConstants.claimableCollateralTimeDivisor;
    if (factor === 0n && reductionFactor === 0n && timeDiff > positionsConstants.claimableCollateralDelay) {
      factor = PRECISION;
    }
    if (factor > reductionFactor) {
      factor -= reductionFactor;
    } else {
      factor = 0n;
    }
    let valueByFactor = value * factor / expandDecimals(1, 30);
    const rebateInfo = {
      factor,
      value,
      valueByFactor,
      timeKey: rawRebateInfo.timeKey.toString(),
      marketAddress: getAddress(rawRebateInfo.marketAddress),
      tokenAddress: getAddress(rawRebateInfo.tokenAddress),
      reductionFactor,
      id: rawRebateInfo.id
    };
    if (factor > 0n && valueByFactor === 0n) {
      return;
    }
    if (rebateInfo.factor === 0n) {
      res.accruedPositionPriceImpactFees.push(rebateInfo);
    } else {
      res.claimablePositionPriceImpactFees.push(rebateInfo);
    }
  });
  return res;
}

export { calculateRebateInfo };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map