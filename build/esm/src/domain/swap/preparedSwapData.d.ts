import { SwapPaths } from "../swap/types.js";
import { MarketsGraph } from "./buildMarketsAdjacencyGraph.js";
declare const MARKETS_ADJACENCY_GRAPH: {
    [chainId: number]: MarketsGraph;
};
declare const TOKEN_SWAP_PATHS: {
    [chainId: number]: SwapPaths;
};
declare const REACHABLE_TOKENS: {
    [chainId: number]: {
        [token: string]: string[];
    };
};
export { MARKETS_ADJACENCY_GRAPH, REACHABLE_TOKENS, TOKEN_SWAP_PATHS };
