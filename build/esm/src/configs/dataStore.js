import { hashString, keccakString, hashData } from '../lib/hash/index.js';

const POSITION_IMPACT_FACTOR_KEY = hashString("POSITION_IMPACT_FACTOR");
const MAX_POSITION_IMPACT_FACTOR_KEY = hashString(
  "MAX_POSITION_IMPACT_FACTOR"
);
const POSITION_IMPACT_EXPONENT_FACTOR_KEY = hashString(
  "POSITION_IMPACT_EXPONENT_FACTOR"
);
const POSITION_FEE_FACTOR_KEY = hashString("POSITION_FEE_FACTOR");
const SWAP_IMPACT_FACTOR_KEY = hashString("SWAP_IMPACT_FACTOR");
const SWAP_IMPACT_EXPONENT_FACTOR_KEY = hashString(
  "SWAP_IMPACT_EXPONENT_FACTOR"
);
const SWAP_FEE_FACTOR_KEY = hashString("SWAP_FEE_FACTOR");
const ATOMIC_SWAP_FEE_FACTOR_KEY = hashString("ATOMIC_SWAP_FEE_FACTOR");
const FEE_RECEIVER_DEPOSIT_FACTOR_KEY = hashString(
  "FEE_RECEIVER_DEPOSIT_FACTOR"
);
const BORROWING_FEE_RECEIVER_FACTOR_KEY = hashString(
  "BORROWING_FEE_RECEIVER_FACTOR"
);
const FEE_RECEIVER_WITHDRAWAL_FACTOR_KEY = hashString(
  "FEE_RECEIVER_WITHDRAWAL_FACTOR"
);
const FEE_RECEIVER_SWAP_FACTOR_KEY = hashString(
  "FEE_RECEIVER_SWAP_FACTOR"
);
const FEE_RECEIVER_POSITION_FACTOR_KEY = hashString(
  "FEE_RECEIVER_POSITION_FACTOR"
);
const OPEN_INTEREST_KEY = hashString("OPEN_INTEREST");
const OPEN_INTEREST_IN_TOKENS_KEY = hashString(
  "OPEN_INTEREST_IN_TOKENS"
);
const POOL_AMOUNT_KEY = hashString("POOL_AMOUNT");
const MAX_POOL_USD_FOR_DEPOSIT_KEY = hashString(
  "MAX_POOL_USD_FOR_DEPOSIT"
);
const MAX_POOL_AMOUNT_KEY = hashString("MAX_POOL_AMOUNT");
const RESERVE_FACTOR_KEY = hashString("RESERVE_FACTOR");
const OPEN_INTEREST_RESERVE_FACTOR_KEY = hashString(
  "OPEN_INTEREST_RESERVE_FACTOR"
);
const MAX_OPEN_INTEREST_KEY = hashString("MAX_OPEN_INTEREST");
const NONCE_KEY = hashString("NONCE");
const BORROWING_FACTOR_KEY = hashString("BORROWING_FACTOR");
const BORROWING_EXPONENT_FACTOR_KEY = hashString(
  "BORROWING_EXPONENT_FACTOR"
);
const CUMULATIVE_BORROWING_FACTOR_KEY = hashString(
  "CUMULATIVE_BORROWING_FACTOR"
);
const TOTAL_BORROWING_KEY = hashString("TOTAL_BORROWING");
const FUNDING_FACTOR_KEY = hashString("FUNDING_FACTOR");
const FUNDING_EXPONENT_FACTOR_KEY = hashString(
  "FUNDING_EXPONENT_FACTOR"
);
const FUNDING_INCREASE_FACTOR_PER_SECOND = hashString(
  "FUNDING_INCREASE_FACTOR_PER_SECOND"
);
const FUNDING_DECREASE_FACTOR_PER_SECOND = hashString(
  "FUNDING_DECREASE_FACTOR_PER_SECOND"
);
const MIN_FUNDING_FACTOR_PER_SECOND = hashString(
  "MIN_FUNDING_FACTOR_PER_SECOND"
);
const MAX_FUNDING_FACTOR_PER_SECOND = hashString(
  "MAX_FUNDING_FACTOR_PER_SECOND"
);
const THRESHOLD_FOR_STABLE_FUNDING = hashString(
  "THRESHOLD_FOR_STABLE_FUNDING"
);
const THRESHOLD_FOR_DECREASE_FUNDING = hashString(
  "THRESHOLD_FOR_DECREASE_FUNDING"
);
const MAX_PNL_FACTOR_KEY = hashString("MAX_PNL_FACTOR");
const MAX_PNL_FACTOR_FOR_WITHDRAWALS_KEY = hashString(
  "MAX_PNL_FACTOR_FOR_WITHDRAWALS"
);
const MAX_PNL_FACTOR_FOR_DEPOSITS_KEY = hashString(
  "MAX_PNL_FACTOR_FOR_DEPOSITS"
);
const MAX_PNL_FACTOR_FOR_TRADERS_KEY = hashString(
  "MAX_PNL_FACTOR_FOR_TRADERS"
);
const MAX_POSITION_IMPACT_FACTOR_FOR_LIQUIDATIONS_KEY = hashString(
  "MAX_POSITION_IMPACT_FACTOR_FOR_LIQUIDATIONS"
);
const CLAIMABLE_COLLATERAL_DELAY_KEY = hashString(
  "CLAIMABLE_COLLATERAL_DELAY"
);
const CLAIMABLE_COLLATERAL_REDUCTION_FACTOR_KEY = hashString(
  "CLAIMABLE_COLLATERAL_REDUCTION_FACTOR"
);
const CLAIMABLE_COLLATERAL_TIME_DIVISOR_KEY = hashString(
  "CLAIMABLE_COLLATERAL_TIME_DIVISOR"
);
const MAX_LENDABLE_IMPACT_FACTOR_KEY = hashString(
  "MAX_LENDABLE_IMPACT_FACTOR"
);
const MAX_LENDABLE_IMPACT_USD_KEY = hashString(
  "MAX_LENDABLE_IMPACT_USD"
);
const MAX_LENDABLE_IMPACT_FACTOR_FOR_WITHDRAWALS_KEY = hashString(
  "MAX_LENDABLE_IMPACT_FACTOR_FOR_WITHDRAWALS"
);
const LENT_POSITION_IMPACT_POOL_AMOUNT_KEY = hashString(
  "LENT_POSITION_IMPACT_POOL_AMOUNT"
);
const POSITION_IMPACT_POOL_AMOUNT_KEY = hashString(
  "POSITION_IMPACT_POOL_AMOUNT"
);
const MIN_POSITION_IMPACT_POOL_AMOUNT_KEY = hashString(
  "MIN_POSITION_IMPACT_POOL_AMOUNT"
);
const POSITION_IMPACT_POOL_DISTRIBUTION_RATE_KEY = hashString(
  "POSITION_IMPACT_POOL_DISTRIBUTION_RATE"
);
const SWAP_IMPACT_POOL_AMOUNT_KEY = hashString(
  "SWAP_IMPACT_POOL_AMOUNT"
);
const MIN_COLLATERAL_USD_KEY = hashString("MIN_COLLATERAL_USD");
const MIN_COLLATERAL_FACTOR_KEY = hashString("MIN_COLLATERAL_FACTOR");
const MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER_KEY = hashString("MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER");
const MIN_POSITION_SIZE_USD_KEY = hashString("MIN_POSITION_SIZE_USD");
const MAX_LEVERAGE_KEY = hashString("MAX_LEVERAGE");
const DEPOSIT_GAS_LIMIT_KEY = hashString("DEPOSIT_GAS_LIMIT");
const WITHDRAWAL_GAS_LIMIT_KEY = hashString("WITHDRAWAL_GAS_LIMIT");
const INCREASE_ORDER_GAS_LIMIT_KEY = hashString(
  "INCREASE_ORDER_GAS_LIMIT"
);
const DECREASE_ORDER_GAS_LIMIT_KEY = hashString(
  "DECREASE_ORDER_GAS_LIMIT"
);
const SWAP_ORDER_GAS_LIMIT_KEY = hashString("SWAP_ORDER_GAS_LIMIT");
const SHIFT_GAS_LIMIT_KEY = hashString("SHIFT_GAS_LIMIT");
const SINGLE_SWAP_GAS_LIMIT_KEY = hashString("SINGLE_SWAP_GAS_LIMIT");
const TOKEN_TRANSFER_GAS_LIMIT_KEY = hashString(
  "TOKEN_TRANSFER_GAS_LIMIT"
);
const NATIVE_TOKEN_TRANSFER_GAS_LIMIT_KEY = hashString(
  "NATIVE_TOKEN_TRANSFER_GAS_LIMIT"
);
const ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1 = hashString(
  "ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1"
);
const ESTIMATED_GAS_FEE_PER_ORACLE_PRICE = hashString(
  "ESTIMATED_GAS_FEE_PER_ORACLE_PRICE"
);
const ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR = hashString(
  "ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR"
);
const MARKET_LIST_KEY = hashString("MARKET_LIST");
const POSITION_LIST_KEY = hashString("POSITION_LIST");
const ORDER_LIST_KEY = hashString("ORDER_LIST");
const ACCOUNT_ORDER_LIST_KEY = hashString("ACCOUNT_ORDER_LIST");
const CLAIMABLE_FUNDING_AMOUNT = hashString("CLAIMABLE_FUNDING_AMOUNT");
const VIRTUAL_TOKEN_ID_KEY = hashString("VIRTUAL_TOKEN_ID");
const VIRTUAL_MARKET_ID_KEY = hashString("VIRTUAL_MARKET_ID");
const VIRTUAL_INVENTORY_FOR_POSITIONS_KEY = hashString(
  "VIRTUAL_INVENTORY_FOR_POSITIONS"
);
const VIRTUAL_INVENTORY_FOR_SWAPS_KEY = hashString(
  "VIRTUAL_INVENTORY_FOR_SWAPS"
);
const AFFILIATE_REWARD_KEY = hashString("AFFILIATE_REWARD");
const IS_MARKET_DISABLED_KEY = hashString("IS_MARKET_DISABLED");
const UI_FEE_FACTOR = hashString("UI_FEE_FACTOR");
const SUBACCOUNT_LIST_KEY = hashString("SUBACCOUNT_LIST");
const MAX_ALLOWED_SUBACCOUNT_ACTION_COUNT = hashString(
  "MAX_ALLOWED_SUBACCOUNT_ACTION_COUNT"
);
const SUBACCOUNT_ACTION_COUNT = hashString("SUBACCOUNT_ACTION_COUNT");
const SUBACCOUNT_ORDER_ACTION = hashString("SUBACCOUNT_ORDER_ACTION");
const SUBACCOUNT_INTEGRATION_ID = hashString(
  "SUBACCOUNT_INTEGRATION_ID"
);
const SUBACCOUNT_AUTO_TOP_UP_AMOUNT = hashString(
  "SUBACCOUNT_AUTO_TOP_UP_AMOUNT"
);
const GLV_MAX_MARKET_TOKEN_BALANCE_USD = hashString(
  "GLV_MAX_MARKET_TOKEN_BALANCE_USD"
);
const MIN_COLLATERAL_FACTOR_FOR_LIQUIDATION_KEY = hashString(
  "MIN_COLLATERAL_FACTOR_FOR_LIQUIDATION"
);
const GLV_MAX_MARKET_TOKEN_BALANCE_AMOUNT = hashString(
  "GLV_MAX_MARKET_TOKEN_BALANCE_AMOUNT"
);
const IS_GLV_MARKET_DISABLED = hashString("IS_GLV_MARKET_DISABLED");
const GLV_SHIFT_LAST_EXECUTED_AT = hashString(
  "GLV_SHIFT_LAST_EXECUTED_AT"
);
const GLV_SHIFT_MIN_INTERVAL = hashString("GLV_SHIFT_MIN_INTERVAL");
const GLV_DEPOSIT_GAS_LIMIT = hashString("GLV_DEPOSIT_GAS_LIMIT");
const GLV_WITHDRAWAL_GAS_LIMIT = hashString("GLV_WITHDRAWAL_GAS_LIMIT");
const GLV_PER_MARKET_GAS_LIMIT = hashString("GLV_PER_MARKET_GAS_LIMIT");
const MAX_AUTO_CANCEL_ORDERS_KEY = hashString("MAX_AUTO_CANCEL_ORDERS");
const OPTIMAL_USAGE_FACTOR = hashString("OPTIMAL_USAGE_FACTOR");
const BASE_BORROWING_FACTOR = hashString("BASE_BORROWING_FACTOR");
const ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR = hashString(
  "ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR"
);
const SUBACCOUNT_EXPIRES_AT = hashString("SUBACCOUNT_EXPIRES_AT");
const MULTICHAIN_BALANCE = hashString("MULTICHAIN_BALANCE");
const PRICE_FEED_KEY = hashString("PRICE_FEED");
const GASLESS_FEATURE_DISABLED_KEY = hashString(
  "GASLESS_FEATURE_DISABLED"
);
const GELATO_RELAY_FEE_MULTIPLIER_FACTOR_KEY = hashString(
  "GELATO_RELAY_FEE_MULTIPLIER_FACTOR"
);
const REQUEST_EXPIRATION_TIME_KEY = hashString(
  "REQUEST_EXPIRATION_TIME"
);
const GMX_SIMULATION_ORIGIN = "0x" + keccakString("GMX SIMULATION ORIGIN").slice(-40);
const CLAIM_TERMS_KEY = hashString("CLAIM_TERMS");
const GENERAL_CLAIM_FEATURE_DISABLED = hashString(
  "GENERAL_CLAIM_FEATURE_DISABLED"
);
const USE_OPEN_INTEREST_IN_TOKENS_FOR_BALANCE = hashString(
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