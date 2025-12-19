import { ExternalSwapQuote } from "domain/externalSwap/types";
import { Token } from "domain/tokens/types";

export enum SwapPricingType {
  TwoStep = 0,
  Shift = 1,
  Atomic = 2,
}

export type SwapAmounts = {
  amountIn: bigint;
  usdIn: bigint;
  amountOut: bigint;
  usdOut: bigint;
  priceIn: bigint;
  priceOut: bigint;
  swapStrategy: SwapStrategyForIncreaseOrders;
  minOutputAmount: bigint;
  uiFeeUsd?: bigint;
};

export type SwapStats = {
  marketAddress: string;
  tokenInAddress: string;
  tokenOutAddress: string;
  isWrap: boolean;
  isUnwrap: boolean;
  isOutLiquidity?: boolean;
  isOutCapacity?: boolean;
  swapFeeAmount: bigint;
  swapFeeUsd: bigint;
  priceImpactDeltaUsd: bigint;
  amountIn: bigint;
  amountInAfterFees: bigint;
  usdIn: bigint;
  amountOut: bigint;
  usdOut: bigint;
};

export type SwapPathStats = {
  swapPath: string[];
  swapSteps: SwapStats[];
  targetMarketAddress?: string;
  totalSwapPriceImpactDeltaUsd: bigint;
  totalSwapFeeUsd: bigint;
  totalFeesDeltaUsd: bigint;
  tokenInAddress: string;
  tokenOutAddress: string;
  usdOut: bigint;
  amountOut: bigint;
};

export type MarketEdge = {
  marketAddress: string;
  from: string;
  to: string;
};

export type SwapRoute = {
  edges: MarketEdge[];
  path: string[];
  liquidity: bigint;
};

type TokenAddress = string;
export type SwapPaths = {
  [from: TokenAddress]: {
    [to: TokenAddress]: TokenAddress[][];
  };
};

export type SwapEstimator = (
  e: MarketEdge,
  usdIn: bigint
) => {
  usdOut: bigint;
};

export type NaiveSwapEstimator = (
  e: MarketEdge,
  usdIn: bigint
) => {
  swapYield: number;
};

export type NaiveNetworkEstimator = (
  usdIn: bigint,
  swapCount: number
) => {
  networkYield: number;
  usdOut: bigint;
};

export type MarketEdgeLiquidityGetter = (e: MarketEdge) => bigint;

export type SwapOptimizationOrderArray = ("liquidity" | "length")[];
export type FindSwapPath = (
  usdIn: bigint,
  opts?: { order?: SwapOptimizationOrderArray }
) => SwapPathStats | undefined;

export type TokensRatio = {
  ratio: bigint;
  largestToken: Token;
  smallestToken: Token;
};

export type TokensRatioAndSlippage = TokensRatio & {
  allowedSwapSlippageBps: bigint;
  acceptablePrice: bigint;
};

type BaseSwapStrategy = {
  amountIn: bigint;
  amountOut: bigint;
  usdIn: bigint;
  usdOut: bigint;
  priceIn: bigint;
  priceOut: bigint;
  feesUsd: bigint;
};

export type NoSwapStrategy = BaseSwapStrategy & {
  type: "noSwap";
  externalSwapQuote: undefined;
  swapPathStats: undefined;
};

export type ExternalSwapStrategy = BaseSwapStrategy & {
  type: "externalSwap";
  externalSwapQuote: ExternalSwapQuote;
  swapPathStats: undefined;
};

export type InternalSwapStrategy = BaseSwapStrategy & {
  type: "internalSwap";
  swapPathStats: SwapPathStats;
  externalSwapQuote: undefined;
};

export type CombinedSwapStrategy = BaseSwapStrategy & {
  type: "combinedSwap";
  externalSwapQuote: ExternalSwapQuote;
  swapPathStats: SwapPathStats;
};

export type SwapStrategyForIncreaseOrders =
  | NoSwapStrategy
  | ExternalSwapStrategy
  | InternalSwapStrategy
  | CombinedSwapStrategy;

export type SwapStrategyForSwapOrders =
  | NoSwapStrategy
  | InternalSwapStrategy
  | CombinedSwapStrategy;
