import 'viem';
import '../bigmath/index.js';
import 'lodash/isPlainObject';

// src/lib/numbers/index.ts
var PRECISION_DECIMALS = 30;
expandDecimals(1, PRECISION_DECIMALS);
BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
function expandDecimals(n, decimals) {
  return BigInt(n) * 10n ** BigInt(decimals);
}
function getByKey(obj, key) {
  if (!obj || !key) return void 0;
  return obj[key];
}

// src/domain/pricing/contractPrice.ts
function parseContractPrice(price, tokenDecimals) {
  return price * expandDecimals(1, tokenDecimals);
}
function convertToContractPrice(price, tokenDecimals) {
  return price / expandDecimals(1, tokenDecimals);
}
function convertToContractTokenPrices(prices, tokenDecimals) {
  return {
    min: convertToContractPrice(prices.minPrice, tokenDecimals),
    max: convertToContractPrice(prices.maxPrice, tokenDecimals)
  };
}
function getContractMarketPrices(tokensData, market) {
  const indexToken = getByKey(tokensData, market.indexTokenAddress);
  const longToken = getByKey(tokensData, market.longTokenAddress);
  const shortToken = getByKey(tokensData, market.shortTokenAddress);
  if (!indexToken || !longToken || !shortToken) {
    return void 0;
  }
  return {
    indexTokenPrice: indexToken && convertToContractTokenPrices(indexToken.prices, indexToken.decimals),
    longTokenPrice: longToken && convertToContractTokenPrices(longToken.prices, longToken.decimals),
    shortTokenPrice: shortToken && convertToContractTokenPrices(shortToken.prices, shortToken.decimals)
  };
}

export { convertToContractPrice, convertToContractTokenPrices, getContractMarketPrices, parseContractPrice };
//# sourceMappingURL=contractPrice.js.map
//# sourceMappingURL=contractPrice.js.map