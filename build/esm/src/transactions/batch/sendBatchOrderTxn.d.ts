import type { ContractsChainId } from "../../configs/chains.js";
import type { TokensData } from "../../domain/tokens/types.js";
import { iRpc } from "../../lib/rpc/types.js";
import { ISigner } from "../../lib/signing/signing.js";
import { TxnCallback } from "../../lib/transactions/types.js";
import { type BatchOrderTxnParams } from "../batch/payloads/orderTransactions.js";
import type { ExpressTxnParams } from "../express/types.js";
import type { BlockTimestampData } from "../simulation/simulation.js";
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
    wait: () => Promise<import("../../lib/transactions/types.js").TransactionWaiterResult>;
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
