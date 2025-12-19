import type { ContractsChainId, SettlementChainId, SourceChainId } from "../../configs/chains.js";
import type { SignedSubaccountApproval, Subaccount } from "../../domain/subaccount/types.js";
import type { SignedTokenPermit, TokenData, TokensAllowanceData } from "../../domain/tokens/types.js";
import { iRpc } from "../../lib/rpc/types.js";
import { ISigner } from "../../lib/signing/signing.js";
import { ExpressTxnData } from "../../lib/transactions/sendExpressTransaction.js";
import { type BatchOrderTxnParams } from "../batch/payloads/orderTransactions.js";
import type { ExpressParamsEstimationMethod, ExpressTransactionEstimatorParams, ExpressTxnParams, GasPaymentValidations, GlobalExpressParams, RawRelayParamsPayload, RelayParamsPayload } from "./types.js";
import { type SignatureDomain } from "./utils.js";
export type BridgeOutParams = {
    token: string;
    amount: bigint;
    minAmountOut: bigint;
    provider: string;
    data: string;
};
export type SignTypedDataParams = {
    signer: ISigner;
    domain: SignatureDomain;
    types: Record<string, any>;
    typedData: Record<string, any>;
    shouldUseSignerMethod?: boolean;
};
export declare function estimateBatchExpressParams({ signer, provider, chainId, batchParams, isGmxAccount, globalExpressParams, requireValidations, estimationMethod, subaccount, }: {
    chainId: ContractsChainId;
    isGmxAccount: boolean;
    signer: ISigner;
    provider: iRpc;
    batchParams: BatchOrderTxnParams;
    globalExpressParams: GlobalExpressParams | undefined;
    estimationMethod: ExpressParamsEstimationMethod;
    requireValidations: boolean;
    subaccount: Subaccount | undefined;
}): Promise<ExpressTxnParams | undefined>;
export declare function estimateExpressParams({ chainId, isGmxAccount, provider, transactionParams, globalExpressParams, estimationMethod, requireValidations, subaccount: rawSubaccount, }: {
    chainId: ContractsChainId;
    isGmxAccount: boolean;
    provider: iRpc;
    globalExpressParams: GlobalExpressParams;
    transactionParams: ExpressTransactionEstimatorParams;
    estimationMethod: "approximate" | "estimateGas";
    requireValidations: boolean;
    subaccount: Subaccount | undefined;
}): Promise<ExpressTxnParams | undefined>;
export declare function getIsValidExpressParams({ chainId, gasPaymentValidations, isSponsoredCall, }: {
    chainId: number;
    isSponsoredCall: boolean;
    gasPaymentValidations: GasPaymentValidations;
}): boolean;
export declare function getGasPaymentValidations({ gasPaymentToken, gasPaymentTokenAmount, gasPaymentTokenAsCollateralAmount, gasPaymentAllowanceData, tokenPermits, isGmxAccount, }: {
    gasPaymentToken: TokenData;
    gasPaymentTokenAmount: bigint;
    gasPaymentTokenAsCollateralAmount: bigint;
    gasPaymentAllowanceData: TokensAllowanceData;
    tokenPermits: SignedTokenPermit[];
    isGmxAccount: boolean;
}): GasPaymentValidations;
export declare function buildAndSignExpressBatchOrderTxn({ chainId, batchParams, relayParamsPayload, relayerFeeTokenAddress, relayerFeeAmount, subaccount, signer, isGmxAccount, emptySignature, }: {
    signer: ISigner;
    chainId: ContractsChainId;
    batchParams: BatchOrderTxnParams;
    relayerFeeTokenAddress: string;
    relayerFeeAmount: bigint;
    relayParamsPayload: RawRelayParamsPayload;
    isGmxAccount: boolean;
    subaccount: Subaccount | undefined;
    emptySignature?: boolean;
}): Promise<ExpressTxnData>;
export declare function getBatchSignatureParams({ signer, relayParams, batchParams, chainId, account, subaccountApproval, relayRouterAddress, }: {
    account: string;
    subaccountApproval: SignedSubaccountApproval | undefined;
    signer: ISigner;
    relayParams: RelayParamsPayload | RelayParamsPayload;
    batchParams: BatchOrderTxnParams;
    chainId: ContractsChainId;
    relayRouterAddress: string;
}): Promise<SignTypedDataParams>;
export declare function getMultichainInfoFromSigner(signer: ISigner, chainId: ContractsChainId): Promise<SourceChainId | undefined>;
export declare function getOrderRelayRouterAddress(chainId: ContractsChainId, isSubaccount: boolean, isMultichain: boolean): string;
export declare function buildAndSignBridgeOutTxn({ chainId, srcChainId, relayParamsPayload, params, signer, account, emptySignature, relayerFeeTokenAddress, relayerFeeAmount, }: {
    chainId: SettlementChainId;
    srcChainId: SourceChainId;
    relayParamsPayload: RawRelayParamsPayload;
    params: BridgeOutParams;
    signer: ISigner | undefined;
    account: string;
    emptySignature?: boolean;
    relayerFeeTokenAddress: string;
    relayerFeeAmount: bigint;
}): Promise<ExpressTxnData>;
export declare function buildAndSignSetTraderReferralCodeTxn({ chainId, relayParamsPayload, params, signer, emptySignature, relayerFeeTokenAddress, relayerFeeAmount, }: {
    chainId: SettlementChainId;
    relayParamsPayload: RelayParamsPayload;
    params: BridgeOutParams;
    signer: ISigner;
    emptySignature?: boolean;
    relayerFeeTokenAddress: string;
    relayerFeeAmount: bigint;
}): Promise<ExpressTxnData>;
export declare function signSetTraderReferralCode({ signer, relayParams, referralCode, chainId, srcChainId, shouldUseSignerMethod, }: {
    signer: ISigner;
    relayParams: RelayParamsPayload;
    referralCode: string;
    chainId: ContractsChainId;
    srcChainId: SourceChainId;
    shouldUseSignerMethod?: boolean;
}): Promise<string>;
export declare function validateSignature({ signatureParams, signature, expectedAccount, silent, errorSource, }: {
    signatureParams: {
        domain: SignatureDomain;
        types: Record<string, any>;
        typedData: Record<string, any>;
    };
    signature: string;
    expectedAccount: string;
    silent?: boolean;
    errorSource?: string;
}): Promise<void>;
