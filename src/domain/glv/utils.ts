import values from "lodash/values";

import type { MarketInfo } from "domain/markets/types";
import type { TokenData, TokensData } from "domain/tokens/types";
import { convertToTokenAmount, convertToUsd } from "domain/tokens/utils";
import { bigMath } from "lib/bigmath";

import type { GlvInfo, GlvMarket, GlvOrMarketInfo } from "./types";

export function getMaxUsdCapUsdInGmGlvMarket(
  market: GlvMarket,
  gmToken?: TokenData
) {
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

export function getMaxUsdBuyableAmountInMarketWithGm(
  market: GlvMarket,
  glv: GlvInfo,
  gmMarketInfo: MarketInfo,
  gmMarketToken: TokenData,
  getMintableMarketTokens: (
    marketInfo: MarketInfo,
    marketToken: TokenData
  ) =>
    | {
        mintableAmount: bigint;
        mintableUsd: bigint;
      }
    | undefined
) {
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

export function getMaxUsdBuyableAmountInMarket(
  market: GlvMarket,
  glv: GlvInfo,
  gmToken: TokenData
) {
  const gmBalanceUsd =
    convertToUsd(market.gmBalance, gmToken.decimals, gmToken.prices.maxPrice) ??
    0n;

  return (
    bigMath.min(
      market.maxMarketTokenBalanceUsd,
      convertToUsd(
        market.glvMaxMarketTokenBalanceAmount,
        gmToken.decimals,
        gmToken.prices.maxPrice
      ) ?? 0n
    ) - gmBalanceUsd
  );
}

export function getMintableInfoGlv(
  glv: GlvInfo,
  marketTokensData: TokensData | undefined
) {
  const glvPriceUsd = glv.glvToken.prices.maxPrice;

  const amountUsd = values(glv.markets).reduce((acc, market) => {
    const result =
      acc +
      (marketTokensData
        ? getMaxUsdBuyableAmountInMarket(
            market,
            glv,
            marketTokensData[market.address]
          )
        : 0n);

    return bigMath.max(result, 0n);
  }, 0n);

  return {
    mintableAmount:
      convertToTokenAmount(amountUsd, glv.glvToken.decimals, glvPriceUsd) ?? 0n,
    mintableUsd: amountUsd,
  };
}

export function getSellableInfoGlvInMarket(
  glvInfo: GlvInfo,
  marketToken: TokenData
) {
  const market = glvInfo.markets.find(
    (market) => market.address === marketToken.address
  );

  if (!market) {
    return {
      sellableUsd: 0n,
      sellableAmount: 0n,
    };
  }

  const sellableUsd =
    convertToUsd(
      market.gmBalance,
      marketToken.decimals,
      marketToken.prices.minPrice
    ) ?? 0n;
  const sellableAmount =
    convertToTokenAmount(
      sellableUsd,
      glvInfo.glvToken.decimals,
      glvInfo.glvToken.prices.minPrice
    ) ?? 0n;

  return {
    sellableUsd,
    sellableAmount,
  };
}

export function getTotalSellableInfoGlv(
  glv: GlvInfo,
  marketsData: Record<string, MarketInfo | GlvInfo> | undefined,
  tokensData: TokensData | undefined,
  getSellableMarketToken: (
    marketInfo: MarketInfo,
    marketToken: TokenData
  ) =>
    | {
        totalUsd: bigint;
        totalAmount: bigint;
      }
    | undefined
) {
  const glvPriceUsd = glv.glvToken.prices.minPrice;
  const amountUsd = values(glv.markets).reduce((acc, market) => {
    const marketInfo = marketsData?.[market.address] as MarketInfo | undefined;

    if (!marketInfo || "isGlv" in marketInfo) {
      return acc;
    }

    const marketToken = tokensData?.[marketInfo.marketTokenAddress];

    if (!marketToken) {
      return acc;
    }

    const marketSellableUsd =
      marketInfo && marketInfo.indexToken?.prices
        ? getSellableMarketToken?.(marketInfo, marketToken)?.totalUsd ?? 0n
        : 0n;
    const gmBalanceUsd =
      convertToUsd(
        market.gmBalance,
        marketToken.decimals,
        marketToken.prices.minPrice
      ) ?? 0n;

    return acc + bigMath.min(marketSellableUsd, gmBalanceUsd);
  }, 0n);

  return {
    totalAmount:
      convertToTokenAmount(amountUsd, glv.glvToken.decimals, glvPriceUsd) ?? 0n,
    totalUsd: amountUsd,
  };
}

export function isGlvInfo(market?: GlvOrMarketInfo): market is GlvInfo {
  return Boolean(market && "isGlv" in market && (market as any).isGlv);
}

export function getGlvDisplayName(glv: GlvInfo) {
  return glv.name !== undefined ? `GLV: ${glv.name}` : "GLV";
}

export function getGlvOrMarketAddress(
  marketOrGlvInfo: MarketInfo | GlvInfo
): string;
export function getGlvOrMarketAddress(marketOrGlvInfo?: undefined): undefined;
export function getGlvOrMarketAddress(
  marketOrGlvInfo?: GlvOrMarketInfo
): string | undefined {
  if (!marketOrGlvInfo) {
    return undefined;
  }

  if (isGlvInfo(marketOrGlvInfo)) {
    return marketOrGlvInfo.glvTokenAddress;
  }

  return (marketOrGlvInfo as MarketInfo).marketTokenAddress;
}
