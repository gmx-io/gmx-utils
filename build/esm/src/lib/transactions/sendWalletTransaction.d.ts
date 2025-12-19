import { GasPriceData } from "lib/gas/gasPrice";
import { iRpc } from "lib/rpc/types";
import { ISigner } from "lib/signing/signing";
import { TransactionWaiterResult, TxnCallback } from "./types";
export type WalletTxnCtx = {};
export type WalletTxnResult = {
    transactionHash: string;
    wait: () => Promise<TransactionWaiterResult>;
};
export declare function sendWalletTransaction({ chainId, signer, rpc, to, callData, value, gasLimit, gasPriceData, runSimulation, nonce, callback, }: {
    chainId: number;
    signer: ISigner;
    rpc: iRpc;
    to: string;
    callData: string;
    value?: bigint;
    gasLimit?: bigint | number;
    gasPriceData?: GasPriceData;
    nonce?: number | bigint;
    msg?: string;
    runSimulation?: () => Promise<void>;
    callback?: TxnCallback<WalletTxnCtx>;
}): Promise<{
    transactionHash: any;
    wait: () => Promise<{
        transactionHash: string;
        blockNumber: number | undefined;
        status: string;
    }>;
}>;
