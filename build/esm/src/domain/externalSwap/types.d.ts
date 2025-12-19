import { FeeItem } from "../fees/types.js";
import { SwapAmounts } from "../swap/types.js";
import { TokensData } from "../tokens/types.js";
export declare enum ExternalSwapAggregator {
    OpenOcean = "openOcean",
    BotanixStaking = "botanixStaking"
}
export type ExternalSwapQuote = {
    aggregator: ExternalSwapAggregator;
    inTokenAddress: string;
    outTokenAddress: string;
    receiver: string;
    amountIn: bigint;
    amountOut: bigint;
    usdIn: bigint;
    usdOut: bigint;
    priceIn: bigint;
    priceOut: bigint;
    feesUsd: bigint;
    needSpenderApproval?: boolean;
    txnData: {
        to: string;
        data: string;
        value: bigint;
        estimatedGas: bigint;
        estimatedExecutionFee: bigint;
    };
};
export type ExternalSwapPath = {
    aggregator: ExternalSwapAggregator;
    inTokenAddress: string;
    outTokenAddress: string;
};
export type ExternalSwapQuoteParams = {
    chainId: number;
    receiverAddress: string;
    gasPrice: bigint | undefined;
    tokensData: TokensData | undefined;
    botanixStakingAssetsPerShare: bigint | undefined;
};
export type ExternalSwapCalculationStrategy = "byFromValue" | "leverageBySize";
export type ExternalSwapInputs = {
    amountIn: bigint;
    priceIn: bigint;
    priceOut: bigint;
    usdIn: bigint;
    usdOut: bigint;
    strategy: ExternalSwapCalculationStrategy;
    internalSwapTotalFeesDeltaUsd?: bigint;
    internalSwapTotalFeeItem?: FeeItem;
    internalSwapAmounts: SwapAmounts;
};
