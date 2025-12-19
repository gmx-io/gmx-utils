import { type PublicClient } from "viem";
import type { AnyChainId, ContractsChainId } from "../../configs/chains.js";
import type { SignedSubaccountApproval, Subaccount, SubaccountApproval, SubaccountOnchainData, SubaccountValidations } from "./types.js";
export declare function getSubaccountValidations({ requiredActions, subaccount, subaccountRouterAddress, }: {
    requiredActions: number;
    subaccount: Subaccount;
    subaccountRouterAddress: string;
}): SubaccountValidations;
export declare function getMaxSubaccountActions(subaccount: {
    onchainData: SubaccountOnchainData;
    signedApproval: SignedSubaccountApproval | undefined;
}): bigint;
export declare function getSubaccountExpiresAt(subaccount: {
    onchainData: SubaccountOnchainData;
    signedApproval: SignedSubaccountApproval | undefined;
}): bigint;
export declare function getRemainingSubaccountActions(subaccount: {
    onchainData: SubaccountOnchainData;
    signedApproval: SignedSubaccountApproval | undefined;
}): bigint;
export declare function getIsApprovalDeadlineExpired(approval: SubaccountApproval): boolean;
export declare function getIsSubaccountActionsExceeded(subaccount: Subaccount, requiredActions: number): boolean;
export declare function getRemainingSubaccountSeconds(subaccount: Subaccount): bigint;
export declare function getIsApprovalExpired(subaccount: Subaccount): boolean;
export declare function getIsSubaccountNonceExpired({ chainId, onchainData, signedApproval, }: {
    chainId: ContractsChainId;
    onchainData: SubaccountOnchainData;
    signedApproval: SignedSubaccountApproval;
}): boolean;
export declare function getIsSubaccountApprovalInvalid({ chainId, signerChainId, signedApproval, onchainData, subaccountRouterAddress, }: {
    chainId: ContractsChainId;
    signerChainId: AnyChainId;
    signedApproval: SignedSubaccountApproval;
    onchainData: SubaccountOnchainData;
    subaccountRouterAddress: string;
}): boolean;
export declare function getIsSubaccountExpired(subaccount: Subaccount): boolean;
export declare function getIsInvalidSubaccount({ subaccount, requiredActions, subaccountRouterAddress, }: {
    subaccount: Subaccount;
    requiredActions: number;
    subaccountRouterAddress: string;
}): boolean;
export declare function getEmptySubaccountApproval(chainId: ContractsChainId, subaccountAddress: string): SignedSubaccountApproval;
export declare function getIsEmptySubaccountApproval(subaccountApproval: SignedSubaccountApproval): boolean;
export declare function hashSubaccountApproval(subaccountApproval: SignedSubaccountApproval): string;
export declare function getIsSubaccountApprovalSynced(params: {
    chainId: ContractsChainId;
    signedApproval: SignedSubaccountApproval;
    onchainData: SubaccountOnchainData;
}): boolean;
export declare function getSubaccountOnchainData({ chainId, signer, publicClient, subaccountAddress, }: {
    chainId: ContractsChainId;
    signer: {
        address: string;
    };
    publicClient: PublicClient;
    subaccountAddress: string;
}): Promise<SubaccountOnchainData>;
