import type { SwapPaths } from "../swap/types.js";
import type { MarketsGraph } from "./buildMarketsAdjacencyGraph.js";
export declare function findSwapPathsBetweenTokens(graph: MarketsGraph): SwapPaths;
