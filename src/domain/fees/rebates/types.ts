export type RebateInfoItem = {
  factor: bigint;
  value: bigint;
  marketAddress: string;
  timeKey: string;
  tokenAddress: string;
  valueByFactor: bigint;
  reductionFactor: bigint;
  id: string;
};

export type RebatesInfoResult = {
  accruedPositionPriceImpactFees: RebateInfoItem[];
  claimablePositionPriceImpactFees: RebateInfoItem[];
};

export type PositionsConstants = {
  minCollateralUsd: bigint;
  minPositionSizeUsd: bigint;
  maxAutoCancelOrders: bigint;
  claimableCollateralDelay: bigint;
  claimableCollateralReductionFactor: bigint;
  claimableCollateralTimeDivisor: bigint;
};

export type ClaimableCollateralRaw = {
  id: string;
  marketAddress: string;
  tokenAddress: string;
  timeKey: string;
  value: string;
  factor: string;
  reductionFactor: string;
  factorByTime: string;
};








