/**
 * Json files in this directory are prebuild by scripts from the `scripts/prebuild` directory.
 * No need to edit them manually, use `yarn run prebuild` command instead.
 */
import {
  KinkModelMarketRateDataStoreKeys,
  MarketConfigDataStoreKeys,
  MarketValuesDataStoreKeys,
} from "domain/markets/types";

import hashedKinkModelMarketRatesKeys from "./hashedKinkModelMarketRatesKeys.json";
import hashedMarketConfigKeysJson from "./hashedMarketConfigKeys.json";
import hashedMarketValuesKeysJson from "./hashedMarketValuesKeys.json";

type HashedMarketValuesKeys = Partial<
  Record<MarketValuesDataStoreKeys, string>
>;

const HASHED_MARKET_VALUES_KEYS: {
  [chainId: number]: {
    [marketToken: string]: HashedMarketValuesKeys;
  };
} = hashedMarketValuesKeysJson;

type HashedMarketConfigKeys = Record<MarketConfigDataStoreKeys, string>;

const HASHED_MARKET_CONFIG_KEYS: {
  [chainId: number]: {
    [marketToken: string]: HashedMarketConfigKeys;
  };
} = hashedMarketConfigKeysJson;

type HashedKinkModelMarketRatesConfigKeys = Record<
  KinkModelMarketRateDataStoreKeys,
  string
>;

const HASHED_KINK_MODEL_MARKET_RATES_KEYS: {
  [chainId: number]: {
    [marketToken: string]: HashedKinkModelMarketRatesConfigKeys;
  };
} = hashedKinkModelMarketRatesKeys;

export {
  HASHED_KINK_MODEL_MARKET_RATES_KEYS,
  HASHED_MARKET_CONFIG_KEYS,
  HASHED_MARKET_VALUES_KEYS,
};
