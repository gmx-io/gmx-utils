import { basisPointsToFloat } from '../../lib/numbers/index.js';

function getUserReferralInfo(p) {
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
    error
  } = p;
  if (!userReferralCode || !userReferralCodeString || !codeOwner || tierId === void 0 || totalRebate === void 0 || discountShare === void 0 || !referralCodeForTxn) {
    return void 0;
  }
  const finalDiscountShare = (customDiscountShare ?? 0n) > 0n ? customDiscountShare : discountShare;
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
    error
  };
}

export { getUserReferralInfo };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map