import { ExternalSwapAggregator } from '../../externalSwap/types.js';
import { expandDecimals, USD_DECIMALS } from '../../../lib/numbers/index.js';

function mockExternalSwap({
  inToken,
  outToken,
  amountIn,
  amountOut,
  priceIn,
  priceOut,
  feesUsd = expandDecimals(5, USD_DECIMALS),
  data = "0x1",
  to = "0x6352a56caadC4F1E25CD6c75970Fa768A3304e64",
  receiver = "0x1234567890123456789012345678901234567890"
}) {
  const usdIn = amountIn * priceIn / expandDecimals(1, inToken.decimals);
  const usdOut = amountOut * priceOut / expandDecimals(1, outToken.decimals);
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
      estimatedExecutionFee: 100000n
    }
  };
}

export { mockExternalSwap };
//# sourceMappingURL=mock.js.map
//# sourceMappingURL=mock.js.map