// src/domain/orders/types.ts
var OrderType = /* @__PURE__ */ ((OrderType2) => {
  OrderType2[OrderType2["MarketSwap"] = 0] = "MarketSwap";
  OrderType2[OrderType2["LimitSwap"] = 1] = "LimitSwap";
  OrderType2[OrderType2["MarketIncrease"] = 2] = "MarketIncrease";
  OrderType2[OrderType2["LimitIncrease"] = 3] = "LimitIncrease";
  OrderType2[OrderType2["MarketDecrease"] = 4] = "MarketDecrease";
  OrderType2[OrderType2["LimitDecrease"] = 5] = "LimitDecrease";
  OrderType2[OrderType2["StopLossDecrease"] = 6] = "StopLossDecrease";
  OrderType2[OrderType2["Liquidation"] = 7] = "Liquidation";
  OrderType2[OrderType2["StopIncrease"] = 8] = "StopIncrease";
  return OrderType2;
})(OrderType || {});

export { OrderType };
//# sourceMappingURL=types.js.map
//# sourceMappingURL=types.js.map