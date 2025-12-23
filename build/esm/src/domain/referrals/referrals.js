import { zeroHash, padHex, stringToHex } from 'viem';
import { hexToBytes, bytesToString } from 'viem/utils';

const MAX_REFERRAL_CODE_LENGTH = 20;
function decodeReferralCode(hexCode) {
  if (!hexCode || hexCode === zeroHash) {
    return "";
  }
  try {
    const bytes = hexToBytes(hexCode);
    if (bytes.length !== 32) throw new Error();
    return bytesToString(bytes).replace(/\0+$/, "");
  } catch (ex) {
    let code = "";
    const cleaned = hexCode.substring(2);
    for (let i = 0; i < 32; i++) {
      code += String.fromCharCode(parseInt(cleaned.substring(i * 2, i * 2 + 2), 16));
    }
    return code.trim();
  }
}
function encodeReferralCode(code) {
  let final = code.replace(/[^\w_]/g, "");
  if (final.length > MAX_REFERRAL_CODE_LENGTH) {
    return zeroHash;
  }
  return padHex(stringToHex(final), { size: 32, dir: "right" });
}

export { MAX_REFERRAL_CODE_LENGTH, decodeReferralCode, encodeReferralCode };
//# sourceMappingURL=referrals.js.map
//# sourceMappingURL=referrals.js.map