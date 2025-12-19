import {
  ExternalSwapAggregator,
  ExternalSwapQuote,
} from "domain/externalSwap/types";
import { Token } from "domain/tokens/types";
import { USD_DECIMALS } from "lib/numbers";
import { expandDecimals } from "lib/numbers";

export function mockExternalSwap({
  inToken,
  outToken,
  amountIn,
  amountOut,
  priceIn,
  priceOut,
  feesUsd = expandDecimals(5, USD_DECIMALS),
  data = "0x1",
  to = "0x6352a56caadC4F1E25CD6c75970Fa768A3304e64",
  receiver = "0x1234567890123456789012345678901234567890",
}: {
  inToken: Token;
  outToken: Token;
  amountIn: bigint;
  amountOut: bigint;
  priceIn: bigint;
  priceOut: bigint;
  feesUsd?: bigint;
  data?: string;
  to?: string;
  receiver?: string;
}): ExternalSwapQuote {
  const usdIn = (amountIn * priceIn) / expandDecimals(1, inToken.decimals);
  const usdOut = (amountOut * priceOut) / expandDecimals(1, outToken.decimals);

  return {
    aggregator: ExternalSwapAggregator.OpenOcean,
    inTokenAddress: inToken.address,
    outTokenAddress: outToken.address,
    receiver,
    usdIn,
    usdOut,
    amountIn,
    amountOut,
    priceIn,
    priceOut,
    feesUsd,
    txnData: {
      to,
      data,
      value: 0n,
      estimatedGas: 100000n,
      estimatedExecutionFee: 100000n,
    },
  };
}
