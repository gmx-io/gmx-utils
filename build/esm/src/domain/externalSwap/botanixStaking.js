import { encodeFunctionData } from 'viem';
import StBTCABI from '../../abis/StBTC.js';
import { BOTANIX } from '../../configs/chains.js';
import { getContract } from '../../configs/contracts.js';
import { getTokenData, getMidPrice, convertToUsd } from '../tokens/utils.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { getBasisPoints, BASIS_POINTS_DIVISOR_BIGINT } from '../../lib/numbers/index.js';
import { AVAILABLE_BOTANIX_DEPOSIT_PAIRS, AVAILABLE_BOTANIX_WITHDRAW_PAIRS } from './externalSwapPath.js';
import { ExternalSwapAggregator } from './types.js';

const COEF_REDUCER = getBasisPoints(1n, 10000n);
const getBotanixStakingExternalSwapQuote = ({
  tokenInAddress,
  tokenOutAddress,
  amountIn,
  gasPrice,
  receiverAddress,
  tokensData,
  assetsPerShare
}) => {
  const inTokenData = getTokenData(tokensData, tokenInAddress);
  const outTokenData = getTokenData(tokensData, tokenOutAddress);
  const assetsPerShareRate = getBasisPoints(assetsPerShare, 10n ** 18n) - COEF_REDUCER;
  const sharesPerAssetRate = getBasisPoints(10n ** 18n, assetsPerShare) - COEF_REDUCER;
  if (!inTokenData || !outTokenData) {
    return void 0;
  }
  if (AVAILABLE_BOTANIX_DEPOSIT_PAIRS.some(
    (pair) => pair.from === tokenInAddress && pair.to === tokenOutAddress
  )) {
    const priceIn = getMidPrice(inTokenData.prices);
    const priceOut = bigMath.mulDiv(
      priceIn,
      sharesPerAssetRate,
      BASIS_POINTS_DIVISOR_BIGINT
    );
    const usdIn = convertToUsd(amountIn, inTokenData.decimals, priceIn);
    const amountOut = amountIn > 0n ? bigMath.mulDiv(
      amountIn,
      sharesPerAssetRate,
      BASIS_POINTS_DIVISOR_BIGINT
    ) - gasPrice : 0n;
    const usdOut = amountOut > 0n ? convertToUsd(amountOut, outTokenData.decimals, priceOut) : 0n;
    return {
      aggregator: ExternalSwapAggregator.BotanixStaking,
      inTokenAddress: tokenInAddress,
      outTokenAddress: tokenOutAddress,
      receiver: receiverAddress,
      amountIn,
      amountOut,
      usdIn,
      usdOut,
      priceIn,
      priceOut,
      feesUsd: gasPrice,
      needSpenderApproval: true,
      txnData: {
        to: getContract(BOTANIX, "StBTC"),
        data: encodeFunctionData({
          abi: StBTCABI,
          functionName: "deposit",
          args: [amountIn, receiverAddress]
        }),
        value: 0n,
        estimatedGas: gasPrice,
        estimatedExecutionFee: gasPrice
      }
    };
  }
  if (AVAILABLE_BOTANIX_WITHDRAW_PAIRS.some(
    (pair) => pair.from === tokenInAddress && pair.to === tokenOutAddress
  )) {
    const priceIn = getMidPrice(inTokenData.prices);
    const priceOut = bigMath.mulDiv(
      priceIn,
      assetsPerShareRate,
      BASIS_POINTS_DIVISOR_BIGINT
    );
    const usdIn = convertToUsd(amountIn, inTokenData.decimals, priceIn);
    const amountOut = amountIn > 0n ? bigMath.mulDiv(
      amountIn,
      assetsPerShareRate,
      BASIS_POINTS_DIVISOR_BIGINT
    ) - gasPrice : 0n;
    const usdOut = amountOut > 0n ? convertToUsd(amountOut, outTokenData.decimals, priceOut) : 0n;
    return {
      aggregator: ExternalSwapAggregator.BotanixStaking,
      inTokenAddress: tokenInAddress,
      outTokenAddress: tokenOutAddress,
      receiver: receiverAddress,
      amountIn,
      amountOut,
      usdIn,
      usdOut,
      priceIn,
      priceOut,
      feesUsd: gasPrice,
      needSpenderApproval: true,
      txnData: {
        to: getContract(BOTANIX, "StBTC"),
        data: encodeFunctionData({
          abi: StBTCABI,
          functionName: "withdraw",
          args: [
            amountIn,
            receiverAddress,
            getContract(BOTANIX, "ExternalHandler")
          ]
        }),
        value: 0n,
        estimatedGas: gasPrice,
        estimatedExecutionFee: gasPrice
      }
    };
  }
};

export { getBotanixStakingExternalSwapQuote };
//# sourceMappingURL=botanixStaking.js.map
//# sourceMappingURL=botanixStaking.js.map