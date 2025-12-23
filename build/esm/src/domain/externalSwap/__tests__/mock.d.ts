import { ExternalSwapQuote } from "../../externalSwap/types.js";
import { Token } from "../../tokens/types.js";
export declare function mockExternalSwap({ inToken, outToken, amountIn, amountOut, priceIn, priceOut, feesUsd, data, to, receiver, }: {
    inToken: Token;
    outToken: Token;
    amountIn: bigint;
    amountOut: bigint;
    priceIn: bigint;
    priceOut: bigint;
    feesUsd?: bigint;
    data?: string;
    to?: string;
    receiver?: string;
}): ExternalSwapQuote;
