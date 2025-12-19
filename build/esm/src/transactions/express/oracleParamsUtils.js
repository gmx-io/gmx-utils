import uniq from 'lodash/uniq';
import { getContract } from '../../configs/contracts.js';
import { convertTokenAddress } from '../../configs/tokens.js';
import { getOppositeCollateral } from '../../domain/markets/utils.js';
import { getByKey } from '../../lib/objects/index.js';

function getOracleParams({
  chainId,
  tokenAddresses
}) {
  const uniqTokenAddresses = uniq(
    tokenAddresses.map(
      (tokenAddress) => convertTokenAddress(chainId, tokenAddress, "wrapped")
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
    data: Array(uniqTokenAddresses.length).fill("0x")
  };
}
function getOracleParamsForRelayParams({
  chainId,
  gasPaymentTokenAddress,
  relayerFeeTokenAddress,
  feeSwapPath,
  externalCalls,
  marketsInfoData
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
        swapPath: feeSwapPath
      })
    );
  }
  return getOracleParams({ chainId, tokenAddresses });
}
function getSwapPathOracleTokens({
  marketsInfoData,
  initialCollateralAddress,
  swapPath
}) {
  let currentToken = initialCollateralAddress;
  const tokenAddresses = [initialCollateralAddress];
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

export { getOracleParams, getOracleParamsForRelayParams, getSwapPathOracleTokens };
//# sourceMappingURL=oracleParamsUtils.js.map
//# sourceMappingURL=oracleParamsUtils.js.map