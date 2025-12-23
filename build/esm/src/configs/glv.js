import mapValues from 'lodash/mapValues';
import { ARBITRUM_SEPOLIA, AVALANCHE_FUJI, AVALANCHE, ARBITRUM } from './chains.js';
import { MARKETS, fixTokenSymbolFromMarketLabel } from './markets.js';
import { SETTLEMENT_CHAINS } from './multichain.js';
import { getTokenBySymbol } from './tokens.js';

const ENOUGH_DAYS_SINCE_LISTING_FOR_APY = 8;
const MARKETS_INDEX = mapValues(
  MARKETS,
  (markets) => mapValues(markets, (market) => Boolean(market.enabled))
);
function isMarketEnabled(chainId, marketAddress) {
  return MARKETS_INDEX[chainId]?.[marketAddress] ?? false;
}
const GLV_MARKETS = {
  [ARBITRUM]: {
    "0x528A5bac7E746C9A509A1f4F6dF58A03d44279F9": {
      name: void 0,
      subtitle: "GMX Liquidity Vault",
      shortening: "GLV",
      glvTokenAddress: "0x528A5bac7E746C9A509A1f4F6dF58A03d44279F9",
      longTokenAddress: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
      shortTokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
    },
    "0xdF03EEd325b82bC1d4Db8b49c30ecc9E05104b96": {
      name: void 0,
      subtitle: "GMX Liquidity Vault",
      shortening: "GLV",
      glvTokenAddress: "0xdF03EEd325b82bC1d4Db8b49c30ecc9E05104b96",
      longTokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      shortTokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
    }
  },
  [AVALANCHE]: {
    "0x901eE57f7118A7be56ac079cbCDa7F22663A3874": {
      name: void 0,
      subtitle: "GMX Liquidity Vault",
      shortening: "GLV",
      glvTokenAddress: "0x901eE57f7118A7be56ac079cbCDa7F22663A3874",
      longTokenAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      shortTokenAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
    }
  },
  [AVALANCHE_FUJI]: {
    "0xc519a5b8e5e93D3ec85D62231C1681c44952689d": {
      name: "High Caps",
      subtitle: "Core ETH Markets Vault",
      shortening: "HC",
      glvTokenAddress: "0xc519a5b8e5e93D3ec85D62231C1681c44952689d",
      longTokenAddress: "0x82F0b3695Ed2324e55bbD9A9554cB4192EC3a514",
      shortTokenAddress: "0x3321Fd36aEaB0d5CdfD26f4A3A93E2D2aAcCB99f"
    }
  },
  [ARBITRUM_SEPOLIA]: {
    "0xAb3567e55c205c62B141967145F37b7695a9F854": {
      name: "High Caps",
      subtitle: "Core ETH Markets Vault",
      shortening: "HC",
      glvTokenAddress: "0xAb3567e55c205c62B141967145F37b7695a9F854",
      longTokenAddress: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
      shortTokenAddress: "0x3253a335E7bFfB4790Aa4C25C4250d206E9b9773"
    }
  }
};
function getGlvByLabel(chainId, label) {
  const glvMarkets = GLV_MARKETS[chainId];
  if (!glvMarkets) {
    throw new Error(`GLV markets not found for chainId ${chainId}`);
  }
  const labelMatch = label.match(/^GLV\s*\[([^\]]+)\]$/i);
  if (!labelMatch) {
    throw new Error(`Invalid GLV label ${label}`);
  }
  const [, tokensPart] = labelMatch;
  const separatorIndex = tokensPart.search(/[-/]/);
  if (separatorIndex === -1) {
    throw new Error(`Invalid GLV label ${label}`);
  }
  const longSymbolRaw = tokensPart.slice(0, separatorIndex).trim();
  const shortSymbolRaw = tokensPart.slice(separatorIndex + 1).trim();
  if (!longSymbolRaw || !shortSymbolRaw) {
    throw new Error(`Invalid GLV label ${label}`);
  }
  const longToken = getTokenBySymbol(
    chainId,
    fixTokenSymbolFromMarketLabel(chainId, longSymbolRaw),
    {
      isSynthetic: false
    }
  );
  const shortToken = getTokenBySymbol(
    chainId,
    fixTokenSymbolFromMarketLabel(chainId, shortSymbolRaw),
    {
      isSynthetic: false
    }
  );
  if (!longToken || !shortToken) {
    throw new Error(`Invalid GLV label ${label}`);
  }
  const glv = Object.values(glvMarkets).find(
    (glv2) => glv2.longTokenAddress === longToken.address && glv2.shortTokenAddress === shortToken.address
  );
  if (!glv) {
    throw new Error(`GLV ${label} not found`);
  }
  return glv;
}
function getIsGlv(chainId, address) {
  return Boolean(
    Object.keys(GLV_MARKETS[chainId]).find(
      (key) => key.toLowerCase() === address.toLowerCase()
    )
  );
}
function getMarketUiConfig(chainId, marketAddress) {
  return MARKETS[chainId]?.[marketAddress];
}
const SETTLEMENT_CHAIN_TRADABLE_ASSETS_MAP = {};
for (const chainId of SETTLEMENT_CHAINS) {
  const tradableTokenAddressesSet = /* @__PURE__ */ new Set();
  for (const marketAddress in MARKETS[chainId]) {
    const marketConfig = MARKETS[chainId][marketAddress];
    tradableTokenAddressesSet.add(marketConfig.longTokenAddress);
    tradableTokenAddressesSet.add(marketConfig.shortTokenAddress);
  }
  SETTLEMENT_CHAIN_TRADABLE_ASSETS_MAP[chainId] = Array.from(
    tradableTokenAddressesSet
  );
}
function getSettlementChainTradableTokenAddresses(chainId) {
  return SETTLEMENT_CHAIN_TRADABLE_ASSETS_MAP[chainId];
}
function isGlvInfo(market) {
  return Boolean(market && "isGlv" in market && market.isGlv);
}
function isGlvEnabled(chainId) {
  return Object.keys(GLV_MARKETS[chainId] ?? {}).length > 0;
}

export { ENOUGH_DAYS_SINCE_LISTING_FOR_APY, GLV_MARKETS, MARKETS_INDEX, getGlvByLabel, getIsGlv, getMarketUiConfig, getSettlementChainTradableTokenAddresses, isGlvEnabled, isGlvInfo, isMarketEnabled };
//# sourceMappingURL=glv.js.map
//# sourceMappingURL=glv.js.map