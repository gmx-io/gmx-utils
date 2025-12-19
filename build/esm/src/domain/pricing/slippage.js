import 'viem';
import '../bigmath/index.js';
import { getShouldUseMaxPrice } from './utils.js';

// src/lib/bigmath/index.ts
var bigMath = {
  abs(x) {
    return x < 0n ? -x : x;
  },
  mulDiv(x, y, z, roundUpMagnitude = false) {
    const result = x * y / z;
    if (roundUpMagnitude && this.mulmod(x, y, z) > 0n) {
      return result + 1n;
    }
    return result;
  },
  max(max, ...rest) {
    return rest.reduce((currentMax, val) => currentMax < val ? val : currentMax, max);
  },
  min(min, ...rest) {
    return rest.reduce((currentMin, val) => currentMin > val ? val : currentMin, min);
  },
  avg(...values) {
    let sum = 0n;
    let count = 0n;
    for (const value of values) {
      if (value !== void 0) {
        sum += value;
        count += 1n;
      }
    }
    if (count === 0n) {
      return void 0;
    }
    return sum / count;
  },
  divRound(x, y) {
    return x / y + (x % y * 2n > y ? 1n : 0n);
  },
  divRoundUp(x, y) {
    return (x + y - 1n) / y;
  },
  mulmod(x, y, m) {
    return x * y % m;
  },
  clamp(value, min, max) {
    return bigMath.max(min, bigMath.min(value, max));
  }
};
var BASIS_POINTS_DIVISOR = 1e4;
var BASIS_POINTS_DIVISOR_BIGINT = 10000n;
var PRECISION_DECIMALS = 30;
expandDecimals(1, PRECISION_DECIMALS);
BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
function expandDecimals(n, decimals) {
  return BigInt(n) * 10n ** BigInt(decimals);
}
function applySlippageToPrice(allowedSlippage, price, isIncrease, isLong) {
  const shouldIncreasePrice = getShouldUseMaxPrice(isIncrease, isLong);
  const slippageBasisPoints = shouldIncreasePrice ? BASIS_POINTS_DIVISOR + allowedSlippage : BASIS_POINTS_DIVISOR - allowedSlippage;
  return bigMath.mulDiv(
    price,
    BigInt(slippageBasisPoints),
    BASIS_POINTS_DIVISOR_BIGINT
  );
}
function applySlippageToMinOut(allowedSlippage, minOutputAmount) {
  const slippageBasisPoints = BASIS_POINTS_DIVISOR - allowedSlippage;
  return bigMath.mulDiv(
    minOutputAmount,
    BigInt(slippageBasisPoints),
    BASIS_POINTS_DIVISOR_BIGINT
  );
}

export { applySlippageToMinOut, applySlippageToPrice };
//# sourceMappingURL=slippage.js.map
//# sourceMappingURL=slippage.js.map