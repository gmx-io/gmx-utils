import { MARKETS } from '../../configs/markets.js';
import { buildMarketsAdjacencyGraph } from './buildMarketsAdjacencyGraph.js';
import { findReachableTokens } from './findReachableTokens.js';
import { findSwapPathsBetweenTokens } from './findSwapPathsBetweenTokens.js';

const MARKETS_ADJACENCY_GRAPH = {};
for (const chainId in MARKETS) {
  const markets = MARKETS[chainId];
  const chainGraph = buildMarketsAdjacencyGraph(markets);
  MARKETS_ADJACENCY_GRAPH[chainId] = chainGraph;
}
const TOKEN_SWAP_PATHS = {};
for (const chainId in MARKETS) {
  const chainGraph = MARKETS_ADJACENCY_GRAPH[chainId];
  const chainSwapPaths = findSwapPathsBetweenTokens(chainGraph);
  TOKEN_SWAP_PATHS[chainId] = chainSwapPaths;
}
const REACHABLE_TOKENS = {};
for (const chainId in MARKETS) {
  const chainGraph = MARKETS_ADJACENCY_GRAPH[chainId];
  const chainReachableTokens = findReachableTokens(chainGraph);
  REACHABLE_TOKENS[chainId] = chainReachableTokens;
}

export { MARKETS_ADJACENCY_GRAPH, REACHABLE_TOKENS, TOKEN_SWAP_PATHS };
//# sourceMappingURL=preparedSwapData.js.map
//# sourceMappingURL=preparedSwapData.js.map