export type DepositAmounts = {
  marketTokenAmount: bigint;
  marketTokenUsd: bigint;
  longTokenAmount: bigint;
  longTokenUsd: bigint;
  glvTokenAmount: bigint;
  glvTokenUsd: bigint;
  shortTokenAmount: bigint;
  shortTokenUsd: bigint;
  swapFeeUsd: bigint;
  uiFeeUsd: bigint;
  swapPriceImpactDeltaUsd: bigint;
};

export type WithdrawalAmounts = {
  marketTokenAmount: bigint;
  marketTokenUsd: bigint;
  longTokenAmount: bigint;
  shortTokenAmount: bigint;
  longTokenUsd: bigint;
  shortTokenUsd: bigint;
  glvTokenAmount: bigint;
  glvTokenUsd: bigint;
  swapFeeUsd: bigint;
  uiFeeUsd: bigint;
  swapPriceImpactDeltaUsd: bigint;
};
