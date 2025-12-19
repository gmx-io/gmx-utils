import type { ExternalSwapAggregator } from "domain/externalSwap/types";
export type FeeItem = {
    deltaUsd: bigint;
    bps: bigint;
    precisePercentage: bigint;
};
export type SwapFeeItem = FeeItem & {
    marketAddress: string;
    tokenInAddress: string;
    tokenOutAddress: string;
};
export type ExternalSwapFeeItem = FeeItem & {
    aggregator: ExternalSwapAggregator;
    tokenInAddress: string;
    tokenOutAddress: string;
};
export type TradeFeesType = "swap" | "increase" | "decrease" | "edit";
export type TradeFees = {
    totalFees?: FeeItem;
    payTotalFees?: FeeItem;
    swapFees?: SwapFeeItem[];
    positionFee?: FeeItem;
    swapPriceImpact?: FeeItem;
    positionCollateralPriceImpact?: FeeItem;
    proportionalPendingImpact?: FeeItem;
    increasePositionPriceImpact?: FeeItem;
    decreasePositionPriceImpact?: FeeItem;
    totalPendingImpact?: FeeItem;
    priceImpactDiff?: FeeItem;
    positionNetPriceImpact?: FeeItem;
    collateralNetPriceImpact?: FeeItem;
    collateralPriceImpactDiff?: FeeItem;
    positionFeeFactor?: bigint;
    borrowFee?: FeeItem;
    fundingFee?: FeeItem;
    uiFee?: FeeItem;
    uiSwapFee?: FeeItem;
    feeDiscountUsd?: bigint;
    swapProfitFee?: FeeItem;
    externalSwapFee?: ExternalSwapFeeItem;
};
export type GmSwapFees = {
    totalFees?: FeeItem;
    swapFee?: FeeItem;
    swapPriceImpact?: FeeItem;
    uiFee?: FeeItem;
    shiftFee?: FeeItem;
};
