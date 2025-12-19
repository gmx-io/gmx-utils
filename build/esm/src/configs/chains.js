import { defineChain } from 'viem';
import { bsc, base, sepolia, optimismSepolia, arbitrumSepolia, avalanche, arbitrum, avalancheFuji } from 'viem/chains';
import { BOTANIX, ARBITRUM, AVALANCHE, AVALANCHE_FUJI, ARBITRUM_SEPOLIA, SOURCE_OPTIMISM_SEPOLIA, SOURCE_SEPOLIA, SOURCE_BASE_MAINNET, SOURCE_BSC_MAINNET } from './chainIds.js';
export { ARBITRUM, ARBITRUM_SEPOLIA, AVALANCHE, AVALANCHE_FUJI, BOTANIX, ETH_MAINNET, SOURCE_BASE_MAINNET, SOURCE_BSC_MAINNET, SOURCE_OPTIMISM_SEPOLIA, SOURCE_SEPOLIA } from './chainIds.js';

// src/configs/chains.ts
var CONTRACTS_CHAIN_IDS = [ARBITRUM, AVALANCHE, BOTANIX];
var CONTRACTS_CHAIN_IDS_DEV = [
  ...CONTRACTS_CHAIN_IDS,
  AVALANCHE_FUJI,
  ARBITRUM_SEPOLIA
];
var SETTLEMENT_CHAIN_IDS = [ARBITRUM, AVALANCHE];
var SETTLEMENT_CHAIN_IDS_DEV = [
  ...SETTLEMENT_CHAIN_IDS,
  ARBITRUM_SEPOLIA
];
var SOURCE_CHAIN_IDS = [
  SOURCE_OPTIMISM_SEPOLIA,
  SOURCE_SEPOLIA,
  SOURCE_BASE_MAINNET,
  SOURCE_BSC_MAINNET
];
var CONTRACTS_CHAIN_CONFIGS = {
  [ARBITRUM]: {
    chainId: ARBITRUM,
    name: "Arbitrum",
    slug: "arbitrum",
    explorerUrl: "https://arbiscan.io/",
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC.e",
    highExecutionFee: 5,
    shouldUseMaxPriorityFeePerGas: false,
    defaultExecutionFeeBufferBps: 3e3,
    // 30%
    maxFeePerGas: void 0,
    gasPricePremium: 0n,
    maxPriorityFeePerGas: 1500000000n,
    // 1.5 gwei
    excessiveExecutionFee: 10,
    // 10 USD
    minExecutionFee: void 0,
    gasPriceBuffer: 2000n,
    // 20%
    isDisabled: false
  },
  [AVALANCHE]: {
    chainId: AVALANCHE,
    name: "Avalanche",
    slug: "avalanche",
    explorerUrl: "https://snowtrace.io/",
    nativeTokenSymbol: "AVAX",
    wrappedTokenSymbol: "WAVAX",
    defaultCollateralSymbol: "USDC",
    highExecutionFee: 5,
    shouldUseMaxPriorityFeePerGas: true,
    defaultExecutionFeeBufferBps: 1e3,
    // 10%
    maxFeePerGas: 200000000000n,
    // 200 gwei
    gasPricePremium: 6000000000n,
    // 6 gwei
    maxPriorityFeePerGas: 1500000000n,
    // 1.5 gwei
    excessiveExecutionFee: 10,
    // 10 USD
    minExecutionFee: void 0,
    gasPriceBuffer: void 0,
    isDisabled: false
  },
  [AVALANCHE_FUJI]: {
    chainId: AVALANCHE_FUJI,
    name: "Avalanche Fuji",
    slug: "fuji",
    explorerUrl: "https://testnet.snowtrace.io/",
    nativeTokenSymbol: "AVAX",
    wrappedTokenSymbol: "WAVAX",
    defaultCollateralSymbol: "USDC",
    highExecutionFee: 5,
    shouldUseMaxPriorityFeePerGas: true,
    defaultExecutionFeeBufferBps: 1e3,
    // 10%
    maxFeePerGas: void 0,
    gasPricePremium: void 0,
    maxPriorityFeePerGas: 1500000000n,
    excessiveExecutionFee: 10,
    // 10 USD
    minExecutionFee: void 0,
    gasPriceBuffer: void 0,
    isDisabled: false
  },
  [ARBITRUM_SEPOLIA]: {
    chainId: ARBITRUM_SEPOLIA,
    name: "Arbitrum Sepolia",
    slug: "arbitrum-sepolia",
    explorerUrl: "https://sepolia.arbiscan.io/",
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC",
    highExecutionFee: 5,
    shouldUseMaxPriorityFeePerGas: false,
    defaultExecutionFeeBufferBps: 1e3,
    // 10%
    maxFeePerGas: void 0,
    gasPricePremium: void 0,
    maxPriorityFeePerGas: 1500000000n,
    excessiveExecutionFee: 10,
    // 10 USD
    minExecutionFee: void 0,
    gasPriceBuffer: void 0,
    isDisabled: false
  },
  [BOTANIX]: {
    chainId: BOTANIX,
    name: "Botanix",
    slug: "botanix",
    explorerUrl: "https://botanixscan.io/",
    nativeTokenSymbol: "BTC",
    wrappedTokenSymbol: "PBTC",
    defaultCollateralSymbol: "USDC.E",
    highExecutionFee: 5,
    shouldUseMaxPriorityFeePerGas: true,
    defaultExecutionFeeBufferBps: 3e3,
    // 30%
    maxFeePerGas: 20n,
    gasPricePremium: void 0,
    maxPriorityFeePerGas: 7n,
    excessiveExecutionFee: 10,
    // 10 USD
    /**
     * avoid botanix gas spikes when chain is not actively used
     * if set, execution fee value should not be less than this in USD equivalent
     */
    minExecutionFee: 1000000000000000000000000000n,
    // 1e27 $0.001
    gasPriceBuffer: void 0,
    isDisabled: false
  }
  // Use this notation to correctly infer chain names, etc. from config
};
var SOURCE_CHAIN_CONFIGS = {
  [SOURCE_OPTIMISM_SEPOLIA]: {
    chainId: SOURCE_OPTIMISM_SEPOLIA,
    name: "Optimism Sepolia",
    slug: "optimism-sepolia",
    explorerUrl: "https://sepolia-optimism.etherscan.io/"
  },
  [SOURCE_SEPOLIA]: {
    chainId: SOURCE_SEPOLIA,
    name: "Sepolia",
    slug: "sepolia",
    explorerUrl: "https://sepolia.etherscan.io/"
  },
  [SOURCE_BASE_MAINNET]: {
    chainId: SOURCE_BASE_MAINNET,
    name: "Base",
    slug: "base-mainnet",
    explorerUrl: "https://basescan.org/"
  },
  [SOURCE_BSC_MAINNET]: {
    chainId: SOURCE_BSC_MAINNET,
    name: "BNB",
    slug: "bnb-mainnet",
    explorerUrl: "https://bscscan.com/"
  }
  // Use this notation to correctly infer chain names, etc. from config
};
var ALL_CHAIN_CONFIGS = {
  ...CONTRACTS_CHAIN_CONFIGS,
  ...SOURCE_CHAIN_CONFIGS
};
var botanix = defineChain({
  id: BOTANIX,
  name: "Botanix",
  nativeCurrency: {
    name: "Bitcoin",
    symbol: "BTC",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [
        // this rpc returns incorrect gas price
        // "https://rpc.botanixlabs.com",
        "https://rpc.ankr.com/botanix_mainnet"
      ]
    }
  },
  blockExplorers: {
    default: {
      name: "BotanixScan",
      url: "https://botanixscan.io"
    }
  },
  contracts: {
    multicall3: {
      address: "0x4BaA24f93a657f0c1b4A0Ffc72B91011E35cA46b"
    }
  }
});
var VIEM_CHAIN_BY_CHAIN_ID = {
  [AVALANCHE_FUJI]: avalancheFuji,
  [ARBITRUM]: arbitrum,
  [AVALANCHE]: avalanche,
  [ARBITRUM_SEPOLIA]: arbitrumSepolia,
  [BOTANIX]: botanix,
  [SOURCE_OPTIMISM_SEPOLIA]: optimismSepolia,
  [SOURCE_SEPOLIA]: sepolia,
  [SOURCE_BASE_MAINNET]: base,
  [SOURCE_BSC_MAINNET]: bsc
};
function getChainName(chainId) {
  return ALL_CHAIN_CONFIGS[chainId]?.name ?? "Unknown";
}
function getChainSlug(chainId) {
  return ALL_CHAIN_CONFIGS[chainId]?.slug ?? "unknown";
}
function getChainIdBySlug(slug) {
  const chainId = Object.values(ALL_CHAIN_CONFIGS).find(
    (config) => config.slug === slug
  )?.chainId;
  return chainId;
}
var getViemChain = (chainId) => {
  return VIEM_CHAIN_BY_CHAIN_ID[chainId];
};
function getHighExecutionFee(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId]?.highExecutionFee ?? 5;
}
function getExcessiveExecutionFee(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId]?.excessiveExecutionFee ?? 10;
}
function isContractsChain(chainId, dev = false) {
  return (dev ? CONTRACTS_CHAIN_IDS_DEV : CONTRACTS_CHAIN_IDS).includes(
    chainId
  );
}
function isTestnetChain(chainId) {
  return [AVALANCHE_FUJI, ARBITRUM_SEPOLIA].includes(chainId);
}
function getMaxFeePerGas(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId].maxFeePerGas;
}
function getGasPricePremium(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId].gasPricePremium;
}
function getMaxPriorityFeePerGas(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId].maxPriorityFeePerGas;
}
function getMinExecutionFeeUsd(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId].minExecutionFee;
}
function getGasPriceBuffer(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId].gasPriceBuffer;
}
function isChainDisabled(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId]?.isDisabled ?? false;
}
function getChainNativeTokenSymbol(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId].nativeTokenSymbol;
}
function getChainWrappedTokenSymbol(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId].wrappedTokenSymbol;
}
function getChainDefaultCollateralSymbol(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId].defaultCollateralSymbol;
}
function getExplorerUrl(chainId) {
  switch (chainId) {
    case "layerzero":
      return "https://layerzeroscan.com/";
    case "layerzero-testnet":
      return "https://testnet.layerzeroscan.com/";
    default:
      return ALL_CHAIN_CONFIGS[chainId]?.explorerUrl ?? "";
  }
}
function getTokenExplorerUrl(chainId, tokenAddress) {
  return `${getExplorerUrl(chainId)}token/${tokenAddress}`;
}
function getExecutionFeeConfig(chainId) {
  const config = CONTRACTS_CHAIN_CONFIGS[chainId];
  if (!config) {
    return void 0;
  }
  return {
    shouldUseMaxPriorityFeePerGas: config.shouldUseMaxPriorityFeePerGas,
    defaultBufferBps: config.defaultExecutionFeeBufferBps
  };
}

export { CONTRACTS_CHAIN_IDS, CONTRACTS_CHAIN_IDS_DEV, SETTLEMENT_CHAIN_IDS, SETTLEMENT_CHAIN_IDS_DEV, SOURCE_CHAIN_IDS, botanix, getChainDefaultCollateralSymbol, getChainIdBySlug, getChainName, getChainNativeTokenSymbol, getChainSlug, getChainWrappedTokenSymbol, getExcessiveExecutionFee, getExecutionFeeConfig, getExplorerUrl, getGasPriceBuffer, getGasPricePremium, getHighExecutionFee, getMaxFeePerGas, getMaxPriorityFeePerGas, getMinExecutionFeeUsd, getTokenExplorerUrl, getViemChain, isChainDisabled, isContractsChain, isTestnetChain };
//# sourceMappingURL=chains.js.map
//# sourceMappingURL=chains.js.map