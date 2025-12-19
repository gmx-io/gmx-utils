import { ContractsChainId } from "configs/chains";
import { iRpc } from "lib/rpc/types";
export declare function callRelayTransaction({ chainId, calldata, gelatoRelayFeeToken, gelatoRelayFeeAmount, rpc, relayRouterAddress, }: {
    chainId: ContractsChainId;
    calldata: string;
    gelatoRelayFeeToken: string;
    gelatoRelayFeeAmount: bigint;
    rpc: iRpc;
    relayRouterAddress: string;
}): Promise<string>;
