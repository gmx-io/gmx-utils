import type { GasLimitsConfig } from "domain/executionFee/types";
export declare function getNaiveEstimatedGasBySwapCount(singleSwap: GasLimitsConfig["singleSwap"], swapsCount: number): bigint;
