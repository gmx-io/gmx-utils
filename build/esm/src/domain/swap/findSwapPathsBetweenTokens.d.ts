import type { SwapPaths } from "domain/swap/types";
import type { MarketsGraph } from "./buildMarketsAdjacencyGraph";
export declare function findSwapPathsBetweenTokens(graph: MarketsGraph): SwapPaths;
