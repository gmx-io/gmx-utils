import { Address } from "viem";
import type { ContractsChainId, SourceChainId } from "configs/chains";
import { ExternalSwapQuote } from "domain/externalSwap/types";
import type { MarketsInfoData } from "domain/markets/types";
import type { FindSwapPath } from "domain/swap/types";
import type { SignedTokenPermit, TokenData, TokensAllowanceData } from "domain/tokens/types";
import type { GasPaymentParams, GasPaymentValidations, RawRelayParamsPayload, RelayFeePayload, RelayParamsPayload } from "./types";
import { type ExternalCallsPayload } from "../batch/payloads/orderTransactions";
export declare function getExpressContractAddress(chainId: ContractsChainId, { isSubaccount, isMultichain, scope, }: {
    isSubaccount?: boolean;
    isMultichain?: boolean;
    scope?: "glv" | "gm" | "transfer" | "claims" | "order" | "subaccount";
}): Address;
export type SignatureDomain = {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: Address;
};
export declare function getGelatoRelayRouterDomain(chainId: SourceChainId | ContractsChainId, relayRouterAddress: string): SignatureDomain;
export declare function getOracleParams({ chainId, tokenAddresses, }: {
    chainId: ContractsChainId;
    tokenAddresses: string[];
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
export declare function getNeedTokenApprove(tokenAllowanceData: TokensAllowanceData | undefined, tokenAddress: string | undefined, amountToSpend: bigint | undefined, permits: SignedTokenPermit[]): boolean;
export declare function getGasPaymentValidations({ gasPaymentToken, gasPaymentTokenAmount, gasPaymentTokenAsCollateralAmount, gasPaymentAllowanceData, tokenPermits, isGmxAccount, }: {
    gasPaymentToken: TokenData;
    gasPaymentTokenAmount: bigint;
    gasPaymentTokenAsCollateralAmount: bigint;
    gasPaymentAllowanceData: TokensAllowanceData;
    tokenPermits: SignedTokenPermit[];
    isGmxAccount: boolean;
}): GasPaymentValidations;
export declare function getIsValidExpressParams({ chainId, gasPaymentValidations, isSponsoredCall, }: {
    chainId: number;
    isSponsoredCall: boolean;
    gasPaymentValidations: GasPaymentValidations;
}): boolean;
export declare function getOrderRelayRouterAddress(chainId: ContractsChainId, isSubaccount: boolean, isMultichain: boolean): string;
