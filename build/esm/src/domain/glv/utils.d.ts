import type { MarketInfo } from "../markets/types.js";
import type { TokenData, TokensData } from "../tokens/types.js";
import type { GlvInfo, GlvMarket, GlvOrMarketInfo } from "./types.js";
export declare function getMaxUsdCapUsdInGmGlvMarket(market: GlvMarket, gmToken?: TokenData): bigint;
export declare function getMaxUsdBuyableAmountInMarketWithGm(market: GlvMarket, glv: GlvInfo, gmMarketInfo: MarketInfo, gmMarketToken: TokenData, getMintableMarketTokens: (marketInfo: MarketInfo, marketToken: TokenData) => {
    mintableAmount: bigint;
    mintableUsd: bigint;
} | undefined): bigint;
export declare function getMaxUsdBuyableAmountInMarket(market: GlvMarket, glv: GlvInfo, gmToken: TokenData): bigint;
export declare function getMintableInfoGlv(glv: GlvInfo, marketTokensData: TokensData | undefined): {
    mintableAmount: bigint;
    mintableUsd: bigint;
};
export declare function getSellableInfoGlvInMarket(glvInfo: GlvInfo, marketToken: TokenData): {
    sellableUsd: bigint;
    sellableAmount: bigint;
};
export declare function getTotalSellableInfoGlv(glv: GlvInfo, marketsData: Record<string, MarketInfo | GlvInfo> | undefined, tokensData: TokensData | undefined, getSellableMarketToken: (marketInfo: MarketInfo, marketToken: TokenData) => {
    totalUsd: bigint;
    totalAmount: bigint;
} | undefined): {
    totalAmount: bigint;
    totalUsd: bigint;
};
export declare function isGlvInfo(market?: GlvOrMarketInfo): market is GlvInfo;
export declare function getGlvDisplayName(glv: GlvInfo): string;
export declare function getGlvOrMarketAddress(marketOrGlvInfo: MarketInfo | GlvInfo): string;
export declare function getGlvOrMarketAddress(marketOrGlvInfo?: undefined): undefined;
