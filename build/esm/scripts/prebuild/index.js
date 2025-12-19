import { resolve } from 'path';
import { prebuildKinkModelMarketRatesKeys } from './prebuildKinkModelMarketRatesKeys';
import { prebuildMarketConfigKeys } from './prebuildMarketConfigKeys';
import { prebuildMarketValuesKeys } from './prebuildMarketValuesKeys';

const OUTPUT_DIR = resolve(process.cwd(), "src/codegen/hashed");
prebuildMarketValuesKeys(OUTPUT_DIR);
prebuildMarketConfigKeys(OUTPUT_DIR);
prebuildKinkModelMarketRatesKeys(OUTPUT_DIR);
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map