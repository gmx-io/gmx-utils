import { getFeeItem, getPositionFee } from '../executionFee/index.js';
import { getIncreasePositionPrices, leverageBySizeValues } from '../increase/increase.js';
import { getSwapAmountsByFromValue, getSwapAmountsByToValue } from '../swap/swapValues.js';
import { convertToUsd, convertToTokenAmount } from '../tokens/utils.js';
import { applyFactor } from '../../lib/numbers/index.js';

function getExternalSwapInputsByFromValue({
  tokenIn,
  tokenOut,
  amountIn,
  findSwapPath,
  uiFeeFactor,
  marketsInfoData,
  chainId
}) {
  const swapAmounts = getSwapAmountsByFromValue({
    tokenIn,
    tokenOut,
    amountIn,
    isLimit: false,
    findSwapPath,
    uiFeeFactor,
    marketsInfoData,
    chainId,
    externalSwapQuoteParams: void 0
  });
  const internalSwapTotalFeesDeltaUsd = swapAmounts.swapStrategy.swapPathStats ? swapAmounts.swapStrategy.swapPathStats.totalFeesDeltaUsd : void 0;
  const internalSwapTotalFeeItem = getFeeItem(internalSwapTotalFeesDeltaUsd, swapAmounts.usdIn);
  return {
    amountIn,
    priceIn: swapAmounts.priceIn,
    priceOut: swapAmounts.priceOut,
    usdIn: swapAmounts.usdIn,
    usdOut: swapAmounts.usdOut,
    strategy: "byFromValue",
    internalSwapTotalFeeItem,
    internalSwapTotalFeesDeltaUsd,
    internalSwapAmounts: swapAmounts
  };
}
function getExternalSwapInputsByLeverageSize({
  marketInfo,
  tokenIn,
  collateralToken,
  indexTokenAmount,
  findSwapPath,
  uiFeeFactor,
  triggerPrice,
  existingPosition,
  leverage,
  isLong,
  userReferralInfo,
  marketsInfoData,
  chainId
}) {
  const prices = getIncreasePositionPrices({
    triggerPrice,
    indexToken: marketInfo.indexToken,
    initialCollateralToken: tokenIn,
    collateralToken,
    isLong
  });
  const sizeDeltaUsd = convertToUsd(indexTokenAmount, marketInfo.indexToken.decimals, prices.indexPrice);
  const positionFeeInfo = getPositionFee(marketInfo, sizeDeltaUsd, false, userReferralInfo);
  const positionFeeUsd = positionFeeInfo.positionFeeUsd;
  const uiFeeUsd = applyFactor(sizeDeltaUsd, uiFeeFactor);
  const { baseCollateralAmount } = leverageBySizeValues({
    collateralToken,
    leverage,
    sizeDeltaUsd,
    collateralPrice: prices.collateralPrice,
    uiFeeFactor,
    positionFeeUsd,
    fundingFeeUsd: existingPosition?.pendingFundingFeesUsd || 0n,
    borrowingFeeUsd: existingPosition?.pendingBorrowingFeesUsd || 0n,
    uiFeeUsd,
    swapUiFeeUsd: 0n
  });
  const usdOut = convertToUsd(baseCollateralAmount, collateralToken.decimals, collateralToken.prices.maxPrice);
  const baseUsdIn = usdOut;
  const baseAmountIn = convertToTokenAmount(baseUsdIn, tokenIn.decimals, tokenIn.prices.minPrice);
  const swapAmounts = getSwapAmountsByToValue({
    tokenIn,
    tokenOut: collateralToken,
    amountOut: baseCollateralAmount,
    isLimit: false,
    findSwapPath,
    uiFeeFactor,
    marketsInfoData,
    chainId,
    externalSwapQuoteParams: void 0
  });
  const internalSwapTotalFeesDeltaUsd = swapAmounts.swapStrategy.swapPathStats ? swapAmounts.swapStrategy.swapPathStats.totalFeesDeltaUsd : void 0;
  const internalSwapTotalFeeItem = getFeeItem(internalSwapTotalFeesDeltaUsd, swapAmounts.usdIn);
  return {
    amountIn: baseAmountIn,
    priceIn: swapAmounts.priceIn,
    priceOut: swapAmounts.priceOut,
    usdIn: baseUsdIn,
    usdOut: swapAmounts.usdOut,
    strategy: "leverageBySize",
    internalSwapTotalFeeItem,
    internalSwapTotalFeesDeltaUsd,
    internalSwapAmounts: swapAmounts
  };
}
function getBestSwapStrategy({
  internalSwapAmounts,
  externalSwapQuote,
  forceExternalSwaps
}) {
  let amountIn;
  let amountOut;
  let usdIn;
  let usdOut;
  if (externalSwapQuote && (externalSwapQuote.usdOut > (internalSwapAmounts?.swapStrategy.swapPathStats?.usdOut ?? 0n) || forceExternalSwaps)) {
    amountIn = externalSwapQuote.amountIn;
    amountOut = externalSwapQuote.amountOut;
    usdIn = externalSwapQuote.usdIn;
    usdOut = externalSwapQuote.usdOut;
    return {
      amountIn,
      amountOut,
      usdIn,
      usdOut,
      externalSwapQuote
    };
  } else if (internalSwapAmounts?.swapStrategy.swapPathStats) {
    amountIn = internalSwapAmounts.amountIn;
    amountOut = internalSwapAmounts.amountOut;
    usdIn = internalSwapAmounts.usdIn;
    usdOut = internalSwapAmounts.usdOut;
    return {
      amountIn,
      amountOut,
      usdIn,
      usdOut,
      swapPath: internalSwapAmounts.swapStrategy.swapPathStats.swapPath
    };
  } else {
    return void 0;
  }
}
function getIsInternalSwapBetter({
  internalSwapAmounts,
  externalSwapQuote,
  forceExternalSwaps
}) {
  if (externalSwapQuote?.usdOut == void 0) {
    return true;
  }
  if (forceExternalSwaps) {
    return false;
  }
  return internalSwapAmounts?.swapStrategy.swapPathStats?.usdOut !== void 0 && internalSwapAmounts.swapStrategy.swapPathStats.usdOut > (externalSwapQuote?.usdOut ?? 0n);
}

export { getBestSwapStrategy, getExternalSwapInputsByFromValue, getExternalSwapInputsByLeverageSize, getIsInternalSwapBetter };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map