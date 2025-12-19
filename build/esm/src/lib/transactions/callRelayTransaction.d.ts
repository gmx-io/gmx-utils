import { ContractsChainId } from "../../configs/chains.js";
import { iRpc } from "../rpc/types.js";
export declare function callRelayTransaction({ chainId, calldata, gelatoRelayFeeToken, gelatoRelayFeeAmount, rpc, relayRouterAddress, }: {
    chainId: ContractsChainId;
    calldata: string;
    gelatoRelayFeeToken: string;
    gelatoRelayFeeAmount: bigint;
    rpc: iRpc;
    relayRouterAddress: string;
}): Promise<string>;
