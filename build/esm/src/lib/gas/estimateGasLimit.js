import { extendError } from '../errors/index.js';

const MIN_GAS_LIMIT = 22000n;
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
      throw extendError(innerError, {
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