import { iRpc } from "../rpc/types.js";
export type GasPriceData = {
    gasPrice: bigint;
} | {
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
};
export declare function getGasPrice(chainId: number, rpc: iRpc): Promise<GasPriceData>;
