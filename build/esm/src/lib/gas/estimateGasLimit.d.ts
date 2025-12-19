import type { Address } from "viem";
import { iRpc } from "lib/rpc/types";
export declare function estimateGasLimit(rpc: iRpc, txnParams: {
    to: Address;
    data: string;
    from: string;
    value?: bigint;
}): Promise<bigint>;
export declare function applyGasLimitBuffer(gasLimit: bigint): bigint;
