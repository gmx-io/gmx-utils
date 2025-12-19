import { ExternalSwapQuoteParams } from "domain/externalSwap/types";
import { MarketsInfoData } from "domain/markets/types";
import { SwapStrategyForSwapOrders } from "domain/swap/types";
import { SwapOptimizationOrderArray } from "domain/swap/types";
import { TokenData } from "domain/tokens/types";
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
