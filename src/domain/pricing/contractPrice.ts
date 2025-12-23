import { ContractMarketPrices, Market } from "domain/markets/types";
import { TokensData, TokenPrices } from "domain/tokens/types";
import { expandDecimals } from "lib/numbers";
import { getByKey } from "lib/objects";

import { ContractPrice } from "./types";

export function parseContractPrice(price: bigint, tokenDecimals: number) {
  return price * expandDecimals(1, tokenDecimals);
}

export function convertToContractPrice(
  price: bigint,
  tokenDecimals: number
): ContractPrice {
  return (price / expandDecimals(1, tokenDecimals)) as ContractPrice;
}

export function convertToContractTokenPrices(
  prices: TokenPrices,
  tokenDecimals: number
) {
  return {
    min: convertToContractPrice(prices.minPrice, tokenDecimals),
    max: convertToContractPrice(prices.maxPrice, tokenDecimals),
  };
}

export function getContractMarketPrices(
  tokensData: TokensData,
  market: Market
): ContractMarketPrices | undefined {
  const indexToken = getByKey(tokensData, market.indexTokenAddress);
  const longToken = getByKey(tokensData, market.longTokenAddress);
  const shortToken = getByKey(tokensData, market.shortTokenAddress);

  if (!indexToken || !longToken || !shortToken) {
    return undefined;
  }

  return {
    indexTokenPrice:
      indexToken &&
      convertToContractTokenPrices(indexToken.prices, indexToken.decimals),
    longTokenPrice:
      longToken &&
      convertToContractTokenPrices(longToken.prices, longToken.decimals),
    shortTokenPrice:
      shortToken &&
      convertToContractTokenPrices(shortToken.prices, shortToken.decimals),
  };
}
