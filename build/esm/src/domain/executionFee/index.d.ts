import { FeeItem } from "../fees/types.js";
import { MarketInfo } from "../markets/types.js";
import { SwapStats } from "../swap/types.js";
export * from "./estimateOraclePriceCount.js";
export * from "./executionFee.js";
export * from "../pricing/priceImpact.js";
export declare function getSwapFee(marketInfo: MarketInfo, swapAmount: bigint, balanceWasImproved: boolean, isAtomicSwap: boolean): bigint;
export declare function getPositionFee(marketInfo: MarketInfo, sizeDeltaUsd: bigint, balanceWasImproved: boolean, referralInfo: {
    totalRebateFactor: bigint;
    discountFactor: bigint;
} | undefined, uiFeeFactor?: bigint): {
    positionFeeUsd: bigint;
    discountUsd: bigint;
    totalRebateUsd: bigint;
    uiFeeUsd?: undefined;
} | {
    positionFeeUsd: bigint;
    discountUsd: bigint;
    totalRebateUsd: bigint;
    uiFeeUsd: bigint;
};
export declare function getFundingFactorPerPeriod(marketInfo: MarketInfo, isLong: boolean, periodInSeconds: number): bigint;
export declare function getFundingFeeRateUsd(marketInfo: MarketInfo, isLong: boolean, sizeInUsd: bigint, periodInSeconds: number): bigint;
export declare function getBorrowingFactorPerPeriod(marketInfo: MarketInfo, isLong: boolean, periodInSeconds: number): bigint;
export declare function getBorrowingFeeRateUsd(marketInfo: MarketInfo, isLong: boolean, sizeInUsd: bigint, periodInSeconds: number): bigint;
export declare function getIsHighPriceImpact(positionPriceImpact?: FeeItem, swapPriceImpact?: FeeItem): boolean;
export declare function getFeeItem(feeDeltaUsd?: bigint, basis?: bigint, opts?: {
    shouldRoundUp?: boolean;
}): FeeItem | undefined;
export declare function getTotalFeeItem(feeItems: (FeeItem | undefined)[]): FeeItem;
export declare function getTotalSwapVolumeFromSwapStats(swapSteps?: SwapStats[]): bigint;
