import { TypedDataEncoder } from 'ethers.js';

// src/lib/signing/signing.ts
async function signTypedData({
  signer,
  domain,
  types,
  typedData,
  shouldUseSignerMethod = false,
  minified = true
}) {
  for (const [key, value] of Object.entries(domain)) {
    if (value === void 0) {
      delete domain[key];
    }
  }
  for (const [key, value] of Object.entries(types)) {
    if (value === void 0) {
      delete types[key];
    }
  }
  for (const [key, value] of Object.entries(typedData)) {
    if (value === void 0) {
      delete typedData[key];
    }
  }
  let typesToSign = types;
  let messageToSign = typedData;
  if (minified) {
    const digest = TypedDataEncoder.hash(domain, types, typedData);
    const minifiedTypes = {
      Minified: [{ name: "digest", type: "bytes32" }]
    };
    typesToSign = minifiedTypes;
    messageToSign = {
      digest
    };
  }
  if (shouldUseSignerMethod && signer.signTypedData) {
    try {
      return await signer.signTypedData(domain, typesToSign, messageToSign);
    } catch (e) {
      if (e.message.includes("requires a provider")) ; else {
        throw e;
      }
    }
  }
  return "0x1234567890";
}
function splitSignature(signature) {
  const sig = signature.slice(2);
  const r = "0x" + sig.substring(0, 64);
  const s = "0x" + sig.substring(64, 128);
  const v = parseInt(sig.substring(128, 130), 16);
  return { r, s, v };
}

export { signTypedData, splitSignature };
//# sourceMappingURL=signing.js.map
//# sourceMappingURL=signing.js.map