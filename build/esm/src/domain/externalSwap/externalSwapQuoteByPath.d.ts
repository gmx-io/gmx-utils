import { ExternalSwapPath, ExternalSwapQuote, ExternalSwapQuoteParams } from "./types.js";
export declare const getExternalSwapQuoteByPath: ({ amountIn, externalSwapPath, externalSwapQuoteParams, }: {
    amountIn: bigint;
    externalSwapPath: ExternalSwapPath;
    externalSwapQuoteParams: ExternalSwapQuoteParams;
}) => ExternalSwapQuote | undefined;
