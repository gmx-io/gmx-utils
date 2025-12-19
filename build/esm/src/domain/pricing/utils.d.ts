import { OrderType } from "../orders/types.js";
import { TriggerThresholdType } from "../pricing/types.js";
import { TokenPrices } from "../tokens/types.js";
export declare function getMarkPrice(p: {
    prices: TokenPrices;
    isIncrease: boolean;
    isLong: boolean;
}): bigint;
export declare function getShouldUseMaxPrice(isIncrease: boolean, isLong: boolean): boolean;
export declare function getOrderThresholdType(orderType: OrderType, isLong: boolean): TriggerThresholdType | undefined;
