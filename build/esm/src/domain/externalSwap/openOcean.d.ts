import { ContractsChainId } from "../../configs/chains.js";
export type OpenOceanQuote = {
    to: string;
    data: string;
    value: bigint;
    estimatedGas: bigint;
    usdIn: bigint;
    usdOut: bigint;
    priceIn: bigint;
    priceOut: bigint;
    gasPrice: bigint;
    amountIn: bigint;
    outputAmount: bigint;
};
export declare function getOpenOceanTxnData({ chainId, tokenInAddress, tokenOutAddress, amountIn, senderAddress, receiverAddress, gasPrice, slippage, openOceanUrl, openOceanReferrer, disabledDexIds, onError, }: {
    senderAddress: string;
    receiverAddress: string;
    chainId: ContractsChainId;
    tokenInAddress: string;
    tokenOutAddress: string;
    amountIn: bigint;
    gasPrice: bigint;
    slippage: number;
    openOceanUrl: string;
    disabledDexIds?: number[];
    openOceanReferrer?: string;
    onError?: (error: Error, url: string) => void;
}): Promise<OpenOceanQuote | undefined>;
