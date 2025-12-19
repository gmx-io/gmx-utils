import { DecreasePositionAmounts } from "../decrease/types.js";
import { IncreasePositionAmounts } from "../increase/types.js";
import { SwapAmounts, TokensRatio, TokensRatioAndSlippage } from "../swap/types.js";
import { Token } from "../tokens/types.js";
export declare function getSwapCount({ isSwap, isIncrease, increaseAmounts, decreaseAmounts, swapAmounts, }: {
    isSwap: boolean;
    isIncrease: boolean;
    swapAmounts?: SwapAmounts;
    increaseAmounts?: IncreasePositionAmounts;
    decreaseAmounts?: DecreasePositionAmounts;
}): number | undefined;
export declare function getTokensRatioByAmounts(p: {
    fromToken: Token;
    toToken: Token;
    fromTokenAmount: bigint;
    toTokenAmount: bigint;
}): TokensRatio;
export declare function getTokensRatioByMinOutputAmountAndTriggerPrice(p: {
    fromToken: Token;
    toToken: Token;
    fromTokenAmount: bigint;
    toTokenAmount: bigint;
    triggerPrice: bigint;
    minOutputAmount: bigint;
}): TokensRatioAndSlippage;
export declare function getAmountByRatio(p: {
    fromToken: Token;
    toToken: Token;
    fromTokenAmount: bigint;
    ratio: bigint;
    shouldInvertRatio?: boolean;
    allowedSwapSlippageBps?: bigint;
}): bigint;
export declare function getTokensRatioByPrice(p: {
    fromToken: Token;
    toToken: Token;
    fromPrice: bigint;
    toPrice: bigint;
}): TokensRatio;
