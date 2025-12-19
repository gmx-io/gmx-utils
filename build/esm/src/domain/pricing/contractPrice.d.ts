import { ContractMarketPrices, Market } from "../markets/types.js";
import { TokensData, TokenPrices } from "../tokens/types.js";
import { ContractPrice } from "./types.js";
export declare function parseContractPrice(price: bigint, tokenDecimals: number): bigint;
export declare function convertToContractPrice(price: bigint, tokenDecimals: number): ContractPrice;
export declare function convertToContractTokenPrices(prices: TokenPrices, tokenDecimals: number): {
    min: ContractPrice;
    max: ContractPrice;
};
export declare function getContractMarketPrices(tokensData: TokensData, market: Market): ContractMarketPrices | undefined;
