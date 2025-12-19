import type { ContractsChainId } from "configs/chains";
import type { TokensData } from "domain/tokens/types";
import { iRpc } from "lib/rpc/types";
import { ISigner } from "lib/signing/signing";
import { TxnCallback } from "lib/transactions/types";
import { type BatchOrderTxnParams } from "transactions/batch/payloads/orderTransactions";
import type { ExpressTxnParams } from "transactions/express/types";
import type { BlockTimestampData } from "transactions/simulation/simulation";
export type BatchSimulationParams = {
    tokensData: TokensData;
    blockTimestampData: BlockTimestampData | undefined;
};
export type BatchOrderTxnCtx = {
    expressParams: ExpressTxnParams | undefined;
    batchParams: BatchOrderTxnParams;
    signer: ISigner;
};
export declare function sendBatchOrderTxn({ chainId, signer, isGmxAccount, provider, batchParams, expressParams, simulationParams, callback, }: {
    chainId: ContractsChainId;
    signer: ISigner;
    isGmxAccount: boolean;
    provider: iRpc;
    batchParams: BatchOrderTxnParams;
    expressParams: ExpressTxnParams | undefined;
    simulationParams: BatchSimulationParams | undefined;
    callback: TxnCallback<BatchOrderTxnCtx> | undefined;
}): Promise<{
    taskId: string;
    wait: () => Promise<import("lib/transactions/types").TransactionWaiterResult>;
} | {
    transactionHash: any;
    wait: () => Promise<{
        transactionHash: string;
        blockNumber: number | undefined;
        status: string;
    }>;
}>;
export declare const makeBatchOrderSimulation: ({ chainId, signer, isGmxAccount, provider, batchParams, blockTimestampData, tokensData, expressParams, }: {
    chainId: ContractsChainId;
    signer: ISigner;
    isGmxAccount: boolean;
    provider: iRpc;
    batchParams: BatchOrderTxnParams;
    blockTimestampData: BlockTimestampData | undefined;
    tokensData: TokensData;
    expressParams: ExpressTxnParams | undefined;
}) => Promise<void>;
