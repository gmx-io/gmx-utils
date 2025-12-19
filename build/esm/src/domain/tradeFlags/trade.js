import { TradeType, TradeMode } from '../tradeFlags/types.js';

const createTradeFlags = (tradeType, tradeMode) => {
  const isLong = tradeType === TradeType.Long;
  const isShort = tradeType === TradeType.Short;
  const isSwap = tradeType === TradeType.Swap;
  const isPosition = isLong || isShort;
  const isMarket = tradeMode === TradeMode.Market;
  const isLimit = tradeMode === TradeMode.Limit || tradeMode === TradeMode.StopMarket;
  const isTrigger = tradeMode === TradeMode.Trigger;
  const isTwap = tradeMode === TradeMode.Twap;
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