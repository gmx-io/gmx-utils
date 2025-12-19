import { getAddress } from 'viem';
import '../bigmath/index.js';

// src/domain/fees/rebates/utils.ts
var PRECISION_DECIMALS = 30;
var PRECISION = expandDecimals(1, PRECISION_DECIMALS);
BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
function expandDecimals(n, decimals) {
  return BigInt(n) * 10n ** BigInt(decimals);
}
function nowInSeconds() {
  return Math.floor(Date.now() / 1e3);
}
-(/* @__PURE__ */ new Date()).getTimezoneOffset() * 60;

// src/domain/fees/rebates/utils.ts
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