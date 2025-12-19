import type { ContractsChainId } from "configs/chains";
import { MarketsInfoData } from "domain/markets/types";
import { ExternalCallsPayload } from "transactions/batch/payloads/orderTransactions";
export declare function getOracleParams({ chainId, tokenAddresses, }: {
    chainId: ContractsChainId;
    tokenAddresses: string[];
}): {
    tokens: import("domain/tokens/types").ERC20Address[];
    providers: any[];
    data: any[];
};
export declare function getOracleParamsForRelayParams({ chainId, gasPaymentTokenAddress, relayerFeeTokenAddress, feeSwapPath, externalCalls, marketsInfoData, }: {
    chainId: ContractsChainId;
    gasPaymentTokenAddress: string;
    relayerFeeTokenAddress: string;
    feeSwapPath: string[];
    externalCalls: ExternalCallsPayload | undefined;
    marketsInfoData: MarketsInfoData;
}): {
    tokens: import("domain/tokens/types").ERC20Address[];
    providers: any[];
    data: any[];
};
export declare function getSwapPathOracleTokens({ marketsInfoData, initialCollateralAddress, swapPath, }: {
    marketsInfoData: MarketsInfoData;
    initialCollateralAddress: string;
    swapPath: string[];
}): string[];
