// src/domain/pricing/utils.ts
function getMarkPrice(p) {
  const { prices, isIncrease, isLong } = p;
  const shouldUseMaxPrice = getShouldUseMaxPrice(isIncrease, isLong);
  return shouldUseMaxPrice ? prices.maxPrice : prices.minPrice;
}
function getShouldUseMaxPrice(isIncrease, isLong) {
  return isIncrease ? isLong : !isLong;
}
function getOrderThresholdType(orderType, isLong) {
  if (orderType === 3 /* LimitIncrease */) {
    return isLong ? "<" /* Below */ : ">" /* Above */;
  }
  if (orderType === 8 /* StopIncrease */) {
    return isLong ? ">" /* Above */ : "<" /* Below */;
  }
  if (orderType === 5 /* LimitDecrease */) {
    return isLong ? ">" /* Above */ : "<" /* Below */;
  }
  if (orderType === 6 /* StopLossDecrease */) {
    return isLong ? "<" /* Below */ : ">" /* Above */;
  }
  return void 0;
}

export { getMarkPrice, getOrderThresholdType, getShouldUseMaxPrice };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map