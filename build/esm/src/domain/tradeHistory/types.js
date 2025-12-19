// src/domain/tradeHistory/types.ts
var TradeActionType = /* @__PURE__ */ ((TradeActionType2) => {
  TradeActionType2["OrderCreated"] = "OrderCreated";
  TradeActionType2["OrderExecuted"] = "OrderExecuted";
  TradeActionType2["OrderCancelled"] = "OrderCancelled";
  TradeActionType2["OrderUpdated"] = "OrderUpdated";
  TradeActionType2["OrderFrozen"] = "OrderFrozen";
  return TradeActionType2;
})(TradeActionType || {});
function isPositionTradeAction(tradeAction) {
  return tradeAction.type === "position";
}
function isSwapTradeAction(tradeAction) {
  return tradeAction.type === "swap";
}

export { TradeActionType, isPositionTradeAction, isSwapTradeAction };
//# sourceMappingURL=types.js.map
//# sourceMappingURL=types.js.map