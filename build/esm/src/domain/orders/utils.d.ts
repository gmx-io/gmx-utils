import { OrderType } from "./types.js";
export declare function isMarketOrderType(orderType: OrderType): boolean;
export declare function isLimitOrderType(orderType: OrderType): boolean;
export declare function isDecreaseOrderType(orderType: OrderType): boolean;
export declare function isIncreaseOrderType(orderType: OrderType): orderType is OrderType.MarketIncrease | OrderType.LimitIncrease | OrderType.StopIncrease;
export declare function isSwapOrderType(orderType: OrderType): boolean;
