import { ErrorLike } from "lib/errors";
export type TransactionWaiterResult = {
    relayStatus: {
        taskId: string;
        taskState: TaskState;
    } | undefined;
    transactionHash: string | undefined;
    blockNumber: number | undefined;
    status: "success" | "failed";
};
export type GelatoTaskStatus = {
    chainId: number;
    taskId: string;
    taskState: TaskState;
    creationDate: string;
    lastCheckDate?: string;
    lastCheckMessage?: string;
    transactionHash?: string;
    blockNumber?: number;
    executionDate?: string;
    gasUsed?: string;
    effectiveGasPrice?: string;
};
export type TransactionStatusResponse = {
    chainId: number;
    taskId: string;
    taskState: TaskState;
    creationDate: string;
    lastCheckDate?: string;
    lastCheckMessage?: string;
    transactionHash?: string;
    blockNumber?: number;
    executionDate?: string;
    gasUsed?: string;
    effectiveGasPrice?: string;
};
export declare enum TaskState {
    CheckPending = "CheckPending",
    ExecPending = "ExecPending",
    WaitingForConfirmation = "WaitingForConfirmation",
    ExecSuccess = "ExecSuccess",
    ExecReverted = "ExecReverted",
    Cancelled = "Cancelled"
}
export declare enum TxnEventName {
    Submitted = "Submitted",
    Simulated = "Simulated",
    Sending = "Sending",
    Sent = "Sent",
    Error = "Error"
}
export type TxnCallback<TParams> = (event: TxnEvent<TParams>) => void;
export type TxnEvent<TParams> = ReturnType<TxnEventBuilder<TParams>[TxnEventName]>;
export declare class TxnEventBuilder<TParams> {
    ctx: TParams;
    constructor(ctx: TParams);
    _build<TName extends TxnEventName, TData>(name: TName, eventData: TData): {
        event: TName;
        data: TParams & TData;
    };
    extend<TExtend>(event: TxnEvent<TExtend>): TxnEvent<TExtend & TParams>;
    Error(error: ErrorLike): {
        event: TxnEventName.Error;
        data: TParams & {
            error: ErrorLike;
        };
    };
    Submitted(): {
        event: TxnEventName.Submitted;
        data: TParams & {};
    };
    Simulated(): {
        event: TxnEventName.Simulated;
        data: TParams & {};
    };
    Sending(): {
        event: TxnEventName.Sending;
        data: TParams & {};
    };
    Sent(params: {
        type: "wallet";
        transactionHash: string;
    } | {
        type: "relay";
        relayTaskId: string;
    }): {
        event: TxnEventName.Sent;
        data: TParams & ({
            type: "wallet";
            transactionHash: string;
        } | {
            type: "relay";
            relayTaskId: string;
        });
    };
}
