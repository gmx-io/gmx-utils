import { basisPointsToFloat } from "lib/numbers";

import type { UserReferralInfo } from "./types";

export function getUserReferralInfo(p: {
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
}): UserReferralInfo | undefined {
  const {
    userReferralCode,
    userReferralCodeString,
    referralCodeForTxn,
    attachedOnChain,
    codeOwner,
    tierId,
    totalRebate,
    discountShare,
    customDiscountShare,
    error,
  } = p;

  if (
    !userReferralCode ||
    !userReferralCodeString ||
    !codeOwner ||
    tierId === undefined ||
    totalRebate === undefined ||
    discountShare === undefined ||
    !referralCodeForTxn
  ) {
    return undefined;
  }

  const finalDiscountShare = (customDiscountShare ?? 0n) > 0n ? customDiscountShare! : discountShare;

  return {
    userReferralCode,
    userReferralCodeString,
    referralCodeForTxn,
    attachedOnChain,
    affiliate: codeOwner,
    tierId,
    totalRebate,
    totalRebateFactor: basisPointsToFloat(totalRebate),
    discountShare: finalDiscountShare,
    discountFactor: basisPointsToFloat(finalDiscountShare),
    error,
  };
}









