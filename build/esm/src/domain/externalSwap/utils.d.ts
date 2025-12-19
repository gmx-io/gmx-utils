import { MarketInfo, MarketsInfoData } from "domain/markets/types";
import { PositionInfo } from "domain/positions/types";
import { UserReferralInfo } from "domain/referrals/types";
import { SwapAmounts, FindSwapPath } from "domain/swap/types";
import { TokenData } from "domain/tokens/types";
import { ExternalSwapInputs, ExternalSwapQuote } from "./types";
export declare function getExternalSwapInputsByFromValue({ tokenIn, tokenOut, amountIn, findSwapPath, uiFeeFactor, marketsInfoData, chainId, }: {
    tokenIn: TokenData;
    tokenOut: TokenData;
    amountIn: bigint;
    findSwapPath: FindSwapPath;
    uiFeeFactor: bigint;
    marketsInfoData: MarketsInfoData | undefined;
    chainId: number;
}): ExternalSwapInputs;
export declare function getExternalSwapInputsByLeverageSize({ marketInfo, tokenIn, collateralToken, indexTokenAmount, findSwapPath, uiFeeFactor, triggerPrice, existingPosition, leverage, isLong, userReferralInfo, marketsInfoData, chainId, }: {
    tokenIn: TokenData;
    collateralToken: TokenData;
    marketInfo: MarketInfo;
    indexTokenAmount: bigint;
    uiFeeFactor: bigint;
    triggerPrice?: bigint;
    existingPosition?: PositionInfo;
    leverage: bigint;
    isLong: boolean;
    findSwapPath: FindSwapPath;
    userReferralInfo: UserReferralInfo | undefined;
    marketsInfoData: MarketsInfoData | undefined;
    chainId: number;
}): ExternalSwapInputs;
export declare function getBestSwapStrategy({ internalSwapAmounts, externalSwapQuote, forceExternalSwaps, }: {
    internalSwapAmounts: SwapAmounts | undefined;
    externalSwapQuote: ExternalSwapQuote | undefined;
    forceExternalSwaps?: boolean;
}): {
    amountIn: bigint;
    amountOut: bigint;
    usdIn: bigint;
    usdOut: bigint;
    externalSwapQuote: ExternalSwapQuote;
    swapPath?: undefined;
} | {
    amountIn: bigint;
    amountOut: bigint;
    usdIn: bigint;
    usdOut: bigint;
    swapPath: string[];
    externalSwapQuote?: undefined;
} | undefined;
export declare function getIsInternalSwapBetter({ internalSwapAmounts, externalSwapQuote, forceExternalSwaps, }: {
    internalSwapAmounts: SwapAmounts | undefined;
    externalSwapQuote: ExternalSwapQuote | undefined;
    forceExternalSwaps?: boolean;
}): boolean;
