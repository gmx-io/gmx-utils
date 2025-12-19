import uniq from "lodash/uniq";

import type { ContractsChainId } from "configs/chains";
import { getContract } from "configs/contracts";
import { convertTokenAddress } from "configs/tokens";
import { MarketsInfoData } from "domain/markets/types";
import { getOppositeCollateral } from "domain/markets/utils";
import { getByKey } from "lib/objects";
import { ExternalCallsPayload } from "transactions/batch/payloads/orderTransactions";

export function getOracleParams({
  chainId,
  tokenAddresses,
}: {
  chainId: ContractsChainId;
  tokenAddresses: string[];
}) {
  const uniqTokenAddresses = uniq(
    tokenAddresses.map((tokenAddress) =>
      convertTokenAddress(chainId, tokenAddress, "wrapped")
    )
  );
  const chainLinkPriceFeedProvider = getContract(
    chainId,
    "ChainlinkPriceFeedProvider"
  );

  return {
    tokens: uniqTokenAddresses,
    providers: Array(uniqTokenAddresses.length).fill(
      chainLinkPriceFeedProvider
    ),
    data: Array(uniqTokenAddresses.length).fill("0x"),
  };
}

export function getOracleParamsForRelayParams({
  chainId,
  gasPaymentTokenAddress,
  relayerFeeTokenAddress,
  feeSwapPath,
  externalCalls,
  marketsInfoData,
}: {
  chainId: ContractsChainId;
  gasPaymentTokenAddress: string;
  relayerFeeTokenAddress: string;
  feeSwapPath: string[];
  externalCalls: ExternalCallsPayload | undefined;
  marketsInfoData: MarketsInfoData;
}) {
  const tokenAddresses = [gasPaymentTokenAddress, relayerFeeTokenAddress];

  if (externalCalls) {
    tokenAddresses.push(...externalCalls.sendTokens);
  }

  if (feeSwapPath.length) {
    tokenAddresses.push(
      ...getSwapPathOracleTokens({
        marketsInfoData,
        initialCollateralAddress: gasPaymentTokenAddress,
        swapPath: feeSwapPath,
      })
    );
  }

  return getOracleParams({ chainId, tokenAddresses });
}

export function getSwapPathOracleTokens({
  marketsInfoData,
  initialCollateralAddress,
  swapPath,
}: {
  marketsInfoData: MarketsInfoData;
  initialCollateralAddress: string;
  swapPath: string[];
}): string[] {
  let currentToken = initialCollateralAddress;
  const tokenAddresses: string[] = [initialCollateralAddress];

  for (const marketAddress of swapPath) {
    const marketInfo = getByKey(marketsInfoData, marketAddress);

    if (!marketInfo) {
      throw new Error(`Market not found for oracle params: ${marketAddress}`);
    }

    const tokenOut = getOppositeCollateral(marketInfo, currentToken);

    if (!tokenOut?.address) {
      throw new Error(
        `Token not found for oracle params: ${initialCollateralAddress}`
      );
    }

    currentToken = tokenOut.address;
    tokenAddresses.push(currentToken, marketInfo.indexToken.address);
  }

  return tokenAddresses;
}
