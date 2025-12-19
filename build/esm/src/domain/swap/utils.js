import { DEFAULT_ALLOWED_SWAP_SLIPPAGE_BPS } from '../../configs/factors.js';
import { DecreasePositionSwapType } from '../decrease/types.js';
import { getIsEquivalentTokens } from '../tokens/utils.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { PRECISION, expandDecimals, adjustForDecimals, BASIS_POINTS_DIVISOR_BIGINT } from '../../lib/numbers/index.js';

function getSwapCount({
  isSwap,
  isIncrease,
  increaseAmounts,
  decreaseAmounts,
  swapAmounts
}) {
  if (isSwap) {
    if (!swapAmounts) return void 0;
    return swapAmounts.swapStrategy.swapPathStats?.swapPath.length ?? 0;
  } else if (isIncrease) {
    if (!increaseAmounts) return void 0;
    return increaseAmounts.swapStrategy.swapPathStats?.swapPath.length ?? 0;
  } else {
    if (decreaseAmounts?.decreaseSwapType === void 0) return void 0;
    return decreaseAmounts.decreaseSwapType !== DecreasePositionSwapType.NoSwap ? 1 : 0;
  }
}
function getTokensRatioByAmounts(p) {
  const { fromToken, toToken, fromTokenAmount, toTokenAmount } = p;
  const adjustedFromAmount = fromTokenAmount * PRECISION / expandDecimals(1, fromToken.decimals);
  const adjustedToAmount = toTokenAmount * PRECISION / expandDecimals(1, toToken.decimals);
  const [smallestToken, largestToken, largestAmount, smallestAmount] = adjustedFromAmount > adjustedToAmount ? [fromToken, toToken, adjustedFromAmount, adjustedToAmount] : [toToken, fromToken, adjustedToAmount, adjustedFromAmount];
  const ratio = smallestAmount > 0 ? largestAmount * PRECISION / smallestAmount : 0n;
  return { ratio, largestToken, smallestToken };
}
function getTokensRatioByMinOutputAmountAndTriggerPrice(p) {
  const {
    fromToken,
    toToken,
    fromTokenAmount,
    toTokenAmount,
    triggerPrice,
    minOutputAmount
  } = p;
  let allowedSwapSlippageBps = DEFAULT_ALLOWED_SWAP_SLIPPAGE_BPS;
  let smallestToken = fromToken;
  let largestToken = toToken;
  let largestAmount = fromTokenAmount;
  let smallestAmount = toTokenAmount;
  let acceptablePrice = 0n;
  let ratio = 0n;
  const adjustedFromAmount = fromTokenAmount * PRECISION / expandDecimals(1, fromToken.decimals);
  const adjustedToAmount = minOutputAmount * PRECISION / expandDecimals(1, toToken.decimals);
  const adjustedMinOutputAmount = minOutputAmount * PRECISION / expandDecimals(1, toToken.decimals);
  [smallestToken, largestToken, largestAmount, smallestAmount] = adjustedFromAmount > adjustedToAmount ? [fromToken, toToken, adjustedFromAmount, adjustedToAmount] : [toToken, fromToken, adjustedToAmount, adjustedFromAmount];
  ratio = smallestAmount > 0 ? largestAmount * PRECISION / smallestAmount : 0n;
  if (triggerPrice === 0n) {
    allowedSwapSlippageBps = DEFAULT_ALLOWED_SWAP_SLIPPAGE_BPS;
    acceptablePrice = ratio;
  } else {
    const outputAtTriggerPrice = adjustedFromAmount > adjustedToAmount ? adjustedFromAmount * PRECISION / triggerPrice : adjustedFromAmount * triggerPrice / PRECISION;
    allowedSwapSlippageBps = (outputAtTriggerPrice - adjustedMinOutputAmount) * BASIS_POINTS_DIVISOR_BIGINT / outputAtTriggerPrice;
    acceptablePrice = ratio;
    ratio = triggerPrice;
  }
  return {
    ratio,
    largestToken,
    smallestToken,
    allowedSwapSlippageBps,
    acceptablePrice
  };
}
function getAmountByRatio(p) {
  const {
    fromToken,
    toToken,
    fromTokenAmount,
    ratio,
    shouldInvertRatio,
    allowedSwapSlippageBps
  } = p;
  if (getIsEquivalentTokens(fromToken, toToken) || fromTokenAmount === 0n) {
    return p.fromTokenAmount;
  }
  const _ratio = shouldInvertRatio ? PRECISION * PRECISION / ratio : ratio;
  const adjustedDecimalsRatio = adjustForDecimals(
    _ratio,
    fromToken.decimals,
    toToken.decimals
  );
  const amount = p.fromTokenAmount * adjustedDecimalsRatio / PRECISION;
  const swapSlippageAmount = allowedSwapSlippageBps !== void 0 ? bigMath.mulDiv(
    amount,
    allowedSwapSlippageBps,
    BASIS_POINTS_DIVISOR_BIGINT
  ) : 0n;
  return amount - swapSlippageAmount;
}
function getTokensRatioByPrice(p) {
  const { fromToken, toToken, fromPrice, toPrice } = p;
  const [largestToken, smallestToken, largestPrice, smallestPrice] = fromPrice > toPrice ? [fromToken, toToken, fromPrice, toPrice] : [toToken, fromToken, toPrice, fromPrice];
  const ratio = largestPrice * PRECISION / smallestPrice;
  return { ratio, largestToken, smallestToken };
}

export { getAmountByRatio, getSwapCount, getTokensRatioByAmounts, getTokensRatioByMinOutputAmountAndTriggerPrice, getTokensRatioByPrice };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map