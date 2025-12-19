import values from 'lodash/values';
import { convertToUsd, convertToTokenAmount } from '../tokens/utils.js';
import { bigMath } from '../../lib/bigmath/index.js';

function getMaxUsdCapUsdInGmGlvMarket(market, gmToken) {
  if (!gmToken) {
    return 0n;
  }
  return bigMath.min(
    market.maxMarketTokenBalanceUsd,
    convertToUsd(
      market.glvMaxMarketTokenBalanceAmount,
      gmToken.decimals,
      gmToken.prices.minPrice
    ) ?? 0n
  );
}
function getMaxUsdBuyableAmountInMarketWithGm(market, glv, gmMarketInfo, gmMarketToken, getMintableMarketTokens) {
  const mintableInGmMarket = getMintableMarketTokens(
    gmMarketInfo,
    gmMarketToken
  );
  const maxUsdInGmGlv = getMaxUsdBuyableAmountInMarket(
    market,
    glv,
    gmMarketToken
  );
  return bigMath.min(mintableInGmMarket?.mintableUsd ?? 0n, maxUsdInGmGlv);
}
function getMaxUsdBuyableAmountInMarket(market, glv, gmToken) {
  const gmBalanceUsd = convertToUsd(market.gmBalance, gmToken.decimals, gmToken.prices.maxPrice) ?? 0n;
  return bigMath.min(
    market.maxMarketTokenBalanceUsd,
    convertToUsd(
      market.glvMaxMarketTokenBalanceAmount,
      gmToken.decimals,
      gmToken.prices.maxPrice
    ) ?? 0n
  ) - gmBalanceUsd;
}
function getMintableInfoGlv(glv, marketTokensData) {
  const glvPriceUsd = glv.glvToken.prices.maxPrice;
  const amountUsd = values(glv.markets).reduce((acc, market) => {
    const result = acc + (marketTokensData ? getMaxUsdBuyableAmountInMarket(
      market,
      glv,
      marketTokensData[market.address]
    ) : 0n);
    return bigMath.max(result, 0n);
  }, 0n);
  return {
    mintableAmount: convertToTokenAmount(amountUsd, glv.glvToken.decimals, glvPriceUsd) ?? 0n,
    mintableUsd: amountUsd
  };
}
function getSellableInfoGlvInMarket(glvInfo, marketToken) {
  const market = glvInfo.markets.find(
    (market2) => market2.address === marketToken.address
  );
  if (!market) {
    return {
      sellableUsd: 0n,
      sellableAmount: 0n
    };
  }
  const sellableUsd = convertToUsd(
    market.gmBalance,
    marketToken.decimals,
    marketToken.prices.minPrice
  ) ?? 0n;
  const sellableAmount = convertToTokenAmount(
    sellableUsd,
    glvInfo.glvToken.decimals,
    glvInfo.glvToken.prices.minPrice
  ) ?? 0n;
  return {
    sellableUsd,
    sellableAmount
  };
}
function getTotalSellableInfoGlv(glv, marketsData, tokensData, getSellableMarketToken) {
  const glvPriceUsd = glv.glvToken.prices.minPrice;
  const amountUsd = values(glv.markets).reduce((acc, market) => {
    const marketInfo = marketsData?.[market.address];
    if (!marketInfo || "isGlv" in marketInfo) {
      return acc;
    }
    const marketToken = tokensData?.[marketInfo.marketTokenAddress];
    if (!marketToken) {
      return acc;
    }
    const marketSellableUsd = marketInfo && marketInfo.indexToken?.prices ? getSellableMarketToken?.(marketInfo, marketToken)?.totalUsd ?? 0n : 0n;
    const gmBalanceUsd = convertToUsd(
      market.gmBalance,
      marketToken.decimals,
      marketToken.prices.minPrice
    ) ?? 0n;
    return acc + bigMath.min(marketSellableUsd, gmBalanceUsd);
  }, 0n);
  return {
    totalAmount: convertToTokenAmount(amountUsd, glv.glvToken.decimals, glvPriceUsd) ?? 0n,
    totalUsd: amountUsd
  };
}
function isGlvInfo(market) {
  return Boolean(market && "isGlv" in market && market.isGlv);
}
function getGlvDisplayName(glv) {
  return glv.name !== void 0 ? `GLV: ${glv.name}` : "GLV";
}
function getGlvOrMarketAddress(marketOrGlvInfo) {
  if (!marketOrGlvInfo) {
    return void 0;
  }
  if (isGlvInfo(marketOrGlvInfo)) {
    return marketOrGlvInfo.glvTokenAddress;
  }
  return marketOrGlvInfo.marketTokenAddress;
}

export { getGlvDisplayName, getGlvOrMarketAddress, getMaxUsdBuyableAmountInMarket, getMaxUsdBuyableAmountInMarketWithGm, getMaxUsdCapUsdInGmGlvMarket, getMintableInfoGlv, getSellableInfoGlvInMarket, getTotalSellableInfoGlv, isGlvInfo };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map