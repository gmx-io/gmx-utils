import type { Abi, Address, PublicClient } from "viem";
export interface GmxSdkLike {
    chainId: number;
    publicClient?: PublicClient;
    config?: {
        settings?: {
            uiFeeReceiverAccount?: string;
        };
    };
    markets?: {
        getMarketsInfo(): Promise<{
            marketsInfoData: any;
            tokensData: any;
        }>;
    };
    orders?: {
        createIncreaseOrder(params: any): Promise<any>;
        createSwapOrder(params: any): Promise<any>;
    };
    utils?: {
        getUiFeeFactor(): Promise<bigint>;
        getGasPrice(): Promise<bigint>;
        getGasLimits(): Promise<any>;
    };
    callContract?(contractAddress: Address, abi: Abi, functionName: string, args: any[], options?: {
        value?: bigint;
    }): Promise<any>;
}
