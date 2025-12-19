import 'viem';
import '../bigmath/index.js';

// src/lib/numbers/index.ts
var BASIS_POINTS_DIVISOR_BIGINT = 10000n;
var PRECISION_DECIMALS = 30;
var PRECISION = expandDecimals(1, PRECISION_DECIMALS);
BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
function expandDecimals(n, decimals) {
  return BigInt(n) * 10n ** BigInt(decimals);
}
function basisPointsToFloat(basisPoints) {
  return basisPoints * PRECISION / BASIS_POINTS_DIVISOR_BIGINT;
}

// src/domain/referrals/utils.ts
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