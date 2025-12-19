import { MarketInfo, MarketsData, MarketsInfoData } from "domain/markets/types";
import { TokensData } from "domain/tokens/types";
export declare function mockMarketKeys(): string[];
export declare function mockMarketsData(marketKeys: string[]): MarketsData;
export declare function mockMarketsInfoData(tokensData: TokensData, marketKeys: string[], overrides?: {
    [marketKey: string]: Partial<MarketInfo>;
}): MarketsInfoData;
