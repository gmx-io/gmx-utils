import { ExternalSwapQuote } from "domain/externalSwap/types";
import { Token } from "domain/tokens/types";
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
