import isPlainObject from 'lodash/isPlainObject';

// src/lib/objects/index.ts
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

// src/configs/swap.ts
var MAX_EDGE_PATH_LENGTH = 3;

// src/domain/swap/findReachableTokens.ts
function findReachableTokens(graph) {
  const reachableTokens = {};
  const allTokens = objectKeysDeep(graph, 1).sort();
  for (const startToken of allTokens) {
    const searchQueue = [
      {
        currentToken: startToken,
        pathLength: 0
      }
    ];
    const visitedTokens = /* @__PURE__ */ new Set();
    while (searchQueue.length > 0) {
      const { currentToken, pathLength } = searchQueue.shift();
      if (visitedTokens.has(currentToken)) {
        continue;
      }
      visitedTokens.add(currentToken);
      if (pathLength >= MAX_EDGE_PATH_LENGTH) {
        continue;
      }
      for (const nextToken in graph[currentToken]) {
        searchQueue.push({
          currentToken: nextToken,
          pathLength: pathLength + 1
        });
      }
    }
    reachableTokens[startToken] = Array.from(visitedTokens);
  }
  return reachableTokens;
}

export { findReachableTokens };
//# sourceMappingURL=findReachableTokens.js.map
//# sourceMappingURL=findReachableTokens.js.map