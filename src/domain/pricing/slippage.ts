import { bigMath } from "lib/bigmath";
import { BASIS_POINTS_DIVISOR, BASIS_POINTS_DIVISOR_BIGINT } from "lib/numbers";

import { getShouldUseMaxPrice } from "./utils";

export function applySlippageToPrice(
  allowedSlippage: number,
  price: bigint,
  isIncrease: boolean,
  isLong: boolean
) {
  const shouldIncreasePrice = getShouldUseMaxPrice(isIncrease, isLong);

  const slippageBasisPoints = shouldIncreasePrice
    ? BASIS_POINTS_DIVISOR + allowedSlippage
    : BASIS_POINTS_DIVISOR - allowedSlippage;

  return bigMath.mulDiv(
    price,
    BigInt(slippageBasisPoints),
    BASIS_POINTS_DIVISOR_BIGINT
  );
}

export function applySlippageToMinOut(
  allowedSlippage: number,
  minOutputAmount: bigint
) {
  const slippageBasisPoints = BASIS_POINTS_DIVISOR - allowedSlippage;

  return bigMath.mulDiv(
    minOutputAmount,
    BigInt(slippageBasisPoints),
    BASIS_POINTS_DIVISOR_BIGINT
  );
}
