import { MarketInfo, MarketsData, MarketsInfoData } from "../../markets/types.js";
import { TokensData } from "../../tokens/types.js";
export declare function mockMarketKeys(): string[];
export declare function mockMarketsData(marketKeys: string[]): MarketsData;
export declare function mockMarketsInfoData(tokensData: TokensData, marketKeys: string[], overrides?: {
    [marketKey: string]: Partial<MarketInfo>;
}): MarketsInfoData;
