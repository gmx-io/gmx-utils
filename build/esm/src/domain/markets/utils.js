import { getTokenVisualMultiplier, NATIVE_TOKEN_ADDRESS } from '../../configs/tokens.js';
import { getMidPrice, convertToUsd, convertToTokenAmount } from '../tokens/utils.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { applyFactor, BASIS_POINTS_DIVISOR, expandDecimals, USD_DECIMALS, PRECISION } from '../../lib/numbers/index.js';

function getMarketFullName(p) {
  const { indexToken, longToken, shortToken, isSpotOnly } = p;
  return `${getMarketIndexName({
    indexToken,
    isSpotOnly
  })} [${getMarketPoolName({ longToken, shortToken })}]`;
}
function getMarketIndexName(p) {
  if (p.isSpotOnly) {
    return `SWAP-ONLY`;
  }
  return `${getMarketBaseName(p)}/USD`;
}
function getMarketBaseName(p) {
  const { isSpotOnly } = p;
  const firstToken = "indexToken" in p ? p.indexToken : p.glvToken;
  if (isSpotOnly) {
    return `SWAP-ONLY`;
  }
  const prefix = getTokenVisualMultiplier(firstToken);
  return `${prefix}${firstToken.baseSymbol || firstToken.symbol}`;
}
function getMarketPoolName(p, separator = "-") {
  const { longToken, shortToken } = p;
  return `${longToken.symbol}${separator}${shortToken.symbol}`;
}
function getTokenPoolType(marketInfo, tokenAddress) {
  const { longToken, shortToken } = marketInfo;
  if (longToken.address === shortToken.address && tokenAddress === longToken.address) {
    return "long";
  }
  if (tokenAddress === longToken.address || tokenAddress === NATIVE_TOKEN_ADDRESS && longToken.isWrapped) {
    return "long";
  }
  if (tokenAddress === shortToken.address || tokenAddress === NATIVE_TOKEN_ADDRESS && shortToken.isWrapped) {
    return "short";
  }
  return void 0;
}
function getPoolUsdWithoutPnl(marketInfo, isLong, priceType) {
  const poolAmount = isLong ? marketInfo.longPoolAmount : marketInfo.shortPoolAmount;
  const token = isLong ? marketInfo.longToken : marketInfo.shortToken;
  let price;
  if (priceType === "minPrice") {
    price = token.prices?.minPrice;
  } else if (priceType === "maxPrice") {
    price = token.prices?.maxPrice;
  } else {
    price = getMidPrice(token.prices);
  }
  return convertToUsd(poolAmount, token.decimals, price);
}
function getCappedPoolPnl(p) {
  const { marketInfo, poolUsd, poolPnl, isLong } = p;
  if (poolPnl < 0) {
    return poolPnl;
  }
  const maxPnlFactor = isLong ? marketInfo.maxPnlFactorForTradersLong : marketInfo.maxPnlFactorForTradersShort;
  const maxPnl = applyFactor(poolUsd, maxPnlFactor);
  return poolPnl > maxPnl ? maxPnl : poolPnl;
}
function getMaxLeverageByMinCollateralFactor(minCollateralFactor) {
  if (minCollateralFactor === void 0) return 100 * BASIS_POINTS_DIVISOR;
  if (minCollateralFactor === 0n) return 100 * BASIS_POINTS_DIVISOR;
  const x = Number(PRECISION / minCollateralFactor);
  const rounded = Math.round(x / 10) * 10;
  return rounded * BASIS_POINTS_DIVISOR;
}
function getMaxAllowedLeverageByMinCollateralFactor(minCollateralFactor) {
  return getMaxLeverageByMinCollateralFactor(minCollateralFactor) / 2;
}
function getOppositeCollateral(marketInfo, tokenAddress) {
  const poolType = getTokenPoolType(marketInfo, tokenAddress);
  if (poolType === "long") {
    return marketInfo.shortToken;
  }
  if (poolType === "short") {
    return marketInfo.longToken;
  }
  return void 0;
}
function getAvailableUsdLiquidityForCollateral(marketInfo, isLong) {
  const poolUsd = getPoolUsdWithoutPnl(marketInfo, isLong, "minPrice");
  if (marketInfo.isSpotOnly) {
    return poolUsd;
  }
  const reservedUsd = getReservedUsd(marketInfo, isLong);
  const maxReserveFactor = isLong ? marketInfo.reserveFactorLong : marketInfo.reserveFactorShort;
  if (maxReserveFactor === 0n) {
    return 0n;
  }
  const minPoolUsd = reservedUsd * PRECISION / maxReserveFactor;
  const liquidity = poolUsd - minPoolUsd;
  return liquidity;
}
function getReservedUsd(marketInfo, isLong) {
  const { indexToken } = marketInfo;
  if (isLong) {
    return convertToUsd(
      marketInfo.longInterestInTokens,
      marketInfo.indexToken.decimals,
      indexToken.prices.maxPrice
    );
  } else {
    return marketInfo.shortInterestUsd;
  }
}
function getMarketDivisor({
  longTokenAddress,
  shortTokenAddress
}) {
  return longTokenAddress === shortTokenAddress ? 2n : 1n;
}
function getMarketPnl(marketInfo, isLong, forMaxPoolValue) {
  const maximize = !forMaxPoolValue;
  const openInterestUsd = getOpenInterestUsd(marketInfo, isLong);
  const openInterestInTokens = getOpenInterestInTokens(marketInfo, isLong);
  if (openInterestUsd === 0n || openInterestInTokens === 0n) {
    return 0n;
  }
  const price = getPriceForPnl(marketInfo.indexToken.prices, isLong, maximize);
  const openInterestValue = convertToUsd(
    openInterestInTokens,
    marketInfo.indexToken.decimals,
    price
  );
  const pnl = isLong ? openInterestValue - openInterestUsd : openInterestUsd - openInterestValue;
  return pnl;
}
function getOpenInterestUsd(marketInfo, isLong) {
  return isLong ? marketInfo.longInterestUsd : marketInfo.shortInterestUsd;
}
function getOpenInterestInTokens(marketInfo, isLong) {
  return isLong ? marketInfo.longInterestInTokens : marketInfo.shortInterestInTokens;
}
function getOpenInterestForBalance(marketInfo, isLong) {
  if (marketInfo.useOpenInterestInTokensForBalance) {
    const interestInTokens = isLong ? marketInfo.longInterestInTokens : marketInfo.shortInterestInTokens;
    const indexTokenPrice = getMidPrice(marketInfo.indexToken.prices);
    return convertToUsd(
      interestInTokens,
      marketInfo.indexToken.decimals,
      indexTokenPrice
    );
  }
  return isLong ? marketInfo.longInterestUsd : marketInfo.shortInterestUsd;
}
function getPriceForPnl(prices, isLong, maximize) {
  if (isLong) {
    return maximize ? prices.maxPrice : prices.minPrice;
  }
  return maximize ? prices.minPrice : prices.maxPrice;
}
function getIsMarketAvailableForExpressSwaps(marketInfo) {
  return [
    marketInfo.indexToken,
    marketInfo.longToken,
    marketInfo.shortToken
  ].every((token) => token.hasPriceFeedProvider);
}
function usdToMarketTokenAmount(marketInfo, marketToken, usdValue) {
  const supply = marketToken.totalSupply;
  const poolValue = marketInfo.poolValueMax;
  if (supply == 0n && poolValue == 0n) {
    return convertToTokenAmount(
      usdValue,
      marketToken.decimals,
      expandDecimals(1, USD_DECIMALS)
    );
  }
  if (supply == 0n && poolValue > 0) {
    return convertToTokenAmount(
      usdValue + poolValue,
      marketToken.decimals,
      expandDecimals(1, USD_DECIMALS)
    );
  }
  if (poolValue == 0n) {
    return 0n;
  }
  return bigMath.mulDiv(supply, usdValue, poolValue);
}
function marketTokenAmountToUsd(marketInfo, marketToken, amount) {
  const supply = marketToken.totalSupply;
  const poolValue = marketInfo.poolValueMax;
  const price = supply == 0n ? expandDecimals(1, USD_DECIMALS) : bigMath.mulDiv(
    poolValue,
    expandDecimals(1, marketToken.decimals),
    supply
  );
  return amount * price / expandDecimals(1, marketToken.decimals);
}

export { getAvailableUsdLiquidityForCollateral, getCappedPoolPnl, getIsMarketAvailableForExpressSwaps, getMarketBaseName, getMarketDivisor, getMarketFullName, getMarketIndexName, getMarketPnl, getMarketPoolName, getMaxAllowedLeverageByMinCollateralFactor, getMaxLeverageByMinCollateralFactor, getOpenInterestForBalance, getOpenInterestInTokens, getOpenInterestUsd, getOppositeCollateral, getPoolUsdWithoutPnl, getPriceForPnl, getReservedUsd, getTokenPoolType, marketTokenAmountToUsd, usdToMarketTokenAmount };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map