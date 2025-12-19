export enum TradeType {
  Long = "Long",
  Short = "Short",
  Swap = "Swap",
}

export enum TradeMode {
  Market = "Market",
  Limit = "Limit",
  StopMarket = "StopMarket",
  Trigger = "Trigger",
  Twap = "TWAP",
}

export type TradeFlags = {
  isLong: boolean;
  isShort: boolean;
  isSwap: boolean;
  isPosition: boolean;
  isIncrease: boolean;
  isTrigger: boolean;
  isMarket: boolean;
  isLimit: boolean;
  isTwap: boolean;
};
