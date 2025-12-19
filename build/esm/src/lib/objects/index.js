import isPlainObject from 'lodash/isPlainObject';

function setByKey(obj, key, data) {
  return { ...obj, [key]: data };
}
function updateByKey(obj, key, data) {
  if (!obj[key]) return obj;
  return { ...obj, [key]: { ...obj[key], ...data } };
}
function getByKey(obj, key) {
  if (!obj || !key) return void 0;
  return obj[key];
}
function deleteByKey(obj, key) {
  const newObj = { ...obj };
  delete newObj[key];
  return newObj;
}
function objectKeysDeep(obj, depth = 1) {
  const keys = /* @__PURE__ */ new Set();
  const scanQueue = [{ obj, currentDepth: 0 }];
  while (scanQueue.length > 0) {
    const { obj: obj2, currentDepth } = scanQueue.pop();
    if (currentDepth > depth) {
      continue;
    }
    for (const key of Object.keys(obj2)) {
      keys.add(key);
      if (isPlainObject(obj2[key])) {
        scanQueue.push({ obj: obj2[key], currentDepth: currentDepth + 1 });
      }
    }
  }
  return Array.from(keys);
}

export { deleteByKey, getByKey, objectKeysDeep, setByKey, updateByKey };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map