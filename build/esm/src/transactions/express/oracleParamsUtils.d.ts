import type { ContractsChainId } from "../../configs/chains.js";
import { MarketsInfoData } from "../../domain/markets/types.js";
import { ExternalCallsPayload } from "../batch/payloads/orderTransactions.js";
export declare function getOracleParams({ chainId, tokenAddresses, }: {
    chainId: ContractsChainId;
    tokenAddresses: string[];
}): {
    tokens: import("../../domain/tokens/types.js").ERC20Address[];
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
    tokens: import("../../domain/tokens/types.js").ERC20Address[];
    providers: any[];
    data: any[];
};
export declare function getSwapPathOracleTokens({ marketsInfoData, initialCollateralAddress, swapPath, }: {
    marketsInfoData: MarketsInfoData;
    initialCollateralAddress: string;
    swapPath: string[];
}): string[];
