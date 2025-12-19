/**
 * Json files in this directory are prebuild by scripts from the `scripts/prebuild` directory.
 * No need to edit them manually, use `yarn run prebuild` command instead.
 */
import { KinkModelMarketRateDataStoreKeys, MarketConfigDataStoreKeys, MarketValuesDataStoreKeys } from "domain/markets/types";
type HashedMarketValuesKeys = Partial<Record<MarketValuesDataStoreKeys, string>>;
declare const HASHED_MARKET_VALUES_KEYS: {
    [chainId: number]: {
        [marketToken: string]: HashedMarketValuesKeys;
    };
};
type HashedMarketConfigKeys = Record<MarketConfigDataStoreKeys, string>;
declare const HASHED_MARKET_CONFIG_KEYS: {
    [chainId: number]: {
        [marketToken: string]: HashedMarketConfigKeys;
    };
};
type HashedKinkModelMarketRatesConfigKeys = Record<KinkModelMarketRateDataStoreKeys, string>;
declare const HASHED_KINK_MODEL_MARKET_RATES_KEYS: {
    [chainId: number]: {
        [marketToken: string]: HashedKinkModelMarketRatesConfigKeys;
    };
};
export { HASHED_KINK_MODEL_MARKET_RATES_KEYS, HASHED_MARKET_CONFIG_KEYS, HASHED_MARKET_VALUES_KEYS, };
