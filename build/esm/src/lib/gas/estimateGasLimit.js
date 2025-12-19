import * as parseError_star from './parseError.js';
import * as transactionsErrors_star from './transactionsErrors.js';

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget);

// src/lib/errors/index.ts
var errors_exports = {};
__reExport(errors_exports, parseError_star);
__reExport(errors_exports, transactionsErrors_star);

// src/lib/gas/estimateGasLimit.ts
var MIN_GAS_LIMIT = 22000n;
async function estimateGasLimit(rpc, txnParams) {
  try {
    const gasLimit = await rpc.estimateGas({
      from: txnParams.from,
      to: txnParams.to,
      data: txnParams.data,
      value: txnParams.value
    });
    return applyGasLimitBuffer(gasLimit);
  } catch (error) {
    try {
      await rpc.ethCall({
        from: txnParams.from,
        to: txnParams.to,
        data: txnParams.data,
        value: txnParams.value
      });
      throw error;
    } catch (innerError) {
      throw (0, errors_exports.extendError)(innerError, {
        errorContext: "gasLimit"
      });
    }
  }
}
function applyGasLimitBuffer(gasLimit) {
  if (gasLimit < MIN_GAS_LIMIT) {
    gasLimit = MIN_GAS_LIMIT;
  }
  return gasLimit * 11n / 10n;
}

export { applyGasLimitBuffer, estimateGasLimit };
//# sourceMappingURL=estimateGasLimit.js.map
//# sourceMappingURL=estimateGasLimit.js.map