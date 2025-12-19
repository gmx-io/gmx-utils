import { MarketInfo } from "../markets/types.js";
export declare function getAcceptablePriceInfo(p: {
    marketInfo: MarketInfo;
    isIncrease: boolean;
    isLimit: boolean;
    isLong: boolean;
    indexPrice: bigint;
    sizeDeltaUsd: bigint;
    maxNegativePriceImpactBps?: bigint;
}): {
    acceptablePrice: bigint;
    acceptablePriceDeltaBps: bigint;
    priceImpactDeltaAmount: bigint;
    priceImpactDeltaUsd: bigint;
    priceImpactDiffUsd: bigint;
    balanceWasImproved: boolean;
};
export declare function getAcceptablePriceByPriceImpact(p: {
    isIncrease: boolean;
    isLong: boolean;
    indexPrice: bigint;
    sizeDeltaUsd: bigint;
    priceImpactDeltaUsd: bigint;
}): {
    acceptablePrice: bigint;
    acceptablePriceDeltaBps: bigint;
    priceDelta: bigint;
};
export declare function getDefaultAcceptablePriceImpactBps(p: {
    isIncrease: boolean;
    isLong: boolean;
    indexPrice: bigint;
    sizeDeltaUsd: bigint;
    priceImpactDeltaUsd: bigint;
    acceptablePriceImapctBuffer?: number;
}): bigint;
export declare function getNextPositionExecutionPrice(p: {
    triggerPrice: bigint;
    priceImpactUsd: bigint;
    sizeDeltaUsd: bigint;
    isLong: boolean;
    isIncrease: boolean;
}): bigint | null;
