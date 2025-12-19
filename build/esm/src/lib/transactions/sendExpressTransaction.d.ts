import { ContractsChainId } from "configs/chains";
import { type GelatoTaskStatus, type TransactionWaiterResult } from "./types";
export type ExpressTxnData = {
    callData: string;
    to: string;
    feeToken: string;
    feeAmount: bigint;
};
export type ExpressTxnResult = {
    taskId: string;
    wait: () => Promise<TransactionWaiterResult>;
};
export declare function sendExpressTransaction(p: {
    chainId: ContractsChainId;
    txnData: ExpressTxnData;
    isSponsoredCall: boolean;
}): Promise<{
    taskId: string;
    wait: () => Promise<TransactionWaiterResult>;
}>;
export declare function sendTxnToGelato({ chainId, target, data, feeToken, sponsorApiKey, retries, isSponsoredCall, }: {
    chainId: number;
    target: string;
    data: string;
    feeToken: string;
    sponsorApiKey: string | undefined;
    retries: number;
    isSponsoredCall: boolean;
}): Promise<{
    taskId: string;
}>;
export declare function pollGelatoTask(taskId: string, cb: (status: GelatoTaskStatus | undefined, error?: Error) => void): Promise<void>;
export declare function getGelatoTaskDebugInfo(taskId: string, accountSlug?: string, projectSlug?: string): Promise<any>;
