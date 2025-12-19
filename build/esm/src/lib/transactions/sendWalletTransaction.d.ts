import { GasPriceData } from "../gas/gasPrice.js";
import { iRpc } from "../rpc/types.js";
import { ISigner } from "../signing/signing.js";
import { TransactionWaiterResult, TxnCallback } from "./types.js";
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
