import type { MarketInfo } from "domain/markets/types";
import { TokenData } from "domain/tokens/types";

export type GlvInfo = {
  glvToken: TokenData & {
    contractSymbol: string;
  };
  glvTokenAddress: string;
  longTokenAddress: string;
  shortTokenAddress: string;
  isSameCollaterals: boolean;
  isSpotOnly: boolean;
  name: string;
  longToken: TokenData;
  shortToken: TokenData;
  markets: GlvMarket[];
  shiftLastExecutedAt: bigint;
  shiftMinInterval: bigint;
  isDisabled: boolean;
  poolValueMax: bigint;
  poolValueMin: bigint;
  data: string;
  isGlv?: boolean;
};

export interface GlvMarket {
  address: string;
  isDisabled: boolean;
  maxMarketTokenBalanceUsd: bigint;
  glvMaxMarketTokenBalanceAmount: bigint;
  gmBalance: bigint;
}

export type GlvOrMarketInfo = MarketInfo | GlvInfo;

export type GlvInfoData = {
  [key: string]: GlvInfo;
};

export type GlvAndGmMarketsInfoData = {
  [marketAddress: string]: MarketInfo | GlvInfo;
};
