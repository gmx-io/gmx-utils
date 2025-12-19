import { Token, TokenPrices, TokenData } from "../tokens/types.js";
import { MarketInfo } from "./types.js";
export declare function getMarketFullName(p: {
    longToken: Token;
    shortToken: Token;
    indexToken: Token;
    isSpotOnly: boolean;
}): string;
export declare function getMarketIndexName(p: ({
    indexToken: Token;
} | {
    glvToken: Token;
}) & {
    isSpotOnly: boolean;
}): string;
export declare function getMarketBaseName(p: ({
    indexToken: Token;
} | {
    glvToken: Token;
}) & {
    isSpotOnly: boolean;
}): string;
export declare function getMarketPoolName(p: {
    longToken: Token;
    shortToken: Token;
}, separator?: string): string;
export declare function getTokenPoolType(marketInfo: {
    longToken: Token;
    shortToken: Token;
}, tokenAddress: string): "long" | "short" | undefined;
export declare function getPoolUsdWithoutPnl(marketInfo: MarketInfo, isLong: boolean, priceType: "minPrice" | "maxPrice" | "midPrice"): bigint;
export declare function getCappedPoolPnl(p: {
    marketInfo: MarketInfo;
    poolUsd: bigint;
    poolPnl: bigint;
    isLong: boolean;
}): bigint;
export declare function getMaxLeverageByMinCollateralFactor(minCollateralFactor: bigint | undefined): number;
export declare function getMaxAllowedLeverageByMinCollateralFactor(minCollateralFactor: bigint | undefined): number;
export declare function getOppositeCollateral(marketInfo: MarketInfo, tokenAddress: string): TokenData | undefined;
export declare function getAvailableUsdLiquidityForCollateral(marketInfo: MarketInfo, isLong: boolean): bigint;
export declare function getReservedUsd(marketInfo: MarketInfo, isLong: boolean): bigint;
export declare function getMarketDivisor({ longTokenAddress, shortTokenAddress, }: {
    longTokenAddress: string;
    shortTokenAddress: string;
}): 1n | 2n;
export declare function getMarketPnl(marketInfo: MarketInfo, isLong: boolean, forMaxPoolValue: boolean): bigint;
export declare function getOpenInterestUsd(marketInfo: MarketInfo, isLong: boolean): bigint;
export declare function getOpenInterestInTokens(marketInfo: MarketInfo, isLong: boolean): bigint;
export declare function getOpenInterestForBalance(marketInfo: MarketInfo, isLong: boolean): bigint;
export declare function getPriceForPnl(prices: TokenPrices, isLong: boolean, maximize: boolean): bigint;
export declare function getIsMarketAvailableForExpressSwaps(marketInfo: MarketInfo): boolean;
export declare function usdToMarketTokenAmount(marketInfo: MarketInfo, marketToken: TokenData, usdValue: bigint): bigint;
export declare function marketTokenAmountToUsd(marketInfo: MarketInfo, marketToken: TokenData, amount: bigint): bigint;
