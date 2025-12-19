import { ExternalSwapQuote, ExternalSwapQuoteParams } from "../externalSwap/types.js";
import { IncreasePositionAmounts } from "../increase/types.js";
import { MarketInfo, MarketsInfoData } from "../markets/types.js";
import { PositionInfo } from "../positions/types.js";
import { NextPositionValues } from "../positions/types.js";
import { TriggerThresholdType } from "../pricing/types.js";
import { UserReferralInfo } from "../referrals/types.js";
import { TokensRatio } from "../swap/types.js";
import { FindSwapPath } from "../swap/types.js";
import { TokenData } from "../tokens/types.js";
type IncreasePositionParams = {
    marketInfo: MarketInfo;
    indexToken: TokenData;
    initialCollateralToken: TokenData;
    collateralToken: TokenData;
    isLong: boolean;
    initialCollateralAmount: bigint | undefined;
    position: PositionInfo | undefined;
    externalSwapQuote: ExternalSwapQuote | undefined;
    indexTokenAmount: bigint | undefined;
    leverage?: bigint;
    triggerPrice?: bigint;
    limitOrderType?: IncreasePositionAmounts["limitOrderType"];
    fixedAcceptablePriceImpactBps?: bigint;
    acceptablePriceImpactBuffer?: number;
    userReferralInfo: UserReferralInfo | undefined;
    strategy: "leverageBySize" | "leverageByCollateral" | "independent";
    findSwapPath: FindSwapPath;
    uiFeeFactor: bigint;
    marketsInfoData: MarketsInfoData | undefined;
    chainId: number;
    externalSwapQuoteParams: ExternalSwapQuoteParams | undefined;
    isSetAcceptablePriceImpactEnabled: boolean;
};
export declare function getIncreasePositionAmounts(p: IncreasePositionParams): IncreasePositionAmounts;
export declare function getTokensRatio({ fromToken, toToken, triggerRatioValue, markPrice, }: {
    fromToken: TokenData;
    toToken: TokenData;
    triggerRatioValue: bigint;
    markPrice: bigint;
}): {
    markRatio: TokensRatio;
    triggerRatio?: undefined;
} | {
    markRatio: TokensRatio;
    triggerRatio: TokensRatio;
};
export declare function leverageBySizeValues({ collateralToken, leverage, sizeDeltaUsd, collateralPrice, positionFeeUsd, borrowingFeeUsd, uiFeeUsd, swapUiFeeUsd, fundingFeeUsd, }: {
    collateralToken: TokenData;
    leverage: bigint;
    sizeDeltaUsd: bigint;
    collateralPrice: bigint;
    uiFeeFactor: bigint;
    positionFeeUsd: bigint;
    fundingFeeUsd: bigint;
    borrowingFeeUsd: bigint;
    uiFeeUsd: bigint;
    swapUiFeeUsd: bigint;
}): {
    collateralDeltaUsd: bigint;
    collateralDeltaAmount: bigint;
    baseCollateralUsd: bigint;
    baseCollateralAmount: bigint;
};
export declare function getIncreasePositionPrices({ triggerPrice, indexToken, initialCollateralToken, collateralToken, limitOrderType, isLong, }: {
    triggerPrice?: bigint;
    indexToken: TokenData;
    initialCollateralToken: TokenData;
    collateralToken: TokenData;
    isLong: boolean;
    limitOrderType?: IncreasePositionAmounts["limitOrderType"];
}): {
    indexPrice: bigint;
    initialCollateralPrice: bigint;
    collateralPrice: bigint;
    triggerThresholdType: TriggerThresholdType | undefined;
    triggerPrice: bigint | undefined;
};
export declare function getNextPositionValuesForIncreaseTrade(p: {
    existingPosition?: PositionInfo;
    marketInfo: MarketInfo;
    collateralToken: TokenData;
    positionPriceImpactDeltaUsd: bigint;
    sizeDeltaUsd: bigint;
    sizeDeltaInTokens: bigint;
    collateralDeltaUsd: bigint;
    collateralDeltaAmount: bigint;
    indexPrice: bigint;
    isLong: boolean;
    showPnlInLeverage: boolean;
    minCollateralUsd: bigint;
    userReferralInfo: UserReferralInfo | undefined;
}): NextPositionValues;
export {};
