import { Address } from "viem";
import type { ContractsChainId, SourceChainId } from "../../configs/chains.js";
import { ExternalSwapQuote } from "../../domain/externalSwap/types.js";
import { MarketsInfoData } from "../../domain/markets/types.js";
import { FindSwapPath } from "../../domain/swap/types.js";
import type { SignedTokenPermit, TokenData } from "../../domain/tokens/types.js";
import { ExternalCallsPayload } from "../batch/payloads/orderTransactions.js";
import type { GasPaymentParams, RawRelayParamsPayload, RelayFeePayload, RelayParamsPayload } from "./types.js";
import type { SignatureDomain } from "./utils.js";
export declare function getExpressContractAddress(chainId: ContractsChainId, { isSubaccount, isMultichain, scope, }: {
    isSubaccount?: boolean;
    isMultichain?: boolean;
    scope?: "glv" | "gm" | "transfer" | "claims" | "order" | "subaccount";
}): Address;
export declare function getGelatoRelayRouterDomain(chainId: SourceChainId | ContractsChainId, relayRouterAddress: string): SignatureDomain;
export declare function getRelayerFeeParams({ chainId, account, gasPaymentToken, relayerFeeToken, relayerFeeAmount, totalRelayerFeeTokenAmount, gasPaymentTokenAsCollateralAmount, transactionExternalCalls, feeExternalSwapQuote, findFeeSwapPath, }: {
    chainId: ContractsChainId;
    account: string;
    relayerFeeAmount: bigint;
    totalRelayerFeeTokenAmount: bigint;
    relayerFeeToken: TokenData;
    gasPaymentToken: TokenData;
    gasPaymentTokenAsCollateralAmount: bigint;
    findFeeSwapPath: FindSwapPath | undefined;
    feeExternalSwapQuote: ExternalSwapQuote | undefined;
    /**
     * If transaction contains an external calls e.g. for collateral external swaps,
     * it should also be included in relayParams
     */
    transactionExternalCalls: ExternalCallsPayload | undefined;
}): {
    feeParams: RelayFeePayload;
    externalCalls: ExternalCallsPayload;
    feeExternalSwapGasLimit: bigint;
    gasPaymentParams: GasPaymentParams;
} | undefined;
export declare function getRawRelayerParams({ chainId, gasPaymentTokenAddress, relayerFeeTokenAddress, feeParams, externalCalls, tokenPermits, marketsInfoData, }: {
    chainId: ContractsChainId;
    gasPaymentTokenAddress: string;
    relayerFeeTokenAddress: string;
    feeParams: RelayFeePayload;
    externalCalls: ExternalCallsPayload;
    tokenPermits: SignedTokenPermit[];
    marketsInfoData: MarketsInfoData;
}): RawRelayParamsPayload;
export declare function hashRelayParams(relayParams: RelayParamsPayload): string;
