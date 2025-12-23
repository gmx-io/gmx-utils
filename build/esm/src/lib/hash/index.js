import { encodeAbiParameters, keccak256, stringToBytes } from 'viem';
import { LRUCache } from '../LruCache/index.js';

const ZERO_DATA = "0x";
const dataCache = new LRUCache(1e4);
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
const stringCache = new LRUCache(1e4);
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

export { ZERO_DATA, hashData, hashDataMap, hashString, keccakString };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map