import type { TradeAction as SubsquidTradeAction } from "codegen/subsquid";
import type { MarketsInfoData } from "domain/markets/types";
import { Token, TokensData } from "domain/tokens/types";
import type { PositionTradeAction, SwapTradeAction } from "domain/tradeHistory/types";
export declare function createRawTradeActionTransformer(marketsInfoData: MarketsInfoData, wrappedToken: Token, tokensData: TokensData): (value: SubsquidTradeAction, index: number, array: SubsquidTradeAction[]) => SwapTradeAction | PositionTradeAction | undefined;
export declare function bigNumberify(n?: bigint | string | null | undefined): bigint | undefined;
