import { getContract } from '../../configs/contracts.js';
import { getToken, convertTokenAddress } from '../../configs/tokens.js';
import { buildUrl } from '../../lib/buildUrl.js';
import { formatTokenAmount, numberToBigint, USD_DECIMALS } from '../../lib/numbers/index.js';

async function getOpenOceanTxnData({
  chainId,
  tokenInAddress,
  tokenOutAddress,
  amountIn,
  senderAddress,
  receiverAddress,
  gasPrice,
  slippage,
  openOceanUrl,
  openOceanReferrer,
  disabledDexIds = [],
  onError
}) {
  const tokenIn = getToken(chainId, tokenInAddress);
  const gweiGasPrice = formatTokenAmount(gasPrice, 18 - 9, void 0, {
    displayDecimals: 8
  });
  const url = buildUrl(openOceanUrl, "/swap_quote", {
    inTokenAddress: convertTokenAddress(chainId, tokenInAddress, "wrapped"),
    outTokenAddress: convertTokenAddress(chainId, tokenOutAddress, "wrapped"),
    amount: formatTokenAmount(amountIn, tokenIn.decimals, void 0, {
      showAllSignificant: true,
      isStable: tokenIn.isStable
    }),
    gasPrice: gweiGasPrice,
    slippage: (slippage / 100).toString(),
    sender: senderAddress,
    account: receiverAddress,
    referrer: openOceanReferrer,
    disabledDexIds: disabledDexIds.join(","),
    disableRfq: true
  });
  try {
    const res = await fetch(url);
    if (res.status === 403) {
      throw new Error(`IP is banned ${await res.text()}`);
    }
    const parsed = await res.json();
    if (!parsed.data || parsed.code !== 200) {
      throw new Error(
        `Failed to build transaction: ${parsed.code} ${parsed.error}`
      );
    }
    if (parsed.data.to !== getContract(chainId, "OpenOceanRouter")) {
      throw new Error(`Invalid OpenOceanRouter address: ${parsed.data.to}`);
    }
    return {
      to: parsed.data.to,
      data: parsed.data.data,
      value: BigInt(parsed.data.value),
      estimatedGas: BigInt(parsed.data.estimatedGas),
      usdIn: numberToBigint(
        parseFloat(parsed.data.inToken.volume),
        USD_DECIMALS
      ),
      usdOut: numberToBigint(
        parseFloat(parsed.data.outToken.volume),
        USD_DECIMALS
      ),
      priceIn: numberToBigint(
        parseFloat(parsed.data.inToken.usd),
        USD_DECIMALS
      ),
      priceOut: numberToBigint(
        parseFloat(parsed.data.outToken.usd),
        USD_DECIMALS
      ),
      gasPrice: BigInt(parsed.data.gasPrice),
      amountIn,
      outputAmount: BigInt(parsed.data.minOutAmount)
    };
  } catch (e) {
    const error = e;
    error.message += ` URL: ${url.replace(receiverAddress, "...")}`;
    if (onError) {
      onError(error, url);
    }
    return void 0;
  }
}

export { getOpenOceanTxnData };
//# sourceMappingURL=openOcean.js.map
//# sourceMappingURL=openOcean.js.map