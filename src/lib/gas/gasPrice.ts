import { withRetry } from "viem";

import {
  ContractsChainId,
  getGasPriceBuffer,
  getGasPricePremium,
  getMaxFeePerGas,
  getMaxPriorityFeePerGas,
} from "configs/chains";
import { bigMath } from "lib/bigmath";
import { extendError } from "lib/errors";
import { emitMetricCounter } from "lib/metrics";
import { BASIS_POINTS_DIVISOR_BIGINT } from "lib/numbers";
import { iRpc } from "lib/rpc/types";

export type GasPriceData =
  | {
      gasPrice: bigint;
    }
  // Avalanche
  | {
      maxFeePerGas: bigint;
      maxPriorityFeePerGas: bigint;
    };

export async function getGasPrice(
  chainId: number,
  rpc: iRpc
): Promise<GasPriceData> {
  try {
    let maxFeePerGas = getMaxFeePerGas(chainId as ContractsChainId);

    const premium: bigint =
      getGasPricePremium(chainId as ContractsChainId) || 0n;

    const feeData = await withRetry(
      () =>
        rpc.estimateFeesPerGas({
          chainId,
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
        },
      }
    );

    const gasPrice = feeData.gasPrice;

    if (maxFeePerGas !== undefined) {
      if (gasPrice !== undefined && gasPrice !== null) {
        maxFeePerGas = bigMath.max(gasPrice, maxFeePerGas);
      }

      // Fetch the latest block to get baseFeePerGas for EIP-1559 fee data
      const block = await rpc.getBlock({ blockTag: "pending" });
      if (block.baseFeePerGas !== undefined && block.baseFeePerGas !== null) {
        const baseFeePerGas = block.baseFeePerGas;

        const maxPriorityFeePerGas = bigMath.max(
          feeData.maxPriorityFeePerGas ?? 0n,
          getMaxPriorityFeePerGas(chainId as ContractsChainId) || 0n
        );

        // Calculate maxFeePerGas
        const calculatedMaxFeePerGas =
          baseFeePerGas + maxPriorityFeePerGas + premium;

        return {
          maxFeePerGas: bigMath.max(maxFeePerGas, calculatedMaxFeePerGas),
          maxPriorityFeePerGas: maxPriorityFeePerGas + premium,
        };
      }
    }

    if (gasPrice === null || gasPrice === undefined) {
      throw new Error("Can't fetch gas price");
    }

    const bufferBps: bigint =
      getGasPriceBuffer(chainId as ContractsChainId) || 0n;

    const buffer = bigMath.mulDiv(
      gasPrice,
      bufferBps,
      BASIS_POINTS_DIVISOR_BIGINT
    );

    return {
      gasPrice: gasPrice + buffer + premium,
    };
  } catch (error: any) {
    throw extendError(error, {
      errorContext: "gasPrice",
    });
  }
}
