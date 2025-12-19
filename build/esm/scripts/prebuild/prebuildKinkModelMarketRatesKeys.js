import fs from 'fs';
import entries from 'lodash/entries';
import { resolve } from 'path';
import { hashDataMap } from '../../src/lib/hash';
import { ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR, BASE_BORROWING_FACTOR, OPTIMAL_USAGE_FACTOR } from '../../src/configs/dataStore';
import { MARKETS } from '../../src/configs/markets';

function prebuildKinkModelMarketRatesKeys(outputDir) {
  const chainMarketKeys = entries(MARKETS).reduce(
    (chainsAcc, [chainId, markets]) => {
      const chainMarkets = entries(markets).reduce(
        (marketsAcc, [marketAddress]) => {
          const marketKeys = hashDataMap({
            optimalUsageFactorLong: [
              ["bytes32", "address", "bool"],
              [OPTIMAL_USAGE_FACTOR, marketAddress, true]
            ],
            optimalUsageFactorShort: [
              ["bytes32", "address", "bool"],
              [OPTIMAL_USAGE_FACTOR, marketAddress, false]
            ],
            baseBorrowingFactorLong: [
              ["bytes32", "address", "bool"],
              [BASE_BORROWING_FACTOR, marketAddress, true]
            ],
            baseBorrowingFactorShort: [
              ["bytes32", "address", "bool"],
              [BASE_BORROWING_FACTOR, marketAddress, false]
            ],
            aboveOptimalUsageBorrowingFactorLong: [
              ["bytes32", "address", "bool"],
              [ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR, marketAddress, true]
            ],
            aboveOptimalUsageBorrowingFactorShort: [
              ["bytes32", "address", "bool"],
              [ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR, marketAddress, false]
            ]
          });
          marketsAcc[marketAddress] = marketKeys;
          return marketsAcc;
        },
        {}
      );
      chainsAcc[chainId] = chainMarkets;
      return chainsAcc;
    },
    {}
  );
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    resolve(outputDir, "hashedKinkModelMarketRatesKeys.json"),
    JSON.stringify(chainMarketKeys, null, 2)
  );
  return chainMarketKeys;
}

export { prebuildKinkModelMarketRatesKeys };
//# sourceMappingURL=prebuildKinkModelMarketRatesKeys.js.map
//# sourceMappingURL=prebuildKinkModelMarketRatesKeys.js.map