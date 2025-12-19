import { defineChain, withRetry } from 'viem';
import 'viem/chains';
import { BOTANIX, ARBITRUM_SEPOLIA, AVALANCHE_FUJI, AVALANCHE, ARBITRUM } from './chainIds.js';
import * as parseError_star from './parseError.js';
import * as transactionsErrors_star from './transactionsErrors.js';
import * as emitMetricEvent_star from './emitMetricEvent.js';
import * as Metrics_star from './Metrics.js';
import * as types_star from './types.js';
import * as utils_star from './utils.js';
import '../bigmath/index.js';

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget);
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
defineChain({
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
function getMaxFeePerGas(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId].maxFeePerGas;
}
function getGasPricePremium(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId].gasPricePremium;
}
function getMaxPriorityFeePerGas(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId].maxPriorityFeePerGas;
}
function getGasPriceBuffer(chainId) {
  return CONTRACTS_CHAIN_CONFIGS[chainId].gasPriceBuffer;
}

// src/lib/bigmath/index.ts
var bigMath = {
  abs(x) {
    return x < 0n ? -x : x;
  },
  mulDiv(x, y, z, roundUpMagnitude = false) {
    const result = x * y / z;
    if (roundUpMagnitude && this.mulmod(x, y, z) > 0n) {
      return result + 1n;
    }
    return result;
  },
  max(max, ...rest) {
    return rest.reduce((currentMax, val) => currentMax < val ? val : currentMax, max);
  },
  min(min, ...rest) {
    return rest.reduce((currentMin, val) => currentMin > val ? val : currentMin, min);
  },
  avg(...values) {
    let sum = 0n;
    let count = 0n;
    for (const value of values) {
      if (value !== void 0) {
        sum += value;
        count += 1n;
      }
    }
    if (count === 0n) {
      return void 0;
    }
    return sum / count;
  },
  divRound(x, y) {
    return x / y + (x % y * 2n > y ? 1n : 0n);
  },
  divRoundUp(x, y) {
    return (x + y - 1n) / y;
  },
  mulmod(x, y, m) {
    return x * y % m;
  },
  clamp(value, min, max) {
    return bigMath.max(min, bigMath.min(value, max));
  }
};

// src/lib/errors/index.ts
var errors_exports = {};
__reExport(errors_exports, parseError_star);
__reExport(errors_exports, transactionsErrors_star);

// src/lib/metrics/index.ts
var metrics_exports = {};
__reExport(metrics_exports, emitMetricEvent_star);
__reExport(metrics_exports, Metrics_star);
__reExport(metrics_exports, types_star);
__reExport(metrics_exports, utils_star);
var BASIS_POINTS_DIVISOR_BIGINT = 10000n;
var PRECISION_DECIMALS = 30;
expandDecimals(1, PRECISION_DECIMALS);
BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
function expandDecimals(n, decimals) {
  return BigInt(n) * 10n ** BigInt(decimals);
}

// src/lib/gas/gasPrice.ts
async function getGasPrice(chainId, rpc) {
  try {
    let maxFeePerGas = getMaxFeePerGas(chainId);
    const premium = getGasPricePremium(chainId) || 0n;
    const feeData = await withRetry(
      () => rpc.estimateFeesPerGas({
        chainId
      }),
      {
        delay: 200,
        retryCount: 2,
        shouldRetry: ({ error }) => {
          const isInvalidBlockError = error?.message?.includes(
            "invalid value for value.hash"
          );
          if (isInvalidBlockError) {
            (0, metrics_exports.emitMetricCounter)({ event: "error.getFeeData.value.hash" });
          }
          return isInvalidBlockError;
        }
      }
    );
    const gasPrice = feeData.gasPrice;
    if (maxFeePerGas !== void 0) {
      if (gasPrice !== void 0 && gasPrice !== null) {
        maxFeePerGas = bigMath.max(gasPrice, maxFeePerGas);
      }
      const block = await rpc.getBlock({ blockTag: "pending" });
      if (block.baseFeePerGas !== void 0 && block.baseFeePerGas !== null) {
        const baseFeePerGas = block.baseFeePerGas;
        const maxPriorityFeePerGas = bigMath.max(
          feeData.maxPriorityFeePerGas ?? 0n,
          getMaxPriorityFeePerGas(chainId) || 0n
        );
        const calculatedMaxFeePerGas = baseFeePerGas + maxPriorityFeePerGas + premium;
        return {
          maxFeePerGas: bigMath.max(maxFeePerGas, calculatedMaxFeePerGas),
          maxPriorityFeePerGas: maxPriorityFeePerGas + premium
        };
      }
    }
    if (gasPrice === null || gasPrice === void 0) {
      throw new Error("Can't fetch gas price");
    }
    const bufferBps = getGasPriceBuffer(chainId) || 0n;
    const buffer = bigMath.mulDiv(
      gasPrice,
      bufferBps,
      BASIS_POINTS_DIVISOR_BIGINT
    );
    return {
      gasPrice: gasPrice + buffer + premium
    };
  } catch (error) {
    throw (0, errors_exports.extendError)(error, {
      errorContext: "gasPrice"
    });
  }
}

export { getGasPrice };
//# sourceMappingURL=gasPrice.js.map
//# sourceMappingURL=gasPrice.js.map