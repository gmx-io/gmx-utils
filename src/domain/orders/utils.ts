import { OrderType } from "./types";

export function isMarketOrderType(orderType: OrderType) {
  return [
    OrderType.MarketDecrease,
    OrderType.MarketIncrease,
    OrderType.MarketSwap,
  ].includes(orderType);
}

export function isLimitOrderType(orderType: OrderType) {
  return [
    OrderType.LimitDecrease,
    OrderType.LimitIncrease,
    OrderType.LimitSwap,
  ].includes(orderType);
}

export function isDecreaseOrderType(orderType: OrderType) {
  return [
    OrderType.MarketDecrease,
    OrderType.LimitDecrease,
    OrderType.StopLossDecrease,
  ].includes(orderType);
}

export function isIncreaseOrderType(
  orderType: OrderType
): orderType is
  | OrderType.MarketIncrease
  | OrderType.LimitIncrease
  | OrderType.StopIncrease {
  return [
    OrderType.MarketIncrease,
    OrderType.LimitIncrease,
    OrderType.StopIncrease,
  ].includes(orderType);
}

export function isSwapOrderType(orderType: OrderType) {
  return [OrderType.MarketSwap, OrderType.LimitSwap].includes(orderType);
}

