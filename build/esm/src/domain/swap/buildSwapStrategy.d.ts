import { ExternalSwapQuoteParams } from "../externalSwap/types.js";
import { MarketsInfoData } from "../markets/types.js";
import { SwapStrategyForSwapOrders } from "../swap/types.js";
import { SwapOptimizationOrderArray } from "../swap/types.js";
import { TokenData } from "../tokens/types.js";
export declare function buildSwapStrategy({ amountIn, tokenIn, tokenOut, marketsInfoData, chainId, swapOptimizationOrder, externalSwapQuoteParams, }: {
    chainId: number;
    amountIn: bigint;
    tokenIn: TokenData;
    tokenOut: TokenData;
    marketsInfoData: MarketsInfoData | undefined;
    swapOptimizationOrder: SwapOptimizationOrderArray | undefined;
    externalSwapQuoteParams: ExternalSwapQuoteParams;
}): SwapStrategyForSwapOrders;
export declare function buildReverseSwapStrategy({ amountOut, tokenIn, tokenOut, marketsInfoData, chainId, externalSwapQuoteParams, swapOptimizationOrder, }: {
    chainId: number;
    amountOut: bigint;
    tokenIn: TokenData;
    tokenOut: TokenData;
    marketsInfoData: MarketsInfoData | undefined;
    externalSwapQuoteParams: ExternalSwapQuoteParams;
    swapOptimizationOrder: SwapOptimizationOrderArray | undefined;
}): SwapStrategyForSwapOrders;
