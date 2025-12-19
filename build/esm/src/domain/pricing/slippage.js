import { bigMath } from '../../lib/bigmath/index.js';
import { BASIS_POINTS_DIVISOR_BIGINT, BASIS_POINTS_DIVISOR } from '../../lib/numbers/index.js';
import { getShouldUseMaxPrice } from './utils.js';

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