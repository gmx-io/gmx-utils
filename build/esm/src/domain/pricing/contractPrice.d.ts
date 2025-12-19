import { ContractMarketPrices, Market } from "domain/markets/types";
import { TokensData, TokenPrices } from "domain/tokens/types";
import { ContractPrice } from "./types";
export declare function parseContractPrice(price: bigint, tokenDecimals: number): bigint;
export declare function convertToContractPrice(price: bigint, tokenDecimals: number): ContractPrice;
export declare function convertToContractTokenPrices(prices: TokenPrices, tokenDecimals: number): {
    min: ContractPrice;
    max: ContractPrice;
};
export declare function getContractMarketPrices(tokensData: TokensData, market: Market): ContractMarketPrices | undefined;
