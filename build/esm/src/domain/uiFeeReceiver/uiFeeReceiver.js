import { isAddress } from 'viem';

// src/domain/uiFeeReceiver/uiFeeReceiver.ts
var VERSION = "01";
var PREFIX = "0xff0000";
function generateTwapId() {
  return Math.floor(Math.random() * 256 * 256).toString(16).padStart(4, "0");
}
function createTwapUiFeeReceiver({
  numberOfParts
}) {
  const twapId = generateTwapId();
  const numberOfPartsInHex = numberOfParts.toString(16).padStart(2, "0");
  const buffer = "00".repeat(12);
  const isExpressHex = "00";
  return `${PREFIX}${buffer}${isExpressHex}${numberOfPartsInHex}${twapId}${VERSION}`;
}
function decodeTwapUiFeeReceiver(address) {
  const byteString = address.slice(2);
  const twapId = byteString.slice(34, 38);
  const isExpress = byteString.slice(30, 32) === "01";
  if (!isValidTwapUiFeeReceiver(address) || twapId === "0000") {
    return;
  }
  const numberOfParts = parseInt(byteString.slice(32, 34), 16);
  return { twapId, numberOfParts, isExpress };
}
function isValidTwapUiFeeReceiver(address) {
  return isAddress(address) && address.toLowerCase().startsWith(PREFIX.toLowerCase());
}
function setUiFeeReceiverIsExpress(uiFeeReceiver, isExpress) {
  const isExpressInHex = isExpress ? "01" : "00";
  return `${uiFeeReceiver.slice(
    0,
    16 * 2
  )}${isExpressInHex}${uiFeeReceiver.slice(17 * 2)}`;
}

export { createTwapUiFeeReceiver, decodeTwapUiFeeReceiver, generateTwapId, isValidTwapUiFeeReceiver, setUiFeeReceiverIsExpress };
//# sourceMappingURL=uiFeeReceiver.js.map
//# sourceMappingURL=uiFeeReceiver.js.map