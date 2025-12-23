import { withRetry } from 'viem';
import { getMaxFeePerGas, getGasPricePremium, getMaxPriorityFeePerGas, getGasPriceBuffer } from '../../configs/chains.js';
import { bigMath } from '../bigmath/index.js';
import { extendError } from '../errors/index.js';
import { emitMetricCounter } from '../metrics/index.js';
import { BASIS_POINTS_DIVISOR_BIGINT } from '../numbers/index.js';

async function getGasPrice(chainId, rpc) {
  try {
    let maxFeePerGas = getMaxFeePerGas(chainId);
    const premium = getGasPricePremium(chainId) || 0n;
    const feeData = await withRetry(
      () => rpc.estimateFeesPerGas({
        chainId
      }),
      {
        delay: 200,
        retryCount: 2,
        shouldRetry: ({ error }) => {
          const isInvalidBlockError = error?.message?.includes(
            "invalid value for value.hash"
          );
          if (isInvalidBlockError) {
            emitMetricCounter({ event: "error.getFeeData.value.hash" });
          }
          return isInvalidBlockError;
        }
      }
    );
    const gasPrice = feeData.gasPrice;
    if (maxFeePerGas !== void 0) {
      if (gasPrice !== void 0 && gasPrice !== null) {
        maxFeePerGas = bigMath.max(gasPrice, maxFeePerGas);
      }
      const block = await rpc.getBlock({ blockTag: "pending" });
      if (block.baseFeePerGas !== void 0 && block.baseFeePerGas !== null) {
        const baseFeePerGas = block.baseFeePerGas;
        const maxPriorityFeePerGas = bigMath.max(
          feeData.maxPriorityFeePerGas ?? 0n,
          getMaxPriorityFeePerGas(chainId) || 0n
        );
        const calculatedMaxFeePerGas = baseFeePerGas + maxPriorityFeePerGas + premium;
        return {
          maxFeePerGas: bigMath.max(maxFeePerGas, calculatedMaxFeePerGas),
          maxPriorityFeePerGas: maxPriorityFeePerGas + premium
        };
      }
    }
    if (gasPrice === null || gasPrice === void 0) {
      throw new Error("Can't fetch gas price");
    }
    const bufferBps = getGasPriceBuffer(chainId) || 0n;
    const buffer = bigMath.mulDiv(
      gasPrice,
      bufferBps,
      BASIS_POINTS_DIVISOR_BIGINT
    );
    return {
      gasPrice: gasPrice + buffer + premium
    };
  } catch (error) {
    throw extendError(error, {
      errorContext: "gasPrice"
    });
  }
}

export { getGasPrice };
//# sourceMappingURL=gasPrice.js.map
//# sourceMappingURL=gasPrice.js.map