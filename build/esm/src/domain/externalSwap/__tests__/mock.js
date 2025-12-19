import 'viem';
import '../bigmath/index.js';

// src/lib/numbers/index.ts
var USD_DECIMALS = 30;
var PRECISION_DECIMALS = 30;
expandDecimals(1, PRECISION_DECIMALS);
BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
function expandDecimals(n, decimals) {
  return BigInt(n) * 10n ** BigInt(decimals);
}

// src/domain/externalSwap/__tests__/mock.ts
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
    aggregator: "openOcean" /* OpenOcean */,
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