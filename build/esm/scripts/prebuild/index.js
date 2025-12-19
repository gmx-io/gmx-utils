import { resolve } from 'path';
import { prebuildKinkModelMarketRatesKeys } from './prebuildKinkModelMarketRatesKeys.js';
import { prebuildMarketConfigKeys } from './prebuildMarketConfigKeys.js';
import { prebuildMarketValuesKeys } from './prebuildMarketValuesKeys.js';

// scripts/prebuild/index.ts
var OUTPUT_DIR = resolve(process.cwd(), "src/codegen/hashed");
prebuildMarketValuesKeys(OUTPUT_DIR);
prebuildMarketConfigKeys(OUTPUT_DIR);
prebuildKinkModelMarketRatesKeys(OUTPUT_DIR);
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map