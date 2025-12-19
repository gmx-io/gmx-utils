import { keccak256, stringToBytes, encodeAbiParameters } from 'viem';
import { LRUCache } from '../LruCache/index.js';

// src/lib/hash/index.ts
var dataCache = new LRUCache(1e4);
function hashData(dataTypes, dataValues) {
  const key = JSON.stringify(
    { dataTypes, dataValues },
    (_, val) => typeof val === "bigint" ? String(val) : val
  );
  if (dataCache.has(key)) {
    return dataCache.get(key);
  }
  const abiParameters = dataTypes.map((type) => ({ type }));
  const bytes = encodeAbiParameters(abiParameters, dataValues);
  const hash = keccak256(bytes);
  dataCache.set(key, hash);
  return hash;
}
var stringCache = new LRUCache(1e4);
function hashString(string) {
  if (stringCache.has(string)) {
    return stringCache.get(string);
  }
  const hash = hashData(["string"], [string]);
  stringCache.set(string, hash);
  return hash;
}
function keccakString(string) {
  return keccak256(stringToBytes(string));
}

// src/configs/dataStore.ts
var POSITION_IMPACT_FACTOR_KEY = hashString("POSITION_IMPACT_FACTOR");
var MAX_POSITION_IMPACT_FACTOR_KEY = hashString(
  "MAX_POSITION_IMPACT_FACTOR"
);
var POSITION_IMPACT_EXPONENT_FACTOR_KEY = hashString(
  "POSITION_IMPACT_EXPONENT_FACTOR"
);
var POSITION_FEE_FACTOR_KEY = hashString("POSITION_FEE_FACTOR");
var SWAP_IMPACT_FACTOR_KEY = hashString("SWAP_IMPACT_FACTOR");
var SWAP_IMPACT_EXPONENT_FACTOR_KEY = hashString(
  "SWAP_IMPACT_EXPONENT_FACTOR"
);
var SWAP_FEE_FACTOR_KEY = hashString("SWAP_FEE_FACTOR");
var ATOMIC_SWAP_FEE_FACTOR_KEY = hashString("ATOMIC_SWAP_FEE_FACTOR");
var FEE_RECEIVER_DEPOSIT_FACTOR_KEY = hashString(
  "FEE_RECEIVER_DEPOSIT_FACTOR"
);
var BORROWING_FEE_RECEIVER_FACTOR_KEY = hashString(
  "BORROWING_FEE_RECEIVER_FACTOR"
);
var FEE_RECEIVER_WITHDRAWAL_FACTOR_KEY = hashString(
  "FEE_RECEIVER_WITHDRAWAL_FACTOR"
);
var FEE_RECEIVER_SWAP_FACTOR_KEY = hashString(
  "FEE_RECEIVER_SWAP_FACTOR"
);
var FEE_RECEIVER_POSITION_FACTOR_KEY = hashString(
  "FEE_RECEIVER_POSITION_FACTOR"
);
var OPEN_INTEREST_KEY = hashString("OPEN_INTEREST");
var OPEN_INTEREST_IN_TOKENS_KEY = hashString(
  "OPEN_INTEREST_IN_TOKENS"
);
var POOL_AMOUNT_KEY = hashString("POOL_AMOUNT");
var MAX_POOL_USD_FOR_DEPOSIT_KEY = hashString(
  "MAX_POOL_USD_FOR_DEPOSIT"
);
var MAX_POOL_AMOUNT_KEY = hashString("MAX_POOL_AMOUNT");
var RESERVE_FACTOR_KEY = hashString("RESERVE_FACTOR");
var OPEN_INTEREST_RESERVE_FACTOR_KEY = hashString(
  "OPEN_INTEREST_RESERVE_FACTOR"
);
var MAX_OPEN_INTEREST_KEY = hashString("MAX_OPEN_INTEREST");
var NONCE_KEY = hashString("NONCE");
var BORROWING_FACTOR_KEY = hashString("BORROWING_FACTOR");
var BORROWING_EXPONENT_FACTOR_KEY = hashString(
  "BORROWING_EXPONENT_FACTOR"
);
var CUMULATIVE_BORROWING_FACTOR_KEY = hashString(
  "CUMULATIVE_BORROWING_FACTOR"
);
var TOTAL_BORROWING_KEY = hashString("TOTAL_BORROWING");
var FUNDING_FACTOR_KEY = hashString("FUNDING_FACTOR");
var FUNDING_EXPONENT_FACTOR_KEY = hashString(
  "FUNDING_EXPONENT_FACTOR"
);
var FUNDING_INCREASE_FACTOR_PER_SECOND = hashString(
  "FUNDING_INCREASE_FACTOR_PER_SECOND"
);
var FUNDING_DECREASE_FACTOR_PER_SECOND = hashString(
  "FUNDING_DECREASE_FACTOR_PER_SECOND"
);
var MIN_FUNDING_FACTOR_PER_SECOND = hashString(
  "MIN_FUNDING_FACTOR_PER_SECOND"
);
var MAX_FUNDING_FACTOR_PER_SECOND = hashString(
  "MAX_FUNDING_FACTOR_PER_SECOND"
);
var THRESHOLD_FOR_STABLE_FUNDING = hashString(
  "THRESHOLD_FOR_STABLE_FUNDING"
);
var THRESHOLD_FOR_DECREASE_FUNDING = hashString(
  "THRESHOLD_FOR_DECREASE_FUNDING"
);
var MAX_PNL_FACTOR_KEY = hashString("MAX_PNL_FACTOR");
var MAX_PNL_FACTOR_FOR_WITHDRAWALS_KEY = hashString(
  "MAX_PNL_FACTOR_FOR_WITHDRAWALS"
);
var MAX_PNL_FACTOR_FOR_DEPOSITS_KEY = hashString(
  "MAX_PNL_FACTOR_FOR_DEPOSITS"
);
var MAX_PNL_FACTOR_FOR_TRADERS_KEY = hashString(
  "MAX_PNL_FACTOR_FOR_TRADERS"
);
var MAX_POSITION_IMPACT_FACTOR_FOR_LIQUIDATIONS_KEY = hashString(
  "MAX_POSITION_IMPACT_FACTOR_FOR_LIQUIDATIONS"
);
var CLAIMABLE_COLLATERAL_DELAY_KEY = hashString(
  "CLAIMABLE_COLLATERAL_DELAY"
);
var CLAIMABLE_COLLATERAL_REDUCTION_FACTOR_KEY = hashString(
  "CLAIMABLE_COLLATERAL_REDUCTION_FACTOR"
);
var CLAIMABLE_COLLATERAL_TIME_DIVISOR_KEY = hashString(
  "CLAIMABLE_COLLATERAL_TIME_DIVISOR"
);
var MAX_LENDABLE_IMPACT_FACTOR_KEY = hashString(
  "MAX_LENDABLE_IMPACT_FACTOR"
);
var MAX_LENDABLE_IMPACT_USD_KEY = hashString(
  "MAX_LENDABLE_IMPACT_USD"
);
var MAX_LENDABLE_IMPACT_FACTOR_FOR_WITHDRAWALS_KEY = hashString(
  "MAX_LENDABLE_IMPACT_FACTOR_FOR_WITHDRAWALS"
);
var LENT_POSITION_IMPACT_POOL_AMOUNT_KEY = hashString(
  "LENT_POSITION_IMPACT_POOL_AMOUNT"
);
var POSITION_IMPACT_POOL_AMOUNT_KEY = hashString(
  "POSITION_IMPACT_POOL_AMOUNT"
);
var MIN_POSITION_IMPACT_POOL_AMOUNT_KEY = hashString(
  "MIN_POSITION_IMPACT_POOL_AMOUNT"
);
var POSITION_IMPACT_POOL_DISTRIBUTION_RATE_KEY = hashString(
  "POSITION_IMPACT_POOL_DISTRIBUTION_RATE"
);
var SWAP_IMPACT_POOL_AMOUNT_KEY = hashString(
  "SWAP_IMPACT_POOL_AMOUNT"
);
var MIN_COLLATERAL_USD_KEY = hashString("MIN_COLLATERAL_USD");
var MIN_COLLATERAL_FACTOR_KEY = hashString("MIN_COLLATERAL_FACTOR");
var MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER_KEY = hashString("MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER");
var MIN_POSITION_SIZE_USD_KEY = hashString("MIN_POSITION_SIZE_USD");
var MAX_LEVERAGE_KEY = hashString("MAX_LEVERAGE");
var DEPOSIT_GAS_LIMIT_KEY = hashString("DEPOSIT_GAS_LIMIT");
var WITHDRAWAL_GAS_LIMIT_KEY = hashString("WITHDRAWAL_GAS_LIMIT");
var INCREASE_ORDER_GAS_LIMIT_KEY = hashString(
  "INCREASE_ORDER_GAS_LIMIT"
);
var DECREASE_ORDER_GAS_LIMIT_KEY = hashString(
  "DECREASE_ORDER_GAS_LIMIT"
);
var SWAP_ORDER_GAS_LIMIT_KEY = hashString("SWAP_ORDER_GAS_LIMIT");
var SHIFT_GAS_LIMIT_KEY = hashString("SHIFT_GAS_LIMIT");
var SINGLE_SWAP_GAS_LIMIT_KEY = hashString("SINGLE_SWAP_GAS_LIMIT");
var TOKEN_TRANSFER_GAS_LIMIT_KEY = hashString(
  "TOKEN_TRANSFER_GAS_LIMIT"
);
var NATIVE_TOKEN_TRANSFER_GAS_LIMIT_KEY = hashString(
  "NATIVE_TOKEN_TRANSFER_GAS_LIMIT"
);
var ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1 = hashString(
  "ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1"
);
var ESTIMATED_GAS_FEE_PER_ORACLE_PRICE = hashString(
  "ESTIMATED_GAS_FEE_PER_ORACLE_PRICE"
);
var ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR = hashString(
  "ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR"
);
var MARKET_LIST_KEY = hashString("MARKET_LIST");
var POSITION_LIST_KEY = hashString("POSITION_LIST");
var ORDER_LIST_KEY = hashString("ORDER_LIST");
var ACCOUNT_ORDER_LIST_KEY = hashString("ACCOUNT_ORDER_LIST");
var CLAIMABLE_FUNDING_AMOUNT = hashString("CLAIMABLE_FUNDING_AMOUNT");
var VIRTUAL_TOKEN_ID_KEY = hashString("VIRTUAL_TOKEN_ID");
var VIRTUAL_MARKET_ID_KEY = hashString("VIRTUAL_MARKET_ID");
var VIRTUAL_INVENTORY_FOR_POSITIONS_KEY = hashString(
  "VIRTUAL_INVENTORY_FOR_POSITIONS"
);
var VIRTUAL_INVENTORY_FOR_SWAPS_KEY = hashString(
  "VIRTUAL_INVENTORY_FOR_SWAPS"
);
var AFFILIATE_REWARD_KEY = hashString("AFFILIATE_REWARD");
var IS_MARKET_DISABLED_KEY = hashString("IS_MARKET_DISABLED");
var UI_FEE_FACTOR = hashString("UI_FEE_FACTOR");
var SUBACCOUNT_LIST_KEY = hashString("SUBACCOUNT_LIST");
var MAX_ALLOWED_SUBACCOUNT_ACTION_COUNT = hashString(
  "MAX_ALLOWED_SUBACCOUNT_ACTION_COUNT"
);
var SUBACCOUNT_ACTION_COUNT = hashString("SUBACCOUNT_ACTION_COUNT");
var SUBACCOUNT_ORDER_ACTION = hashString("SUBACCOUNT_ORDER_ACTION");
var SUBACCOUNT_INTEGRATION_ID = hashString(
  "SUBACCOUNT_INTEGRATION_ID"
);
var SUBACCOUNT_AUTO_TOP_UP_AMOUNT = hashString(
  "SUBACCOUNT_AUTO_TOP_UP_AMOUNT"
);
var GLV_MAX_MARKET_TOKEN_BALANCE_USD = hashString(
  "GLV_MAX_MARKET_TOKEN_BALANCE_USD"
);
var MIN_COLLATERAL_FACTOR_FOR_LIQUIDATION_KEY = hashString(
  "MIN_COLLATERAL_FACTOR_FOR_LIQUIDATION"
);
var GLV_MAX_MARKET_TOKEN_BALANCE_AMOUNT = hashString(
  "GLV_MAX_MARKET_TOKEN_BALANCE_AMOUNT"
);
var IS_GLV_MARKET_DISABLED = hashString("IS_GLV_MARKET_DISABLED");
var GLV_SHIFT_LAST_EXECUTED_AT = hashString(
  "GLV_SHIFT_LAST_EXECUTED_AT"
);
var GLV_SHIFT_MIN_INTERVAL = hashString("GLV_SHIFT_MIN_INTERVAL");
var GLV_DEPOSIT_GAS_LIMIT = hashString("GLV_DEPOSIT_GAS_LIMIT");
var GLV_WITHDRAWAL_GAS_LIMIT = hashString("GLV_WITHDRAWAL_GAS_LIMIT");
var GLV_PER_MARKET_GAS_LIMIT = hashString("GLV_PER_MARKET_GAS_LIMIT");
var MAX_AUTO_CANCEL_ORDERS_KEY = hashString("MAX_AUTO_CANCEL_ORDERS");
var OPTIMAL_USAGE_FACTOR = hashString("OPTIMAL_USAGE_FACTOR");
var BASE_BORROWING_FACTOR = hashString("BASE_BORROWING_FACTOR");
var ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR = hashString(
  "ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR"
);
var SUBACCOUNT_EXPIRES_AT = hashString("SUBACCOUNT_EXPIRES_AT");
var MULTICHAIN_BALANCE = hashString("MULTICHAIN_BALANCE");
var PRICE_FEED_KEY = hashString("PRICE_FEED");
var GASLESS_FEATURE_DISABLED_KEY = hashString(
  "GASLESS_FEATURE_DISABLED"
);
var GELATO_RELAY_FEE_MULTIPLIER_FACTOR_KEY = hashString(
  "GELATO_RELAY_FEE_MULTIPLIER_FACTOR"
);
var REQUEST_EXPIRATION_TIME_KEY = hashString(
  "REQUEST_EXPIRATION_TIME"
);
var GMX_SIMULATION_ORIGIN = "0x" + keccakString("GMX SIMULATION ORIGIN").slice(-40);
var CLAIM_TERMS_KEY = hashString("CLAIM_TERMS");
var GENERAL_CLAIM_FEATURE_DISABLED = hashString(
  "GENERAL_CLAIM_FEATURE_DISABLED"
);
var USE_OPEN_INTEREST_IN_TOKENS_FOR_BALANCE = hashString(
  "USE_OPEN_INTEREST_IN_TOKENS_FOR_BALANCE"
);
function subaccountExpiresAtKey(account, subaccount, actionType) {
  return hashData(
    ["bytes32", "address", "address", "bytes32"],
    [SUBACCOUNT_EXPIRES_AT, account, subaccount, actionType]
  );
}
function glvShiftLastExecutedAtKey(glvAddress) {
  return hashData(
    ["bytes32", "address"],
    [GLV_SHIFT_LAST_EXECUTED_AT, glvAddress]
  );
}
function glvShiftMinIntervalKey(glvAddress) {
  return hashData(["bytes32", "address"], [GLV_SHIFT_MIN_INTERVAL, glvAddress]);
}
function glvMaxMarketTokenBalanceUsdKey(glvAddress, market) {
  return hashData(
    ["bytes32", "address", "address"],
    [GLV_MAX_MARKET_TOKEN_BALANCE_USD, glvAddress, market]
  );
}
function glvMaxMarketTokenBalanceAmountKey(glvAddress, market) {
  return hashData(
    ["bytes32", "address", "address"],
    [GLV_MAX_MARKET_TOKEN_BALANCE_AMOUNT, glvAddress, market]
  );
}
function isGlvDisabledKey(glvAddress, market) {
  return hashData(
    ["bytes32", "address", "address"],
    [IS_GLV_MARKET_DISABLED, glvAddress, market]
  );
}
function positionImpactFactorKey(market, isPositive) {
  return hashData(
    ["bytes32", "address", "bool"],
    [POSITION_IMPACT_FACTOR_KEY, market, isPositive]
  );
}
function positionImpactExponentFactorKey(market, isPositive) {
  return hashData(
    ["bytes32", "address", "bool"],
    [POSITION_IMPACT_EXPONENT_FACTOR_KEY, market, isPositive]
  );
}
function maxPositionImpactFactorKey(market, isPositive) {
  return hashData(
    ["bytes32", "address", "bool"],
    [MAX_POSITION_IMPACT_FACTOR_KEY, market, isPositive]
  );
}
function positionFeeFactorKey(market, forPositiveImpact) {
  return hashData(
    ["bytes32", "address", "bool"],
    [POSITION_FEE_FACTOR_KEY, market, forPositiveImpact]
  );
}
function swapImpactFactorKey(market, isPositive) {
  return hashData(
    ["bytes32", "address", "bool"],
    [SWAP_IMPACT_FACTOR_KEY, market, isPositive]
  );
}
function swapImpactExponentFactorKey(market) {
  return hashData(
    ["bytes32", "address"],
    [SWAP_IMPACT_EXPONENT_FACTOR_KEY, market]
  );
}
function swapFeeFactorKey(market, forPositiveImpact) {
  return hashData(
    ["bytes32", "address", "bool"],
    [SWAP_FEE_FACTOR_KEY, market, forPositiveImpact]
  );
}
function atomicSwapFeeFactorKey(market) {
  return hashData(["bytes32", "address"], [ATOMIC_SWAP_FEE_FACTOR_KEY, market]);
}
function openInterestKey(market, collateralToken, isLong) {
  return hashData(
    ["bytes32", "address", "address", "bool"],
    [OPEN_INTEREST_KEY, market, collateralToken, isLong]
  );
}
function openInterestInTokensKey(market, collateralToken, isLong) {
  return hashData(
    ["bytes32", "address", "address", "bool"],
    [OPEN_INTEREST_IN_TOKENS_KEY, market, collateralToken, isLong]
  );
}
function poolAmountKey(market, token) {
  return hashData(
    ["bytes32", "address", "address"],
    [POOL_AMOUNT_KEY, market, token]
  );
}
function reserveFactorKey(market, isLong) {
  return hashData(
    ["bytes32", "address", "bool"],
    [RESERVE_FACTOR_KEY, market, isLong]
  );
}
function openInterestReserveFactorKey(market, isLong) {
  return hashData(
    ["bytes32", "address", "bool"],
    [OPEN_INTEREST_RESERVE_FACTOR_KEY, market, isLong]
  );
}
function maxOpenInterestKey(market, isLong) {
  return hashData(
    ["bytes32", "address", "bool"],
    [MAX_OPEN_INTEREST_KEY, market, isLong]
  );
}
function borrowingFactorKey(market, isLong) {
  return hashData(
    ["bytes32", "address", "bool"],
    [BORROWING_FACTOR_KEY, market, isLong]
  );
}
function borrowingExponentFactorKey(market, isLong) {
  return hashData(
    ["bytes32", "address", "bool"],
    [BORROWING_EXPONENT_FACTOR_KEY, market, isLong]
  );
}
function cumulativeBorrowingFactorKey(market, isLong) {
  return hashData(
    ["bytes32", "address", "bool"],
    [CUMULATIVE_BORROWING_FACTOR_KEY, market, isLong]
  );
}
function totalBorrowingKey(market, isLong) {
  return hashData(
    ["bytes32", "address", "bool"],
    [TOTAL_BORROWING_KEY, market, isLong]
  );
}
function fundingFactorKey(market) {
  return hashData(["bytes32", "address"], [FUNDING_FACTOR_KEY, market]);
}
function fundingExponentFactorKey(market) {
  return hashData(
    ["bytes32", "address"],
    [FUNDING_EXPONENT_FACTOR_KEY, market]
  );
}
function fundingIncreaseFactorPerSecondKey(market) {
  return hashData(
    ["bytes32", "address"],
    [FUNDING_INCREASE_FACTOR_PER_SECOND, market]
  );
}
function fundingDecreaseFactorPerSecondKey(market) {
  return hashData(
    ["bytes32", "address"],
    [FUNDING_DECREASE_FACTOR_PER_SECOND, market]
  );
}
function minFundingFactorPerSecondKey(market) {
  return hashData(
    ["bytes32", "address"],
    [MIN_FUNDING_FACTOR_PER_SECOND, market]
  );
}
function maxFundingFactorPerSecondKey(market) {
  return hashData(
    ["bytes32", "address"],
    [MAX_FUNDING_FACTOR_PER_SECOND, market]
  );
}
function thresholdForStableFundingKey(market) {
  return hashData(
    ["bytes32", "address"],
    [THRESHOLD_FOR_STABLE_FUNDING, market]
  );
}
function thresholdForDecreaseFundingKey(market) {
  return hashData(
    ["bytes32", "address"],
    [THRESHOLD_FOR_DECREASE_FUNDING, market]
  );
}
function maxPnlFactorKey(pnlFactorType, market, isLong) {
  return hashData(
    ["bytes32", "bytes32", "address", "bool"],
    [MAX_PNL_FACTOR_KEY, pnlFactorType, market, isLong]
  );
}
function positionImpactPoolAmountKey(market) {
  return hashData(
    ["bytes32", "address"],
    [POSITION_IMPACT_POOL_AMOUNT_KEY, market]
  );
}
function minPositionImpactPoolAmountKey(market) {
  return hashData(
    ["bytes32", "address"],
    [MIN_POSITION_IMPACT_POOL_AMOUNT_KEY, market]
  );
}
function positionImpactPoolDistributionRateKey(market) {
  return hashData(
    ["bytes32", "address"],
    [POSITION_IMPACT_POOL_DISTRIBUTION_RATE_KEY, market]
  );
}
function maxPositionImpactFactorForLiquidationsKey(market) {
  return hashData(
    ["bytes32", "address"],
    [MAX_POSITION_IMPACT_FACTOR_FOR_LIQUIDATIONS_KEY, market]
  );
}
function swapImpactPoolAmountKey(market, token) {
  return hashData(
    ["bytes32", "address", "address"],
    [SWAP_IMPACT_POOL_AMOUNT_KEY, market, token]
  );
}
function orderKey(dataStoreAddress, nonce) {
  return hashData(["address", "uint256"], [dataStoreAddress, nonce]);
}
function depositGasLimitKey() {
  return DEPOSIT_GAS_LIMIT_KEY;
}
function withdrawalGasLimitKey() {
  return WITHDRAWAL_GAS_LIMIT_KEY;
}
function shiftGasLimitKey() {
  return SHIFT_GAS_LIMIT_KEY;
}
function singleSwapGasLimitKey() {
  return SINGLE_SWAP_GAS_LIMIT_KEY;
}
function increaseOrderGasLimitKey() {
  return INCREASE_ORDER_GAS_LIMIT_KEY;
}
function decreaseOrderGasLimitKey() {
  return DECREASE_ORDER_GAS_LIMIT_KEY;
}
function swapOrderGasLimitKey() {
  return SWAP_ORDER_GAS_LIMIT_KEY;
}
function accountOrderListKey(account) {
  return hashData(["bytes32", "address"], [ACCOUNT_ORDER_LIST_KEY, account]);
}
function minCollateralFactorKey(market) {
  return hashData(["bytes32", "address"], [MIN_COLLATERAL_FACTOR_KEY, market]);
}
function minCollateralFactorForLiquidationKey(market) {
  return hashData(
    ["bytes32", "address"],
    [MIN_COLLATERAL_FACTOR_FOR_LIQUIDATION_KEY, market]
  );
}
function minCollateralFactorForOpenInterest(market, isLong) {
  return hashData(
    ["bytes32", "address", "bool"],
    [MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER_KEY, market, isLong]
  );
}
function hashedPositionKey(account, market, collateralToken, isLong) {
  return hashData(
    ["address", "address", "address", "bool"],
    [account, market, collateralToken, isLong]
  );
}
function claimableFundingAmountKey(market, token, account) {
  return hashData(
    ["bytes32", "address", "address", "address"],
    [CLAIMABLE_FUNDING_AMOUNT, market, token, account]
  );
}
function virtualTokenIdKey(token) {
  return hashData(["bytes32", "address"], [VIRTUAL_TOKEN_ID_KEY, token]);
}
function virtualMarketIdKey(market) {
  return hashData(["bytes32", "address"], [VIRTUAL_MARKET_ID_KEY, market]);
}
function virtualInventoryForSwapsKey(virtualMarketId, token) {
  return hashData(
    ["bytes32", "bytes32", "address"],
    [VIRTUAL_INVENTORY_FOR_SWAPS_KEY, virtualMarketId, token]
  );
}
function virtualInventoryForPositionsKey(virtualTokenId) {
  return hashData(
    ["bytes32", "bytes32"],
    [VIRTUAL_INVENTORY_FOR_POSITIONS_KEY, virtualTokenId]
  );
}
function affiliateRewardKey(market, token, account) {
  return hashData(
    ["bytes32", "address", "address", "address"],
    [AFFILIATE_REWARD_KEY, market, token, account]
  );
}
function isMarketDisabledKey(market) {
  return hashData(["bytes32", "address"], [IS_MARKET_DISABLED_KEY, market]);
}
function maxPoolUsdForDepositKey(market, token) {
  return hashData(
    ["bytes32", "address", "address"],
    [MAX_POOL_USD_FOR_DEPOSIT_KEY, market, token]
  );
}
function maxPoolAmountKey(market, token) {
  return hashData(
    ["bytes32", "address", "address"],
    [MAX_POOL_AMOUNT_KEY, market, token]
  );
}
function uiFeeFactorKey(address) {
  return hashData(["bytes32", "address"], [UI_FEE_FACTOR, address]);
}
function subaccountListKey(account) {
  return hashData(["bytes32", "address"], [SUBACCOUNT_LIST_KEY, account]);
}
function maxAllowedSubaccountActionCountKey(account, subaccount, actionType) {
  return hashData(
    ["bytes32", "address", "address", "bytes32"],
    [MAX_ALLOWED_SUBACCOUNT_ACTION_COUNT, account, subaccount, actionType]
  );
}
function subaccountActionCountKey(account, subaccount, actionType) {
  return hashData(
    ["bytes32", "address", "address", "bytes32"],
    [SUBACCOUNT_ACTION_COUNT, account, subaccount, actionType]
  );
}
function maxLendableImpactFactorKey(market) {
  return hashData(
    ["bytes32", "address"],
    [MAX_LENDABLE_IMPACT_FACTOR_KEY, market]
  );
}
function maxLendableImpactFactorForWithdrawalsKey(market) {
  return hashData(
    ["bytes32", "address"],
    [MAX_LENDABLE_IMPACT_FACTOR_FOR_WITHDRAWALS_KEY, market]
  );
}
function maxLendableImpactUsdKey(market) {
  return hashData(
    ["bytes32", "address"],
    [MAX_LENDABLE_IMPACT_USD_KEY, market]
  );
}
function subaccountIntegrationIdKey(account, subaccount) {
  return hashData(
    ["bytes32", "address", "address"],
    [SUBACCOUNT_INTEGRATION_ID, account, subaccount]
  );
}
function subaccountAutoTopUpAmountKey(account, subaccount) {
  return hashData(
    ["bytes32", "address", "address"],
    [SUBACCOUNT_AUTO_TOP_UP_AMOUNT, account, subaccount]
  );
}
function multichainBalanceKey(account, token) {
  return hashData(
    ["bytes32", "address", "address"],
    [MULTICHAIN_BALANCE, account, token]
  );
}
function priceFeedKey(token) {
  return hashData(["bytes32", "address"], [PRICE_FEED_KEY, token]);
}
function gaslessFeatureDisabledKey(module) {
  return hashData(
    ["bytes32", "address"],
    [GASLESS_FEATURE_DISABLED_KEY, module]
  );
}
function claimTermsKey(distributionId) {
  return hashData(["bytes32", "uint256"], [CLAIM_TERMS_KEY, distributionId]);
}
function claimsDisabledKey(distributionId) {
  return hashData(
    ["bytes32", "uint256"],
    [GENERAL_CLAIM_FEATURE_DISABLED, distributionId]
  );
}

export { ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR, ACCOUNT_ORDER_LIST_KEY, AFFILIATE_REWARD_KEY, ATOMIC_SWAP_FEE_FACTOR_KEY, BASE_BORROWING_FACTOR, BORROWING_EXPONENT_FACTOR_KEY, BORROWING_FACTOR_KEY, BORROWING_FEE_RECEIVER_FACTOR_KEY, CLAIMABLE_COLLATERAL_DELAY_KEY, CLAIMABLE_COLLATERAL_REDUCTION_FACTOR_KEY, CLAIMABLE_COLLATERAL_TIME_DIVISOR_KEY, CLAIMABLE_FUNDING_AMOUNT, CLAIM_TERMS_KEY, CUMULATIVE_BORROWING_FACTOR_KEY, DECREASE_ORDER_GAS_LIMIT_KEY, DEPOSIT_GAS_LIMIT_KEY, ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1, ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR, ESTIMATED_GAS_FEE_PER_ORACLE_PRICE, FEE_RECEIVER_DEPOSIT_FACTOR_KEY, FEE_RECEIVER_POSITION_FACTOR_KEY, FEE_RECEIVER_SWAP_FACTOR_KEY, FEE_RECEIVER_WITHDRAWAL_FACTOR_KEY, FUNDING_DECREASE_FACTOR_PER_SECOND, FUNDING_EXPONENT_FACTOR_KEY, FUNDING_FACTOR_KEY, FUNDING_INCREASE_FACTOR_PER_SECOND, GASLESS_FEATURE_DISABLED_KEY, GELATO_RELAY_FEE_MULTIPLIER_FACTOR_KEY, GENERAL_CLAIM_FEATURE_DISABLED, GLV_DEPOSIT_GAS_LIMIT, GLV_MAX_MARKET_TOKEN_BALANCE_AMOUNT, GLV_MAX_MARKET_TOKEN_BALANCE_USD, GLV_PER_MARKET_GAS_LIMIT, GLV_SHIFT_LAST_EXECUTED_AT, GLV_SHIFT_MIN_INTERVAL, GLV_WITHDRAWAL_GAS_LIMIT, GMX_SIMULATION_ORIGIN, INCREASE_ORDER_GAS_LIMIT_KEY, IS_GLV_MARKET_DISABLED, IS_MARKET_DISABLED_KEY, LENT_POSITION_IMPACT_POOL_AMOUNT_KEY, MARKET_LIST_KEY, MAX_ALLOWED_SUBACCOUNT_ACTION_COUNT, MAX_AUTO_CANCEL_ORDERS_KEY, MAX_FUNDING_FACTOR_PER_SECOND, MAX_LENDABLE_IMPACT_FACTOR_FOR_WITHDRAWALS_KEY, MAX_LENDABLE_IMPACT_FACTOR_KEY, MAX_LENDABLE_IMPACT_USD_KEY, MAX_LEVERAGE_KEY, MAX_OPEN_INTEREST_KEY, MAX_PNL_FACTOR_FOR_DEPOSITS_KEY, MAX_PNL_FACTOR_FOR_TRADERS_KEY, MAX_PNL_FACTOR_FOR_WITHDRAWALS_KEY, MAX_PNL_FACTOR_KEY, MAX_POOL_AMOUNT_KEY, MAX_POOL_USD_FOR_DEPOSIT_KEY, MAX_POSITION_IMPACT_FACTOR_FOR_LIQUIDATIONS_KEY, MAX_POSITION_IMPACT_FACTOR_KEY, MIN_COLLATERAL_FACTOR_FOR_LIQUIDATION_KEY, MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER_KEY, MIN_COLLATERAL_FACTOR_KEY, MIN_COLLATERAL_USD_KEY, MIN_FUNDING_FACTOR_PER_SECOND, MIN_POSITION_IMPACT_POOL_AMOUNT_KEY, MIN_POSITION_SIZE_USD_KEY, MULTICHAIN_BALANCE, NATIVE_TOKEN_TRANSFER_GAS_LIMIT_KEY, NONCE_KEY, OPEN_INTEREST_IN_TOKENS_KEY, OPEN_INTEREST_KEY, OPEN_INTEREST_RESERVE_FACTOR_KEY, OPTIMAL_USAGE_FACTOR, ORDER_LIST_KEY, POOL_AMOUNT_KEY, POSITION_FEE_FACTOR_KEY, POSITION_IMPACT_EXPONENT_FACTOR_KEY, POSITION_IMPACT_FACTOR_KEY, POSITION_IMPACT_POOL_AMOUNT_KEY, POSITION_IMPACT_POOL_DISTRIBUTION_RATE_KEY, POSITION_LIST_KEY, PRICE_FEED_KEY, REQUEST_EXPIRATION_TIME_KEY, RESERVE_FACTOR_KEY, SHIFT_GAS_LIMIT_KEY, SINGLE_SWAP_GAS_LIMIT_KEY, SUBACCOUNT_ACTION_COUNT, SUBACCOUNT_AUTO_TOP_UP_AMOUNT, SUBACCOUNT_EXPIRES_AT, SUBACCOUNT_INTEGRATION_ID, SUBACCOUNT_LIST_KEY, SUBACCOUNT_ORDER_ACTION, SWAP_FEE_FACTOR_KEY, SWAP_IMPACT_EXPONENT_FACTOR_KEY, SWAP_IMPACT_FACTOR_KEY, SWAP_IMPACT_POOL_AMOUNT_KEY, SWAP_ORDER_GAS_LIMIT_KEY, THRESHOLD_FOR_DECREASE_FUNDING, THRESHOLD_FOR_STABLE_FUNDING, TOKEN_TRANSFER_GAS_LIMIT_KEY, TOTAL_BORROWING_KEY, UI_FEE_FACTOR, USE_OPEN_INTEREST_IN_TOKENS_FOR_BALANCE, VIRTUAL_INVENTORY_FOR_POSITIONS_KEY, VIRTUAL_INVENTORY_FOR_SWAPS_KEY, VIRTUAL_MARKET_ID_KEY, VIRTUAL_TOKEN_ID_KEY, WITHDRAWAL_GAS_LIMIT_KEY, accountOrderListKey, affiliateRewardKey, atomicSwapFeeFactorKey, borrowingExponentFactorKey, borrowingFactorKey, claimTermsKey, claimableFundingAmountKey, claimsDisabledKey, cumulativeBorrowingFactorKey, decreaseOrderGasLimitKey, depositGasLimitKey, fundingDecreaseFactorPerSecondKey, fundingExponentFactorKey, fundingFactorKey, fundingIncreaseFactorPerSecondKey, gaslessFeatureDisabledKey, glvMaxMarketTokenBalanceAmountKey, glvMaxMarketTokenBalanceUsdKey, glvShiftLastExecutedAtKey, glvShiftMinIntervalKey, hashedPositionKey, increaseOrderGasLimitKey, isGlvDisabledKey, isMarketDisabledKey, maxAllowedSubaccountActionCountKey, maxFundingFactorPerSecondKey, maxLendableImpactFactorForWithdrawalsKey, maxLendableImpactFactorKey, maxLendableImpactUsdKey, maxOpenInterestKey, maxPnlFactorKey, maxPoolAmountKey, maxPoolUsdForDepositKey, maxPositionImpactFactorForLiquidationsKey, maxPositionImpactFactorKey, minCollateralFactorForLiquidationKey, minCollateralFactorForOpenInterest, minCollateralFactorKey, minFundingFactorPerSecondKey, minPositionImpactPoolAmountKey, multichainBalanceKey, openInterestInTokensKey, openInterestKey, openInterestReserveFactorKey, orderKey, poolAmountKey, positionFeeFactorKey, positionImpactExponentFactorKey, positionImpactFactorKey, positionImpactPoolAmountKey, positionImpactPoolDistributionRateKey, priceFeedKey, reserveFactorKey, shiftGasLimitKey, singleSwapGasLimitKey, subaccountActionCountKey, subaccountAutoTopUpAmountKey, subaccountExpiresAtKey, subaccountIntegrationIdKey, subaccountListKey, swapFeeFactorKey, swapImpactExponentFactorKey, swapImpactFactorKey, swapImpactPoolAmountKey, swapOrderGasLimitKey, thresholdForDecreaseFundingKey, thresholdForStableFundingKey, totalBorrowingKey, uiFeeFactorKey, virtualInventoryForPositionsKey, virtualInventoryForSwapsKey, virtualMarketIdKey, virtualTokenIdKey, withdrawalGasLimitKey };
//# sourceMappingURL=dataStore.js.map
//# sourceMappingURL=dataStore.js.map