import { TokenData, TokensData } from "domain/tokens/types";
export declare function usdToToken(usd: number, token: TokenData): bigint;
export declare function mockTokensData(overrides?: {
    [symbol: string]: Partial<TokenData>;
}): TokensData;
export declare const MOCK_GAS_PRICE = 100000000n;
