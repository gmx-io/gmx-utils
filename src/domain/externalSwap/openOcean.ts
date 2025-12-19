import { ContractsChainId } from "configs/chains";
import { getContract } from "configs/contracts";
import { convertTokenAddress, getToken } from "configs/tokens";
import { buildUrl } from "lib/buildUrl";
import { formatTokenAmount, numberToBigint, USD_DECIMALS } from "lib/numbers";

type OpenOceanTxnResponse = {
  code: number;
  error?: string;
  data?: {
    inToken: {
      address: string;
      decimals: number;
      symbol: string;
      name: string;
      usd: string;
      volume: string;
    };
    outToken: {
      address: string;
      decimals: number;
      symbol: string;
      name: string;
      usd: string;
      volume: string;
    };
    inAmount: string;
    outAmount: string;
    minOutAmount: string;
    estimatedGas: string;
    value: string;
    gasPrice: string;
    to: string;
    data: string;
    price_impact: string;
  };
};

export type OpenOceanQuote = {
  to: string;
  data: string;
  value: bigint;
  estimatedGas: bigint;
  usdIn: bigint;
  usdOut: bigint;
  priceIn: bigint;
  priceOut: bigint;
  gasPrice: bigint;
  amountIn: bigint;
  outputAmount: bigint;
};

export async function getOpenOceanTxnData({
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
  onError,
}: {
  senderAddress: string;
  receiverAddress: string;
  chainId: ContractsChainId;
  tokenInAddress: string;
  tokenOutAddress: string;
  amountIn: bigint;
  gasPrice: bigint;
  slippage: number;
  openOceanUrl: string;
  disabledDexIds?: number[];
  openOceanReferrer?: string;
  onError?: (error: Error, url: string) => void;
}): Promise<OpenOceanQuote | undefined> {
  const tokenIn = getToken(chainId, tokenInAddress);

  const gweiGasPrice = formatTokenAmount(gasPrice, 18 - 9, undefined, {
    displayDecimals: 8,
  });

  const url = buildUrl(openOceanUrl, "/swap_quote", {
    inTokenAddress: convertTokenAddress(chainId, tokenInAddress, "wrapped"),
    outTokenAddress: convertTokenAddress(chainId, tokenOutAddress, "wrapped"),
    amount: formatTokenAmount(amountIn, tokenIn.decimals, undefined, {
      showAllSignificant: true,
      isStable: tokenIn.isStable,
    }),
    gasPrice: gweiGasPrice,
    slippage: (slippage / 100).toString(),
    sender: senderAddress,
    account: receiverAddress,
    referrer: openOceanReferrer,
    disabledDexIds: disabledDexIds.join(","),
    disableRfq: true,
  });

  try {
    const res = await fetch(url);

    if (res.status === 403) {
      throw new Error(`IP is banned ${await res.text()}`);
    }

    const parsed = (await res.json()) as OpenOceanTxnResponse;

    if (!parsed.data || parsed.code !== 200) {
      throw new Error(
        `Failed to build transaction: ${parsed.code} ${parsed.error}`
      );
    }

    if (parsed.data.to !== getContract(chainId, "OpenOceanRouter")) {
      throw new Error(`Invalid OpenOceanRouter address: ${parsed.data.to}`);
    }

    return {
      to: parsed.data.to as string,
      data: parsed.data.data as string,
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
      outputAmount: BigInt(parsed.data.minOutAmount),
    };
  } catch (e) {
    const error = e as Error;
    error.message += ` URL: ${url.replace(receiverAddress, "...")}`;
    if (onError) {
      onError(error, url);
    }
    return undefined;
  }
}
