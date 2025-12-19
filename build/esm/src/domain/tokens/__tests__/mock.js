import { convertToTokenAmount } from '../../tokens/utils.js';
import { expandDecimals, USD_DECIMALS } from '../../../lib/numbers/index.js';

function usdToToken(usd, token) {
  return convertToTokenAmount(
    expandDecimals(usd, USD_DECIMALS),
    token.decimals,
    token.prices?.minPrice
  );
}
function mockTokensData(overrides = {}) {
  const tokens = {
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
        maxPrice: expandDecimals(12, 30)
      },
      ...overrides.AVAX || {}
    },
    WAVAX: {
      address: "WAVAX",
      name: "Wrapped Avalanche",
      symbol: "WAVAX",
      decimals: 18,
      isNative: true,
      prices: {
        minPrice: expandDecimals(12, 30),
        maxPrice: expandDecimals(12, 30)
      },
      ...overrides.AVAX || {}
    },
    USDC: {
      address: "USDC",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      isStable: true,
      prices: {
        minPrice: expandDecimals(1, 30),
        maxPrice: expandDecimals(1, 30)
      },
      ...overrides.USDC || {}
    },
    ETH: {
      address: "ETH",
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      prices: {
        minPrice: expandDecimals(1200, 30),
        maxPrice: expandDecimals(1200, 30)
      },
      ...overrides.ETH || {}
    },
    BTC: {
      address: "BTC",
      name: "Bitcoin",
      symbol: "BTC",
      decimals: 8,
      prices: {
        minPrice: expandDecimals(2e4, 30),
        maxPrice: expandDecimals(2e4, 30)
      },
      ...overrides.BTC || {}
    },
    DAI: {
      address: "DAI",
      name: "Dai",
      symbol: "DAI",
      decimals: 30,
      isStable: true,
      prices: {
        minPrice: expandDecimals(1, 30),
        maxPrice: expandDecimals(1, 30)
      },
      ...overrides.DAI || {}
    },
    SOL: {
      address: "SOL",
      name: "Solana",
      symbol: "SOL",
      decimals: 18,
      isSynthetic: true,
      prices: {
        minPrice: expandDecimals(16, 30),
        maxPrice: expandDecimals(16, 30)
      },
      ...overrides.SOL || {}
    },
    SPOT: {
      address: "SPOT",
      name: "SPOT",
      decimals: 30,
      symbol: "SPOT",
      prices: {
        minPrice: BigInt(1),
        maxPrice: BigInt(1)
      },
      ...overrides.SPOT || {}
    }
  };
  return tokens;
}
const MOCK_GAS_PRICE = 100000000n;

export { MOCK_GAS_PRICE, mockTokensData, usdToToken };
//# sourceMappingURL=mock.js.map
//# sourceMappingURL=mock.js.map