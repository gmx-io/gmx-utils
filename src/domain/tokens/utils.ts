import { NATIVE_TOKEN_ADDRESS } from "configs/tokens";
import { expandDecimals } from "lib/numbers";

import { Token, TokenData, TokenPrices, TokensData } from "./types";

export function convertToTokenAmount(
  usd: bigint | undefined,
  tokenDecimals: number | undefined,
  price: bigint | undefined
) {
  if (
    usd === undefined ||
    typeof tokenDecimals !== "number" ||
    price === undefined ||
    price <= 0
  ) {
    return undefined;
  }

  return (usd * expandDecimals(1, tokenDecimals)) / price;
}

export function convertToUsd(
  tokenAmount: bigint | undefined,
  tokenDecimals: number | undefined,
  price: bigint | undefined
) {
  if (
    tokenAmount == undefined ||
    typeof tokenDecimals !== "number" ||
    price === undefined
  ) {
    return undefined;
  }

  return (tokenAmount * price) / expandDecimals(1, tokenDecimals);
}

export function convertBetweenTokens(
  tokenAmount: bigint | undefined,
  fromToken: TokenData | undefined,
  toToken: TokenData | undefined,
  maximize: boolean
) {
  if (
    tokenAmount === undefined ||
    fromToken === undefined ||
    toToken === undefined
  ) {
    return undefined;
  }

  if (getIsEquivalentTokens(fromToken, toToken)) {
    return tokenAmount;
  }

  const fromPrice = maximize
    ? fromToken.prices.maxPrice
    : fromToken.prices.minPrice;
  const toPrice = maximize ? toToken.prices.minPrice : toToken.prices.maxPrice;

  const usd = convertToUsd(tokenAmount, fromToken.decimals, fromPrice)!;
  const amount = convertToTokenAmount(usd, toToken.decimals, toPrice)!;

  return amount;
}

export function getMidPrice(prices: TokenPrices) {
  return (prices.minPrice + prices.maxPrice) / 2n;
}

export function getIsEquivalentTokens(token1: Token, token2: Token) {
  if (token1.address === token2.address) {
    return true;
  }

  if (
    token1.wrappedAddress === token2.address ||
    token2.wrappedAddress === token1.address
  ) {
    return true;
  }

  if (
    (token1.isSynthetic || token2.isSynthetic) &&
    token1.symbol === token2.symbol
  ) {
    return true;
  }

  return false;
}

export function getTokenData(
  tokensData?: TokensData,
  address?: string,
  convertTo?: "wrapped" | "native"
) {
  if (!address || !tokensData?.[address]) {
    return undefined;
  }

  const token = tokensData[address];

  if (convertTo === "wrapped" && token.isNative && token.wrappedAddress) {
    return tokensData[token.wrappedAddress];
  }

  if (convertTo === "native" && token.isWrapped) {
    return tokensData[NATIVE_TOKEN_ADDRESS];
  }

  return token;
}

export function getIsWrap(token1: Token, token2: Token) {
  return token1.isNative && token2.isWrapped;
}

export function getIsUnwrap(token1: Token, token2: Token) {
  return token1.isWrapped && token2.isNative;
}

export function getIsStake(token1: Token, token2: Token) {
  return (token1.isWrapped || token1.isNative) && token2.isStaking;
}

export function getIsUnstake(token1: Token, token2: Token) {
  return token1.isStaking && token2.isWrapped;
}
