import { DEFAULT_ALLOWED_SWAP_SLIPPAGE_BPS } from "configs/factors";
import { DecreasePositionSwapType } from "domain/decrease/types";
import { DecreasePositionAmounts } from "domain/decrease/types";
import { IncreasePositionAmounts } from "domain/increase/types";
import {
  SwapAmounts,
  TokensRatio,
  TokensRatioAndSlippage,
} from "domain/swap/types";
import { Token } from "domain/tokens/types";
import { getIsEquivalentTokens } from "domain/tokens/utils";
import { bigMath } from "lib/bigmath";
import { BASIS_POINTS_DIVISOR_BIGINT } from "lib/numbers";
import { adjustForDecimals, expandDecimals, PRECISION } from "lib/numbers";

export function getSwapCount({
  isSwap,
  isIncrease,
  increaseAmounts,
  decreaseAmounts,
  swapAmounts,
}: {
  isSwap: boolean;
  isIncrease: boolean;
  swapAmounts?: SwapAmounts;
  increaseAmounts?: IncreasePositionAmounts;
  decreaseAmounts?: DecreasePositionAmounts;
}) {
  if (isSwap) {
    if (!swapAmounts) return undefined;
    return swapAmounts.swapStrategy.swapPathStats?.swapPath.length ?? 0;
  } else if (isIncrease) {
    if (!increaseAmounts) return undefined;
    return increaseAmounts.swapStrategy.swapPathStats?.swapPath.length ?? 0;
  } else {
    if (decreaseAmounts?.decreaseSwapType === undefined) return undefined;
    return decreaseAmounts.decreaseSwapType !== DecreasePositionSwapType.NoSwap
      ? 1
      : 0;
  }
}

export function getTokensRatioByAmounts(p: {
  fromToken: Token;
  toToken: Token;
  fromTokenAmount: bigint;
  toTokenAmount: bigint;
}): TokensRatio {
  const { fromToken, toToken, fromTokenAmount, toTokenAmount } = p;

  const adjustedFromAmount =
    (fromTokenAmount * PRECISION) / expandDecimals(1, fromToken.decimals);
  const adjustedToAmount =
    (toTokenAmount * PRECISION) / expandDecimals(1, toToken.decimals);

  const [smallestToken, largestToken, largestAmount, smallestAmount] =
    adjustedFromAmount > adjustedToAmount
      ? [fromToken, toToken, adjustedFromAmount, adjustedToAmount]
      : [toToken, fromToken, adjustedToAmount, adjustedFromAmount];

  const ratio =
    smallestAmount > 0 ? (largestAmount * PRECISION) / smallestAmount : 0n;

  return { ratio, largestToken, smallestToken };
}

export function getTokensRatioByMinOutputAmountAndTriggerPrice(p: {
  fromToken: Token;
  toToken: Token;
  fromTokenAmount: bigint;
  toTokenAmount: bigint;
  triggerPrice: bigint;
  minOutputAmount: bigint;
}): TokensRatioAndSlippage {
  const {
    fromToken,
    toToken,
    fromTokenAmount,
    toTokenAmount,
    triggerPrice,
    minOutputAmount,
  } = p;

  let allowedSwapSlippageBps = DEFAULT_ALLOWED_SWAP_SLIPPAGE_BPS;
  let smallestToken = fromToken;
  let largestToken = toToken;
  let largestAmount = fromTokenAmount;
  let smallestAmount = toTokenAmount;
  let acceptablePrice = 0n;
  let ratio = 0n;

  const adjustedFromAmount =
    (fromTokenAmount * PRECISION) / expandDecimals(1, fromToken.decimals);
  const adjustedToAmount =
    (minOutputAmount * PRECISION) / expandDecimals(1, toToken.decimals);
  const adjustedMinOutputAmount =
    (minOutputAmount * PRECISION) / expandDecimals(1, toToken.decimals);

  [smallestToken, largestToken, largestAmount, smallestAmount] =
    adjustedFromAmount > adjustedToAmount
      ? [fromToken, toToken, adjustedFromAmount, adjustedToAmount]
      : [toToken, fromToken, adjustedToAmount, adjustedFromAmount];
  ratio =
    smallestAmount > 0 ? (largestAmount * PRECISION) / smallestAmount : 0n;

  if (triggerPrice === 0n) {
    allowedSwapSlippageBps = DEFAULT_ALLOWED_SWAP_SLIPPAGE_BPS;
    acceptablePrice = ratio;
  } else {
    const outputAtTriggerPrice =
      adjustedFromAmount > adjustedToAmount
        ? (adjustedFromAmount * PRECISION) / triggerPrice
        : (adjustedFromAmount * triggerPrice) / PRECISION;

    allowedSwapSlippageBps =
      ((outputAtTriggerPrice - adjustedMinOutputAmount) *
        BASIS_POINTS_DIVISOR_BIGINT) /
      outputAtTriggerPrice;
    acceptablePrice = ratio;
    ratio = triggerPrice;
  }

  return {
    ratio,
    largestToken,
    smallestToken,
    allowedSwapSlippageBps,
    acceptablePrice,
  };
}

export function getAmountByRatio(p: {
  fromToken: Token;
  toToken: Token;
  fromTokenAmount: bigint;
  ratio: bigint;
  shouldInvertRatio?: boolean;
  allowedSwapSlippageBps?: bigint;
}) {
  const {
    fromToken,
    toToken,
    fromTokenAmount,
    ratio,
    shouldInvertRatio,
    allowedSwapSlippageBps,
  } = p;

  if (getIsEquivalentTokens(fromToken, toToken) || fromTokenAmount === 0n) {
    return p.fromTokenAmount;
  }

  const _ratio = shouldInvertRatio ? (PRECISION * PRECISION) / ratio : ratio;

  const adjustedDecimalsRatio = adjustForDecimals(
    _ratio,
    fromToken.decimals,
    toToken.decimals
  );
  const amount = (p.fromTokenAmount * adjustedDecimalsRatio) / PRECISION;

  const swapSlippageAmount =
    allowedSwapSlippageBps !== undefined
      ? bigMath.mulDiv(
          amount,
          allowedSwapSlippageBps,
          BASIS_POINTS_DIVISOR_BIGINT
        )
      : 0n;

  return amount - swapSlippageAmount;
}

export function getTokensRatioByPrice(p: {
  fromToken: Token;
  toToken: Token;
  fromPrice: bigint;
  toPrice: bigint;
}): TokensRatio {
  const { fromToken, toToken, fromPrice, toPrice } = p;

  const [largestToken, smallestToken, largestPrice, smallestPrice] =
    fromPrice > toPrice
      ? [fromToken, toToken, fromPrice, toPrice]
      : [toToken, fromToken, toPrice, fromPrice];

  const ratio = (largestPrice * PRECISION) / smallestPrice;

  return { ratio, largestToken, smallestToken };
}
