// src/domain/tradeFlags/trade.ts
var createTradeFlags = (tradeType, tradeMode) => {
  const isLong = tradeType === "Long" /* Long */;
  const isShort = tradeType === "Short" /* Short */;
  const isSwap = tradeType === "Swap" /* Swap */;
  const isPosition = isLong || isShort;
  const isMarket = tradeMode === "Market" /* Market */;
  const isLimit = tradeMode === "Limit" /* Limit */ || tradeMode === "StopMarket" /* StopMarket */;
  const isTrigger = tradeMode === "Trigger" /* Trigger */;
  const isTwap = tradeMode === "TWAP" /* Twap */;
  const isIncrease = isPosition && (isMarket || isLimit || isTwap);
  const tradeFlags = {
    isLong,
    isShort,
    isSwap,
    isPosition,
    isIncrease,
    isMarket,
    isLimit,
    isTrigger,
    isTwap
  };
  return tradeFlags;
};

export { createTradeFlags };
//# sourceMappingURL=trade.js.map
//# sourceMappingURL=trade.js.map