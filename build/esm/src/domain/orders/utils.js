import { OrderType } from './types.js';

function isMarketOrderType(orderType) {
  return [
    OrderType.MarketDecrease,
    OrderType.MarketIncrease,
    OrderType.MarketSwap
  ].includes(orderType);
}
function isLimitOrderType(orderType) {
  return [
    OrderType.LimitDecrease,
    OrderType.LimitIncrease,
    OrderType.LimitSwap
  ].includes(orderType);
}
function isDecreaseOrderType(orderType) {
  return [
    OrderType.MarketDecrease,
    OrderType.LimitDecrease,
    OrderType.StopLossDecrease
  ].includes(orderType);
}
function isIncreaseOrderType(orderType) {
  return [
    OrderType.MarketIncrease,
    OrderType.LimitIncrease,
    OrderType.StopIncrease
  ].includes(orderType);
}
function isSwapOrderType(orderType) {
  return [OrderType.MarketSwap, OrderType.LimitSwap].includes(orderType);
}

export { isDecreaseOrderType, isIncreaseOrderType, isLimitOrderType, isMarketOrderType, isSwapOrderType };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map