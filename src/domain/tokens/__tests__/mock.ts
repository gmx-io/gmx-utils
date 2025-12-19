import { TokenData, TokensData } from "domain/tokens/types";
import { convertToTokenAmount } from "domain/tokens/utils";
import { USD_DECIMALS } from "lib/numbers";
import { expandDecimals } from "lib/numbers";

export function usdToToken(usd: number, token: TokenData) {
  return convertToTokenAmount(
    expandDecimals(usd, USD_DECIMALS),
    token.decimals,
    token.prices?.minPrice
  )!;
}

export function mockTokensData(
  overrides: { [symbol: string]: Partial<TokenData> } = {}
): TokensData {
  const tokens: TokensData = {
    ...overrides,
    AVAX: {
      address: "AVAX",
      wrappedAddress: "WAVAX",
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
      isNative: true,
      prices: {
        minPrice: expandDecimals(12, 30),
        maxPrice: expandDecimals(12, 30),
      },
      ...((overrides.AVAX || {}) as any),
    },
    WAVAX: {
      address: "WAVAX",
      name: "Wrapped Avalanche",
      symbol: "WAVAX",
      decimals: 18,
      isNative: true,
      prices: {
        minPrice: expandDecimals(12, 30),
        maxPrice: expandDecimals(12, 30),
      },
      ...((overrides.AVAX || {}) as any),
    },
    USDC: {
      address: "USDC",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      isStable: true,
      prices: {
        minPrice: expandDecimals(1, 30),
        maxPrice: expandDecimals(1, 30),
      },
      ...((overrides.USDC || {}) as any),
    },
    ETH: {
      address: "ETH",
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      prices: {
        minPrice: expandDecimals(1200, 30),
        maxPrice: expandDecimals(1200, 30),
      },
      ...((overrides.ETH || {}) as any),
    },
    BTC: {
      address: "BTC",
      name: "Bitcoin",
      symbol: "BTC",
      decimals: 8,
      prices: {
        minPrice: expandDecimals(20000, 30),
        maxPrice: expandDecimals(20000, 30),
      },
      ...((overrides.BTC || {}) as any),
    },
    DAI: {
      address: "DAI",
      name: "Dai",
      symbol: "DAI",
      decimals: 30,
      isStable: true,
      prices: {
        minPrice: expandDecimals(1, 30),
        maxPrice: expandDecimals(1, 30),
      },
      ...((overrides.DAI || {}) as any),
    },
    SOL: {
      address: "SOL",
      name: "Solana",
      symbol: "SOL",
      decimals: 18,
      isSynthetic: true,
      prices: {
        minPrice: expandDecimals(16, 30),
        maxPrice: expandDecimals(16, 30),
      },
      ...((overrides.SOL || {}) as any),
    },
    SPOT: {
      address: "SPOT",
      name: "SPOT",
      decimals: 30,
      symbol: "SPOT",
      prices: {
        minPrice: BigInt(1),
        maxPrice: BigInt(1),
      },
      ...((overrides.SPOT || {}) as any),
    },
  };

  return tokens;
}

export const MOCK_GAS_PRICE = 100000000n;
