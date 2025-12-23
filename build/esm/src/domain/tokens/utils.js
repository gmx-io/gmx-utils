import { NATIVE_TOKEN_ADDRESS } from '../../configs/tokens.js';
import { expandDecimals } from '../../lib/numbers/index.js';

function convertToTokenAmount(usd, tokenDecimals, price) {
  if (usd === void 0 || typeof tokenDecimals !== "number" || price === void 0 || price <= 0) {
    return void 0;
  }
  return usd * expandDecimals(1, tokenDecimals) / price;
}
function convertToUsd(tokenAmount, tokenDecimals, price) {
  if (tokenAmount == void 0 || typeof tokenDecimals !== "number" || price === void 0) {
    return void 0;
  }
  return tokenAmount * price / expandDecimals(1, tokenDecimals);
}
function convertBetweenTokens(tokenAmount, fromToken, toToken, maximize) {
  if (tokenAmount === void 0 || fromToken === void 0 || toToken === void 0) {
    return void 0;
  }
  if (getIsEquivalentTokens(fromToken, toToken)) {
    return tokenAmount;
  }
  const fromPrice = maximize ? fromToken.prices.maxPrice : fromToken.prices.minPrice;
  const toPrice = maximize ? toToken.prices.minPrice : toToken.prices.maxPrice;
  const usd = convertToUsd(tokenAmount, fromToken.decimals, fromPrice);
  const amount = convertToTokenAmount(usd, toToken.decimals, toPrice);
  return amount;
}
function getMidPrice(prices) {
  return (prices.minPrice + prices.maxPrice) / 2n;
}
function getIsEquivalentTokens(token1, token2) {
  if (token1.address === token2.address) {
    return true;
  }
  if (token1.wrappedAddress === token2.address || token2.wrappedAddress === token1.address) {
    return true;
  }
  if ((token1.isSynthetic || token2.isSynthetic) && token1.symbol === token2.symbol) {
    return true;
  }
  return false;
}
function getTokenData(tokensData, address, convertTo) {
  if (!address || !tokensData?.[address]) {
    return void 0;
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
function getIsWrap(token1, token2) {
  return token1.isNative && token2.isWrapped;
}
function getIsUnwrap(token1, token2) {
  return token1.isWrapped && token2.isNative;
}
function getIsStake(token1, token2) {
  return (token1.isWrapped || token1.isNative) && token2.isStaking;
}
function getIsUnstake(token1, token2) {
  return token1.isStaking && token2.isWrapped;
}

export { convertBetweenTokens, convertToTokenAmount, convertToUsd, getIsEquivalentTokens, getIsStake, getIsUnstake, getIsUnwrap, getIsWrap, getMidPrice, getTokenData };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map