import { expandDecimals, USD_DECIMALS } from '../lib/numbers/index.js';
import { periodToSeconds } from '../lib/time.js';
import { BOTANIX, ARBITRUM_SEPOLIA, AVALANCHE_FUJI, AVALANCHE, ARBITRUM } from './chains.js';
import { getTokenBySymbol, getWrappedToken } from './tokens.js';

const SUBACCOUNT_MESSAGE = "Generate a GMX 1CT (One-Click Trading) session. Only sign this message on a trusted website.";
const SUBACCOUNT_DOCS_URL = "https://docs.gmx.io/docs/trading/v2/#one-click-trading";
const DEFAULT_SUBACCOUNT_EXPIRY_DURATION = periodToSeconds(7, "1d");
const DEFAULT_SUBACCOUNT_MAX_ALLOWED_COUNT = 90;
const DEFAULT_PERMIT_DEADLINE_DURATION = periodToSeconds(1, "1h");
const DEFAULT_EXPRESS_ORDER_DEADLINE_DURATION = periodToSeconds(1, "1h");
const GELATO_API_KEYS = {
  [ARBITRUM]: "6dE6kOa9pc1ap4dQQC2iaK9i6nBFp8eYxQlm00VreWc_",
  [AVALANCHE]: "FalsQh9loL6V0rwPy4gWgnQPR6uTHfWjSVT2qlTzUq4_",
  [BOTANIX]: "s5GgkfX7dvd_2uYqsRSCjzMekUrXh0dibUvfLab1Anc_",
  [ARBITRUM_SEPOLIA]: "nx5nyAg4h2kI_64YtOuPt7LSPDEXo4u8eJY_idF9xDw_"
};
const MIN_GELATO_USD_BALANCE_FOR_SPONSORED_CALL = expandDecimals(
  100,
  USD_DECIMALS
);
const MIN_RELAYER_FEE_USD = 5n ** BigInt(USD_DECIMALS - 1);
const EXPRESS_EXTRA_EXECUTION_FEE_BUFFER_BPS = 1e3;
const EXPRESS_DEFAULT_MIN_RESIDUAL_USD_NUMBER = 20;
const EXPRESS_DEFAULT_MIN_RESIDUAL_USD = expandDecimals(
  EXPRESS_DEFAULT_MIN_RESIDUAL_USD_NUMBER,
  USD_DECIMALS
);
const EXPRESS_DEFAULT_MAX_RESIDUAL_USD_NUMBER = 40;
const EXPRESS_DEFAULT_MAX_RESIDUAL_USD = expandDecimals(
  EXPRESS_DEFAULT_MAX_RESIDUAL_USD_NUMBER,
  USD_DECIMALS
);
const EXPRESS_RESIDUAL_AMOUNT_MULTIPLIER = 20n;
const GAS_PAYMENT_TOKENS = {
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