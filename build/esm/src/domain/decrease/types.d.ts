import { OrderType } from "domain/orders/types";
import { TriggerThresholdType } from "domain/pricing/types";
export declare enum DecreasePositionSwapType {
    NoSwap = 0,
    SwapPnlTokenToCollateralToken = 1,
    SwapCollateralTokenToPnlToken = 2
}
export type DecreasePositionAmounts = {
    isFullClose: boolean;
    sizeDeltaUsd: bigint;
    sizeDeltaInTokens: bigint;
    collateralDeltaUsd: bigint;
    collateralDeltaAmount: bigint;
    indexPrice: bigint;
    collateralPrice: bigint;
    triggerPrice?: bigint;
    acceptablePrice: bigint;
    acceptablePriceDeltaBps: bigint;
    recommendedAcceptablePriceDeltaBps: bigint;
    estimatedPnl: bigint;
    estimatedPnlPercentage: bigint;
    realizedPnl: bigint;
    realizedPnlPercentage: bigint;
    positionFeeUsd: bigint;
    uiFeeUsd: bigint;
    swapUiFeeUsd: bigint;
    feeDiscountUsd: bigint;
    borrowingFeeUsd: bigint;
    fundingFeeUsd: bigint;
    swapProfitFeeUsd: bigint;
    proportionalPendingImpactDeltaUsd: bigint;
    closePriceImpactDeltaUsd: bigint;
    totalPendingImpactDeltaUsd: bigint;
    priceImpactDiffUsd: bigint;
    balanceWasImproved: boolean;
    payedRemainingCollateralAmount: bigint;
    payedOutputUsd: bigint;
    payedRemainingCollateralUsd: bigint;
    receiveTokenAmount: bigint;
    receiveUsd: bigint;
    triggerOrderType?: OrderType.LimitDecrease | OrderType.StopLossDecrease;
    triggerThresholdType?: TriggerThresholdType;
    decreaseSwapType: DecreasePositionSwapType;
};
