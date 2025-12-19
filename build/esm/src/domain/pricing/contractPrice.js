import { expandDecimals } from '../../lib/numbers/index.js';
import { getByKey } from '../../lib/objects/index.js';

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