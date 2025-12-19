import type { GasLimitsConfig } from "domain/executionFee/types";

export function getNaiveEstimatedGasBySwapCount(singleSwap: GasLimitsConfig["singleSwap"], swapsCount: number): bigint {
  const swapsCountBigint = BigInt(swapsCount);

  return singleSwap * swapsCountBigint;
}
