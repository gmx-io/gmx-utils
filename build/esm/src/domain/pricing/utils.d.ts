import { OrderType } from "domain/orders/types";
import { TriggerThresholdType } from "domain/pricing/types";
import { TokenPrices } from "domain/tokens/types";
export declare function getMarkPrice(p: {
    prices: TokenPrices;
    isIncrease: boolean;
    isLong: boolean;
}): bigint;
export declare function getShouldUseMaxPrice(isIncrease: boolean, isLong: boolean): boolean;
export declare function getOrderThresholdType(orderType: OrderType, isLong: boolean): TriggerThresholdType | undefined;
