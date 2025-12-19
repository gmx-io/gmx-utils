import type { TradeAction as SubsquidTradeAction } from "../../codegen/subsquid.js";
import type { MarketsInfoData } from "../markets/types.js";
import { Token, TokensData } from "../tokens/types.js";
import type { PositionTradeAction, SwapTradeAction } from "../tradeHistory/types.js";
export declare function createRawTradeActionTransformer(marketsInfoData: MarketsInfoData, wrappedToken: Token, tokensData: TokensData): (value: SubsquidTradeAction, index: number, array: SubsquidTradeAction[]) => SwapTradeAction | PositionTradeAction | undefined;
export declare function bigNumberify(n?: bigint | string | null | undefined): bigint | undefined;
