import type { Address } from "viem";

import { extendError } from "lib/errors";
import { iRpc } from "lib/rpc/types";

const MIN_GAS_LIMIT = 22000n;

export async function estimateGasLimit(
  rpc: iRpc,
  txnParams: {
    to: Address;
    data: string;
    from: string;
    value?: bigint;
  }
): Promise<bigint> {
  try {
    const gasLimit = await rpc.estimateGas({
      from: txnParams.from,
      to: txnParams.to,
      data: txnParams.data,
      value: txnParams.value,
    });
    return applyGasLimitBuffer(gasLimit);
  } catch (error: any) {
    try {
      // this call should throw another error instead of the `error`
      await rpc.ethCall({
        from: txnParams.from,
        to: txnParams.to,
        data: txnParams.data,
        value: txnParams.value,
      });

      // if not we throw estimateGas error
      throw error;
    } catch (innerError: any) {
      throw extendError(innerError, {
        errorContext: "gasLimit",
      });
    }
  }
}

export function applyGasLimitBuffer(gasLimit: bigint): bigint {
  if (gasLimit < MIN_GAS_LIMIT) {
    gasLimit = MIN_GAS_LIMIT;
  }

  return (gasLimit * 11n) / 10n; // add a 10% buffer
}
