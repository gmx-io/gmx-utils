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
function hashDataMap(map) {
  const result = {};
  for (const key of Object.keys(map)) {
    if (!map[key]) {
      continue;
    }
    const [dataTypes, dataValues] = map[key];
    result[key] = hashData(dataTypes, dataValues);
  }
  return result;
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
hashString(
  "FEE_RECEIVER_DEPOSIT_FACTOR"
);
hashString(
  "BORROWING_FEE_RECEIVER_FACTOR"
);
hashString(
  "FEE_RECEIVER_WITHDRAWAL_FACTOR"
);
hashString(
  "FEE_RECEIVER_SWAP_FACTOR"
);
hashString(
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
hashString("NONCE");
var BORROWING_FACTOR_KEY = hashString("BORROWING_FACTOR");
var BORROWING_EXPONENT_FACTOR_KEY = hashString(
  "BORROWING_EXPONENT_FACTOR"
);
hashString(
  "CUMULATIVE_BORROWING_FACTOR"
);
hashString("TOTAL_BORROWING");
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
hashString(
  "MAX_PNL_FACTOR_FOR_WITHDRAWALS"
);
hashString(
  "MAX_PNL_FACTOR_FOR_DEPOSITS"
);
var MAX_PNL_FACTOR_FOR_TRADERS_KEY = hashString(
  "MAX_PNL_FACTOR_FOR_TRADERS"
);
var MAX_POSITION_IMPACT_FACTOR_FOR_LIQUIDATIONS_KEY = hashString(
  "MAX_POSITION_IMPACT_FACTOR_FOR_LIQUIDATIONS"
);
hashString(
  "CLAIMABLE_COLLATERAL_DELAY"
);
hashString(
  "CLAIMABLE_COLLATERAL_REDUCTION_FACTOR"
);
hashString(
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
hashString("MIN_COLLATERAL_USD");
var MIN_COLLATERAL_FACTOR_KEY = hashString("MIN_COLLATERAL_FACTOR");
var MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER_KEY = hashString("MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER");
hashString("MIN_POSITION_SIZE_USD");
hashString("MAX_LEVERAGE");
hashString("DEPOSIT_GAS_LIMIT");
hashString("WITHDRAWAL_GAS_LIMIT");
hashString(
  "INCREASE_ORDER_GAS_LIMIT"
);
hashString(
  "DECREASE_ORDER_GAS_LIMIT"
);
hashString("SWAP_ORDER_GAS_LIMIT");
hashString("SHIFT_GAS_LIMIT");
hashString("SINGLE_SWAP_GAS_LIMIT");
hashString(
  "TOKEN_TRANSFER_GAS_LIMIT"
);
hashString(
  "NATIVE_TOKEN_TRANSFER_GAS_LIMIT"
);
hashString(
  "ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1"
);
hashString(
  "ESTIMATED_GAS_FEE_PER_ORACLE_PRICE"
);
hashString(
  "ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR"
);
hashString("MARKET_LIST");
hashString("POSITION_LIST");
hashString("ORDER_LIST");
hashString("ACCOUNT_ORDER_LIST");
hashString("CLAIMABLE_FUNDING_AMOUNT");
var VIRTUAL_TOKEN_ID_KEY = hashString("VIRTUAL_TOKEN_ID");
var VIRTUAL_MARKET_ID_KEY = hashString("VIRTUAL_MARKET_ID");
hashString(
  "VIRTUAL_INVENTORY_FOR_POSITIONS"
);
hashString(
  "VIRTUAL_INVENTORY_FOR_SWAPS"
);
hashString("AFFILIATE_REWARD");
var IS_MARKET_DISABLED_KEY = hashString("IS_MARKET_DISABLED");
hashString("UI_FEE_FACTOR");
hashString("SUBACCOUNT_LIST");
hashString(
  "MAX_ALLOWED_SUBACCOUNT_ACTION_COUNT"
);
hashString("SUBACCOUNT_ACTION_COUNT");
hashString("SUBACCOUNT_ORDER_ACTION");
hashString(
  "SUBACCOUNT_INTEGRATION_ID"
);
hashString(
  "SUBACCOUNT_AUTO_TOP_UP_AMOUNT"
);
hashString(
  "GLV_MAX_MARKET_TOKEN_BALANCE_USD"
);
var MIN_COLLATERAL_FACTOR_FOR_LIQUIDATION_KEY = hashString(
  "MIN_COLLATERAL_FACTOR_FOR_LIQUIDATION"
);
hashString(
  "GLV_MAX_MARKET_TOKEN_BALANCE_AMOUNT"
);
hashString("IS_GLV_MARKET_DISABLED");
hashString(
  "GLV_SHIFT_LAST_EXECUTED_AT"
);
hashString("GLV_SHIFT_MIN_INTERVAL");
hashString("GLV_DEPOSIT_GAS_LIMIT");
hashString("GLV_WITHDRAWAL_GAS_LIMIT");
hashString("GLV_PER_MARKET_GAS_LIMIT");
hashString("MAX_AUTO_CANCEL_ORDERS");
hashString("OPTIMAL_USAGE_FACTOR");
hashString("BASE_BORROWING_FACTOR");
hashString(
  "ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR"
);
hashString("SUBACCOUNT_EXPIRES_AT");
hashString("MULTICHAIN_BALANCE");
hashString("PRICE_FEED");
hashString(
  "GASLESS_FEATURE_DISABLED"
);
hashString(
  "GELATO_RELAY_FEE_MULTIPLIER_FACTOR"
);
hashString(
  "REQUEST_EXPIRATION_TIME"
);
"0x" + keccakString("GMX SIMULATION ORIGIN").slice(-40);
hashString("CLAIM_TERMS");
hashString(
  "GENERAL_CLAIM_FEATURE_DISABLED"
);
hashString(
  "USE_OPEN_INTEREST_IN_TOKENS_FOR_BALANCE"
);

// scripts/prebuild/marketKeysAndConfigs.ts
function hashMarketConfigKeys(market) {
  const marketAddress = market.marketTokenAddress;
  return hashDataMap({
    isDisabled: [
      ["bytes32", "address"],
      [IS_MARKET_DISABLED_KEY, marketAddress]
    ],
    maxLongPoolAmount: [
      ["bytes32", "address", "address"],
      [MAX_POOL_AMOUNT_KEY, marketAddress, market.longTokenAddress]
    ],
    maxShortPoolAmount: [
      ["bytes32", "address", "address"],
      [MAX_POOL_AMOUNT_KEY, marketAddress, market.shortTokenAddress]
    ],
    maxLongPoolUsdForDeposit: [
      ["bytes32", "address", "address"],
      [MAX_POOL_USD_FOR_DEPOSIT_KEY, marketAddress, market.longTokenAddress]
    ],
    maxShortPoolUsdForDeposit: [
      ["bytes32", "address", "address"],
      [MAX_POOL_USD_FOR_DEPOSIT_KEY, marketAddress, market.shortTokenAddress]
    ],
    reserveFactorLong: [
      ["bytes32", "address", "bool"],
      [RESERVE_FACTOR_KEY, marketAddress, true]
    ],
    reserveFactorShort: [
      ["bytes32", "address", "bool"],
      [RESERVE_FACTOR_KEY, marketAddress, false]
    ],
    openInterestReserveFactorLong: [
      ["bytes32", "address", "bool"],
      [OPEN_INTEREST_RESERVE_FACTOR_KEY, marketAddress, true]
    ],
    openInterestReserveFactorShort: [
      ["bytes32", "address", "bool"],
      [OPEN_INTEREST_RESERVE_FACTOR_KEY, marketAddress, false]
    ],
    maxOpenInterestLong: [
      ["bytes32", "address", "bool"],
      [MAX_OPEN_INTEREST_KEY, marketAddress, true]
    ],
    maxOpenInterestShort: [
      ["bytes32", "address", "bool"],
      [MAX_OPEN_INTEREST_KEY, marketAddress, false]
    ],
    minPositionImpactPoolAmount: [
      ["bytes32", "address"],
      [MIN_POSITION_IMPACT_POOL_AMOUNT_KEY, marketAddress]
    ],
    positionImpactPoolDistributionRate: [
      ["bytes32", "address"],
      [POSITION_IMPACT_POOL_DISTRIBUTION_RATE_KEY, marketAddress]
    ],
    borrowingFactorLong: [
      ["bytes32", "address", "bool"],
      [BORROWING_FACTOR_KEY, marketAddress, true]
    ],
    borrowingFactorShort: [
      ["bytes32", "address", "bool"],
      [BORROWING_FACTOR_KEY, marketAddress, false]
    ],
    borrowingExponentFactorLong: [
      ["bytes32", "address", "bool"],
      [BORROWING_EXPONENT_FACTOR_KEY, marketAddress, true]
    ],
    borrowingExponentFactorShort: [
      ["bytes32", "address", "bool"],
      [BORROWING_EXPONENT_FACTOR_KEY, marketAddress, false]
    ],
    fundingFactor: [
      ["bytes32", "address"],
      [FUNDING_FACTOR_KEY, marketAddress]
    ],
    fundingExponentFactor: [
      ["bytes32", "address"],
      [FUNDING_EXPONENT_FACTOR_KEY, marketAddress]
    ],
    fundingIncreaseFactorPerSecond: [
      ["bytes32", "address"],
      [FUNDING_INCREASE_FACTOR_PER_SECOND, marketAddress]
    ],
    fundingDecreaseFactorPerSecond: [
      ["bytes32", "address"],
      [FUNDING_DECREASE_FACTOR_PER_SECOND, marketAddress]
    ],
    thresholdForStableFunding: [
      ["bytes32", "address"],
      [THRESHOLD_FOR_STABLE_FUNDING, marketAddress]
    ],
    thresholdForDecreaseFunding: [
      ["bytes32", "address"],
      [THRESHOLD_FOR_DECREASE_FUNDING, marketAddress]
    ],
    minFundingFactorPerSecond: [
      ["bytes32", "address"],
      [MIN_FUNDING_FACTOR_PER_SECOND, marketAddress]
    ],
    maxFundingFactorPerSecond: [
      ["bytes32", "address"],
      [MAX_FUNDING_FACTOR_PER_SECOND, marketAddress]
    ],
    maxPnlFactorForTradersLong: [
      ["bytes32", "bytes32", "address", "bool"],
      [MAX_PNL_FACTOR_KEY, MAX_PNL_FACTOR_FOR_TRADERS_KEY, marketAddress, true]
    ],
    maxPnlFactorForTradersShort: [
      ["bytes32", "bytes32", "address", "bool"],
      [
        MAX_PNL_FACTOR_KEY,
        MAX_PNL_FACTOR_FOR_TRADERS_KEY,
        marketAddress,
        false
      ]
    ],
    positionFeeFactorForBalanceWasImproved: [
      ["bytes32", "address", "bool"],
      [POSITION_FEE_FACTOR_KEY, marketAddress, true]
    ],
    positionFeeFactorForBalanceWasNotImproved: [
      ["bytes32", "address", "bool"],
      [POSITION_FEE_FACTOR_KEY, marketAddress, false]
    ],
    positionImpactFactorPositive: [
      ["bytes32", "address", "bool"],
      [POSITION_IMPACT_FACTOR_KEY, marketAddress, true]
    ],
    positionImpactFactorNegative: [
      ["bytes32", "address", "bool"],
      [POSITION_IMPACT_FACTOR_KEY, marketAddress, false]
    ],
    maxPositionImpactFactorPositive: [
      ["bytes32", "address", "bool"],
      [MAX_POSITION_IMPACT_FACTOR_KEY, marketAddress, true]
    ],
    maxPositionImpactFactorNegative: [
      ["bytes32", "address", "bool"],
      [MAX_POSITION_IMPACT_FACTOR_KEY, marketAddress, false]
    ],
    maxPositionImpactFactorForLiquidations: [
      ["bytes32", "address"],
      [MAX_POSITION_IMPACT_FACTOR_FOR_LIQUIDATIONS_KEY, marketAddress]
    ],
    maxLendableImpactFactor: [
      ["bytes32", "address"],
      [MAX_LENDABLE_IMPACT_FACTOR_KEY, marketAddress]
    ],
    maxLendableImpactFactorForWithdrawals: [
      ["bytes32", "address"],
      [MAX_LENDABLE_IMPACT_FACTOR_FOR_WITHDRAWALS_KEY, marketAddress]
    ],
    maxLendableImpactUsd: [
      ["bytes32", "address"],
      [MAX_LENDABLE_IMPACT_USD_KEY, marketAddress]
    ],
    lentPositionImpactPoolAmount: [
      ["bytes32", "address"],
      [LENT_POSITION_IMPACT_POOL_AMOUNT_KEY, marketAddress]
    ],
    minCollateralFactor: [
      ["bytes32", "address"],
      [MIN_COLLATERAL_FACTOR_KEY, marketAddress]
    ],
    minCollateralFactorForLiquidation: [
      ["bytes32", "address"],
      [MIN_COLLATERAL_FACTOR_FOR_LIQUIDATION_KEY, marketAddress]
    ],
    minCollateralFactorForOpenInterestLong: [
      ["bytes32", "address", "bool"],
      [
        MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER_KEY,
        marketAddress,
        true
      ]
    ],
    minCollateralFactorForOpenInterestShort: [
      ["bytes32", "address", "bool"],
      [
        MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER_KEY,
        marketAddress,
        false
      ]
    ],
    positionImpactExponentFactorPositive: [
      ["bytes32", "address", "bool"],
      [POSITION_IMPACT_EXPONENT_FACTOR_KEY, marketAddress, true]
    ],
    positionImpactExponentFactorNegative: [
      ["bytes32", "address", "bool"],
      [POSITION_IMPACT_EXPONENT_FACTOR_KEY, marketAddress, false]
    ],
    swapFeeFactorForBalanceWasImproved: [
      ["bytes32", "address", "bool"],
      [SWAP_FEE_FACTOR_KEY, marketAddress, true]
    ],
    swapFeeFactorForBalanceWasNotImproved: [
      ["bytes32", "address", "bool"],
      [SWAP_FEE_FACTOR_KEY, marketAddress, false]
    ],
    atomicSwapFeeFactor: [
      ["bytes32", "address"],
      [ATOMIC_SWAP_FEE_FACTOR_KEY, marketAddress]
    ],
    swapImpactFactorPositive: [
      ["bytes32", "address", "bool"],
      [SWAP_IMPACT_FACTOR_KEY, marketAddress, true]
    ],
    swapImpactFactorNegative: [
      ["bytes32", "address", "bool"],
      [SWAP_IMPACT_FACTOR_KEY, marketAddress, false]
    ],
    swapImpactExponentFactor: [
      ["bytes32", "address"],
      [SWAP_IMPACT_EXPONENT_FACTOR_KEY, marketAddress]
    ],
    virtualMarketId: [
      ["bytes32", "address"],
      [VIRTUAL_MARKET_ID_KEY, marketAddress]
    ],
    virtualLongTokenId: [
      ["bytes32", "address"],
      [VIRTUAL_TOKEN_ID_KEY, market.longTokenAddress]
    ],
    virtualShortTokenId: [
      ["bytes32", "address"],
      [VIRTUAL_TOKEN_ID_KEY, market.shortTokenAddress]
    ]
  });
}
function hashMarketValuesKeys(market) {
  const marketAddress = market.marketTokenAddress;
  const marketKeys = hashDataMap({
    longPoolAmount: [
      ["bytes32", "address", "address"],
      [POOL_AMOUNT_KEY, marketAddress, market.longTokenAddress]
    ],
    shortPoolAmount: [
      ["bytes32", "address", "address"],
      [POOL_AMOUNT_KEY, marketAddress, market.shortTokenAddress]
    ],
    positionImpactPoolAmount: [
      ["bytes32", "address"],
      [POSITION_IMPACT_POOL_AMOUNT_KEY, marketAddress]
    ],
    swapImpactPoolAmountLong: [
      ["bytes32", "address", "address"],
      [SWAP_IMPACT_POOL_AMOUNT_KEY, marketAddress, market.longTokenAddress]
    ],
    swapImpactPoolAmountShort: [
      ["bytes32", "address", "address"],
      [SWAP_IMPACT_POOL_AMOUNT_KEY, marketAddress, market.shortTokenAddress]
    ],
    longInterestUsingLongToken: [
      ["bytes32", "address", "address", "bool"],
      [OPEN_INTEREST_KEY, marketAddress, market.longTokenAddress, true]
    ],
    longInterestUsingShortToken: [
      ["bytes32", "address", "address", "bool"],
      [OPEN_INTEREST_KEY, marketAddress, market.shortTokenAddress, true]
    ],
    shortInterestUsingLongToken: [
      ["bytes32", "address", "address", "bool"],
      [OPEN_INTEREST_KEY, marketAddress, market.longTokenAddress, false]
    ],
    shortInterestUsingShortToken: [
      ["bytes32", "address", "address", "bool"],
      [OPEN_INTEREST_KEY, marketAddress, market.shortTokenAddress, false]
    ],
    longInterestInTokensUsingLongToken: [
      ["bytes32", "address", "address", "bool"],
      [
        OPEN_INTEREST_IN_TOKENS_KEY,
        marketAddress,
        market.longTokenAddress,
        true
      ]
    ],
    longInterestInTokensUsingShortToken: [
      ["bytes32", "address", "address", "bool"],
      [
        OPEN_INTEREST_IN_TOKENS_KEY,
        marketAddress,
        market.shortTokenAddress,
        true
      ]
    ],
    shortInterestInTokensUsingLongToken: [
      ["bytes32", "address", "address", "bool"],
      [
        OPEN_INTEREST_IN_TOKENS_KEY,
        marketAddress,
        market.longTokenAddress,
        false
      ]
    ],
    shortInterestInTokensUsingShortToken: [
      ["bytes32", "address", "address", "bool"],
      [
        OPEN_INTEREST_IN_TOKENS_KEY,
        marketAddress,
        market.shortTokenAddress,
        false
      ]
    ]
  });
  return marketKeys;
}

export { hashMarketConfigKeys, hashMarketValuesKeys };
//# sourceMappingURL=marketKeysAndConfigs.js.map
//# sourceMappingURL=marketKeysAndConfigs.js.map