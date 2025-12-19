import { AVALANCHE, ARBITRUM, ARBITRUM_SEPOLIA, SOURCE_BSC_MAINNET, SOURCE_BASE_MAINNET, SOURCE_SEPOLIA, SOURCE_OPTIMISM_SEPOLIA } from './chainIds.js';

// src/configs/multichain.ts
function ensureExhaustive(value) {
  return Object.keys(value).map(Number);
}
var SETTLEMENT_CHAINS = ensureExhaustive({
  [ARBITRUM_SEPOLIA]: true,
  [ARBITRUM]: true,
  [AVALANCHE]: true
});
var SOURCE_CHAINS = ensureExhaustive({
  [SOURCE_OPTIMISM_SEPOLIA]: true,
  [SOURCE_SEPOLIA]: true,
  [SOURCE_BASE_MAINNET]: true,
  [SOURCE_BSC_MAINNET]: true
});
function isSettlementChain(chainId) {
  return SETTLEMENT_CHAINS.includes(chainId);
}
function isSourceChain(chainId) {
  return SOURCE_CHAINS.includes(chainId);
}

export { SETTLEMENT_CHAINS, SOURCE_CHAINS, isSettlementChain, isSourceChain };
//# sourceMappingURL=multichain.js.map
//# sourceMappingURL=multichain.js.map