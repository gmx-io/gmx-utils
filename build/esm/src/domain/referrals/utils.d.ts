import type { UserReferralInfo } from "./types";
export declare function getUserReferralInfo(p: {
    userReferralCode: string | undefined;
    userReferralCodeString: string | undefined;
    referralCodeForTxn: string | undefined;
    attachedOnChain: boolean;
    codeOwner: string | undefined;
    tierId: number | undefined;
    totalRebate: bigint | undefined;
    discountShare: bigint | undefined;
    customDiscountShare?: bigint | undefined;
    error?: Error;
}): UserReferralInfo | undefined;
