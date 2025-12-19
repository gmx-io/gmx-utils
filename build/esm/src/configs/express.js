import 'viem';
import '../bigmath/index.js';
import { BOTANIX, ARBITRUM_SEPOLIA, AVALANCHE_FUJI, AVALANCHE, ARBITRUM } from './chains.js';
import { getTokenBySymbol, getWrappedToken } from './tokens.js';

// src/lib/numbers/index.ts
var USD_DECIMALS = 30;
var PRECISION_DECIMALS = 30;
expandDecimals(1, PRECISION_DECIMALS);
BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
function expandDecimals(n, decimals) {
  return BigInt(n) * 10n ** BigInt(decimals);
}

// src/lib/time.ts
var SECONDS_IN_PERIOD = {
  "1m": 60,
  "5m": 60 * 5,
  "15m": 60 * 15,
  "1h": 60 * 60,
  "4h": 60 * 60 * 4,
  "1d": 60 * 60 * 24,
  "1y": 60 * 60 * 24 * 365
};
function secondsFrom(period) {
  return SECONDS_IN_PERIOD[period];
}
function periodToSeconds(periodsCount, period) {
  return periodsCount * secondsFrom(period);
}
-(/* @__PURE__ */ new Date()).getTimezoneOffset() * 60;
var SUBACCOUNT_MESSAGE = "Generate a GMX 1CT (One-Click Trading) session. Only sign this message on a trusted website.";
var SUBACCOUNT_DOCS_URL = "https://docs.gmx.io/docs/trading/v2/#one-click-trading";
var DEFAULT_SUBACCOUNT_EXPIRY_DURATION = periodToSeconds(7, "1d");
var DEFAULT_SUBACCOUNT_MAX_ALLOWED_COUNT = 90;
var DEFAULT_PERMIT_DEADLINE_DURATION = periodToSeconds(1, "1h");
var DEFAULT_EXPRESS_ORDER_DEADLINE_DURATION = periodToSeconds(1, "1h");
var GELATO_API_KEYS = {
  [ARBITRUM]: "6dE6kOa9pc1ap4dQQC2iaK9i6nBFp8eYxQlm00VreWc_",
  [AVALANCHE]: "FalsQh9loL6V0rwPy4gWgnQPR6uTHfWjSVT2qlTzUq4_",
  [BOTANIX]: "s5GgkfX7dvd_2uYqsRSCjzMekUrXh0dibUvfLab1Anc_",
  [ARBITRUM_SEPOLIA]: "nx5nyAg4h2kI_64YtOuPt7LSPDEXo4u8eJY_idF9xDw_"
};
var MIN_GELATO_USD_BALANCE_FOR_SPONSORED_CALL = expandDecimals(
  100,
  USD_DECIMALS
);
var MIN_RELAYER_FEE_USD = 5n ** BigInt(USD_DECIMALS - 1);
var EXPRESS_EXTRA_EXECUTION_FEE_BUFFER_BPS = 1e3;
var EXPRESS_DEFAULT_MIN_RESIDUAL_USD_NUMBER = 20;
var EXPRESS_DEFAULT_MIN_RESIDUAL_USD = expandDecimals(
  EXPRESS_DEFAULT_MIN_RESIDUAL_USD_NUMBER,
  USD_DECIMALS
);
var EXPRESS_DEFAULT_MAX_RESIDUAL_USD_NUMBER = 40;
var EXPRESS_DEFAULT_MAX_RESIDUAL_USD = expandDecimals(
  EXPRESS_DEFAULT_MAX_RESIDUAL_USD_NUMBER,
  USD_DECIMALS
);
var EXPRESS_RESIDUAL_AMOUNT_MULTIPLIER = 20n;
var GAS_PAYMENT_TOKENS = {
  [ARBITRUM]: [
    getTokenBySymbol(ARBITRUM, "USDC").address,
    getTokenBySymbol(ARBITRUM, "WETH").address,
    getTokenBySymbol(ARBITRUM, "USDT").address
  ],
  [AVALANCHE]: [
    getTokenBySymbol(AVALANCHE, "USDC").address,
    getTokenBySymbol(AVALANCHE, "WAVAX").address,
    getTokenBySymbol(AVALANCHE, "USDT").address
  ],
  [AVALANCHE_FUJI]: [
    getTokenBySymbol(AVALANCHE_FUJI, "USDC").address,
    getTokenBySymbol(AVALANCHE_FUJI, "WAVAX").address
  ],
  [ARBITRUM_SEPOLIA]: [
    getTokenBySymbol(ARBITRUM_SEPOLIA, "USDC.SG").address,
    getTokenBySymbol(ARBITRUM_SEPOLIA, "WETH").address
  ],
  [BOTANIX]: [getTokenBySymbol(BOTANIX, "pBTC").address]
};
function getGasPaymentTokens(chainId) {
  return GAS_PAYMENT_TOKENS[chainId];
}
function getDefaultGasPaymentToken(chainId) {
  return GAS_PAYMENT_TOKENS[chainId][0];
}
function getRelayerFeeToken(chainId) {
  return getWrappedToken(chainId);
}

export { DEFAULT_EXPRESS_ORDER_DEADLINE_DURATION, DEFAULT_PERMIT_DEADLINE_DURATION, DEFAULT_SUBACCOUNT_EXPIRY_DURATION, DEFAULT_SUBACCOUNT_MAX_ALLOWED_COUNT, EXPRESS_DEFAULT_MAX_RESIDUAL_USD, EXPRESS_DEFAULT_MIN_RESIDUAL_USD, EXPRESS_DEFAULT_MIN_RESIDUAL_USD_NUMBER, EXPRESS_EXTRA_EXECUTION_FEE_BUFFER_BPS, EXPRESS_RESIDUAL_AMOUNT_MULTIPLIER, GELATO_API_KEYS, MIN_GELATO_USD_BALANCE_FOR_SPONSORED_CALL, MIN_RELAYER_FEE_USD, SUBACCOUNT_DOCS_URL, SUBACCOUNT_MESSAGE, getDefaultGasPaymentToken, getGasPaymentTokens, getRelayerFeeToken };
//# sourceMappingURL=express.js.map
//# sourceMappingURL=express.js.map