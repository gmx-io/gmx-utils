import { OrderType } from '../orders/types.js';
import { TriggerThresholdType } from '../pricing/types.js';

function getMarkPrice(p) {
  const { prices, isIncrease, isLong } = p;
  const shouldUseMaxPrice = getShouldUseMaxPrice(isIncrease, isLong);
  return shouldUseMaxPrice ? prices.maxPrice : prices.minPrice;
}
function getShouldUseMaxPrice(isIncrease, isLong) {
  return isIncrease ? isLong : !isLong;
}
function getOrderThresholdType(orderType, isLong) {
  if (orderType === OrderType.LimitIncrease) {
    return isLong ? TriggerThresholdType.Below : TriggerThresholdType.Above;
  }
  if (orderType === OrderType.StopIncrease) {
    return isLong ? TriggerThresholdType.Above : TriggerThresholdType.Below;
  }
  if (orderType === OrderType.LimitDecrease) {
    return isLong ? TriggerThresholdType.Above : TriggerThresholdType.Below;
  }
  if (orderType === OrderType.StopLossDecrease) {
    return isLong ? TriggerThresholdType.Below : TriggerThresholdType.Above;
  }
  return void 0;
}

export { getMarkPrice, getOrderThresholdType, getShouldUseMaxPrice };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map