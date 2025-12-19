import { objectKeysDeep } from '../../lib/objects/index.js';
import { MAX_EDGE_PATH_LENGTH } from '../../configs/swap.js';

function findSwapPathsBetweenTokens(graph) {
  const swapRoutes = {};
  const allTokens = objectKeysDeep(graph, 1).sort();
  for (const tokenAAddress of allTokens) {
    swapRoutes[tokenAAddress] = {};
    let empty = true;
    for (const tokenBAddress of allTokens) {
      if (tokenAAddress === tokenBAddress || swapRoutes[tokenBAddress]?.[tokenAAddress]) {
        continue;
      }
      const result = {};
      const searchQueue = [
        {
          currentToken: tokenAAddress,
          tokenPath: [tokenAAddress]
        }
      ];
      while (searchQueue.length > 0) {
        const { currentToken, tokenPath } = searchQueue.shift();
        if (tokenPath.length >= 3) {
          const lastToken = tokenPath[tokenPath.length - 1];
          const secondLastToken = tokenPath[tokenPath.length - 2];
          const thirdLastToken = tokenPath[tokenPath.length - 3];
          if (lastToken === thirdLastToken) {
            const lastEdge = graph[lastToken]?.[secondLastToken];
            if (lastEdge && lastEdge.length === 1) {
              continue;
            }
          }
        }
        if (tokenPath.length >= 2) {
          const lastToken = tokenPath[tokenPath.length - 1];
          const secondLastToken = tokenPath[tokenPath.length - 2];
          if (lastToken === secondLastToken) {
            continue;
          }
        }
        if (currentToken === tokenBAddress) {
          const intermediateTokenPath = tokenPath.slice(1, -1);
          const pathKey = intermediateTokenPath.join(",");
          if (!result[pathKey]) {
            result[pathKey] = intermediateTokenPath;
          }
        }
        if (tokenPath.length >= MAX_EDGE_PATH_LENGTH + 1) {
          continue;
        }
        for (const nextToken in graph[currentToken]) {
          searchQueue.push({
            currentToken: nextToken,
            tokenPath: [...tokenPath, nextToken]
          });
        }
      }
      if (Object.keys(result).length > 0) {
        empty = false;
        swapRoutes[tokenAAddress][tokenBAddress] = Object.values(result);
      }
    }
    if (empty) {
      delete swapRoutes[tokenAAddress];
    }
  }
  return swapRoutes;
}

export { findSwapPathsBetweenTokens };
//# sourceMappingURL=findSwapPathsBetweenTokens.js.map
//# sourceMappingURL=findSwapPathsBetweenTokens.js.map