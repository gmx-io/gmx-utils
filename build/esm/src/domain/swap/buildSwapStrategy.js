import { getAvailableExternalSwapPaths } from '../externalSwap/externalSwapPath.js';
import { getExternalSwapQuoteByPath } from '../externalSwap/externalSwapQuoteByPath.js';
import { convertToUsd, convertToTokenAmount, getIsEquivalentTokens, getIsStake, getIsUnstake, getMidPrice } from '../tokens/utils.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { createFindSwapPath } from './swapPath.js';

function buildSwapStrategy({
  amountIn,
  tokenIn,
  tokenOut,
  marketsInfoData,
  chainId,
  swapOptimizationOrder,
  externalSwapQuoteParams
}) {
  const priceIn = tokenIn.prices.minPrice;
  const usdIn = convertToUsd(amountIn, tokenIn.decimals, priceIn);
  if (amountIn < 0n) {
    amountIn = 0n;
  }
  const defaultSwapStrategy = {
    type: "noSwap",
    externalSwapQuote: void 0,
    swapPathStats: void 0,
    amountIn,
    amountOut: convertToTokenAmount(
      usdIn,
      tokenOut.decimals,
      tokenOut.prices.maxPrice
    ),
    usdIn,
    usdOut: usdIn,
    priceIn,
    priceOut: tokenOut.prices.maxPrice,
    feesUsd: 0n
  };
  if (getIsEquivalentTokens(tokenIn, tokenOut) || getIsStake(tokenIn, tokenOut) || getIsUnstake(tokenIn, tokenOut)) {
    return defaultSwapStrategy;
  }
  const findSwapPath = createFindSwapPath({
    chainId,
    fromTokenAddress: tokenIn.address,
    toTokenAddress: tokenOut.address,
    marketsInfoData,
    isExpressFeeSwap: false
  });
  const swapPathStats = findSwapPath(usdIn, { order: swapOptimizationOrder });
  if (swapPathStats) {
    return {
      type: "internalSwap",
      swapPathStats,
      externalSwapQuote: void 0,
      amountIn,
      amountOut: swapPathStats.amountOut,
      usdIn,
      usdOut: swapPathStats.usdOut,
      priceIn,
      priceOut: tokenOut.prices.maxPrice,
      feesUsd: usdIn - swapPathStats.usdOut
    };
  }
  const availableExternalSwapPaths = getAvailableExternalSwapPaths({
    chainId,
    fromTokenAddress: tokenIn.address
  });
  const suitableSwapPath = availableExternalSwapPaths.find((path) => {
    const findSwapPath2 = createFindSwapPath({
      chainId,
      fromTokenAddress: path.outTokenAddress,
      toTokenAddress: tokenOut.address,
      marketsInfoData,
      isExpressFeeSwap: false
    });
    const swapPathStats2 = findSwapPath2(usdIn);
    return Boolean(swapPathStats2);
  });
  if (suitableSwapPath && suitableSwapPath.outTokenAddress !== tokenOut.address) {
    const externalSwapQuoteForCombinedSwap = getExternalSwapQuoteByPath({
      amountIn,
      externalSwapPath: suitableSwapPath,
      externalSwapQuoteParams
    });
    const findSwapPathForSuitableSwapPath = createFindSwapPath({
      chainId,
      fromTokenAddress: suitableSwapPath.outTokenAddress,
      toTokenAddress: tokenOut.address,
      marketsInfoData,
      isExpressFeeSwap: false
    });
    const swapPathStatsForCombinedSwap = externalSwapQuoteForCombinedSwap ? findSwapPathForSuitableSwapPath(externalSwapQuoteForCombinedSwap.usdOut) : void 0;
    return externalSwapQuoteForCombinedSwap && swapPathStatsForCombinedSwap ? {
      type: "combinedSwap",
      externalSwapQuote: externalSwapQuoteForCombinedSwap,
      swapPathStats: swapPathStatsForCombinedSwap,
      amountIn,
      amountOut: swapPathStatsForCombinedSwap.amountOut,
      usdIn: externalSwapQuoteForCombinedSwap.usdIn,
      usdOut: swapPathStatsForCombinedSwap.usdOut,
      priceIn: externalSwapQuoteForCombinedSwap.priceIn,
      priceOut: tokenOut.prices.maxPrice,
      feesUsd: externalSwapQuoteForCombinedSwap.usdIn - swapPathStatsForCombinedSwap.usdOut
    } : defaultSwapStrategy;
  }
  return defaultSwapStrategy;
}
function buildReverseSwapStrategy({
  amountOut,
  tokenIn,
  tokenOut,
  marketsInfoData,
  chainId,
  externalSwapQuoteParams,
  swapOptimizationOrder
}) {
  const priceIn = getMidPrice(tokenIn.prices);
  const priceOut = getMidPrice(tokenOut.prices);
  const preferredUsdOut = convertToUsd(
    amountOut,
    tokenOut.decimals,
    getMidPrice(tokenOut.prices)
  );
  const approximateAmountIn = convertToTokenAmount(
    preferredUsdOut,
    tokenIn.decimals,
    getMidPrice(tokenIn.prices)
  );
  const approximateUsdIn = preferredUsdOut;
  const defaultSwapStrategy = {
    type: "noSwap",
    externalSwapQuote: void 0,
    swapPathStats: void 0,
    amountIn: approximateAmountIn,
    amountOut,
    usdIn: approximateUsdIn,
    usdOut: preferredUsdOut,
    priceIn,
    priceOut,
    feesUsd: 0n
  };
  if (getIsEquivalentTokens(tokenIn, tokenOut) || getIsStake(tokenIn, tokenOut) || getIsUnstake(tokenIn, tokenOut)) {
    return defaultSwapStrategy;
  }
  const findSwapPath = createFindSwapPath({
    chainId,
    fromTokenAddress: tokenIn.address,
    toTokenAddress: tokenOut.address,
    marketsInfoData,
    isExpressFeeSwap: false
  });
  const approximateSwapPathStats = findSwapPath(approximateUsdIn, {
    order: swapOptimizationOrder
  });
  if (approximateSwapPathStats) {
    const adjustedUsdIn = approximateSwapPathStats.usdOut > 0 ? bigMath.mulDiv(
      approximateUsdIn,
      preferredUsdOut,
      approximateSwapPathStats.usdOut
    ) : 0n;
    const adjustedAmountIn = convertToTokenAmount(
      adjustedUsdIn,
      tokenIn.decimals,
      getMidPrice(tokenIn.prices)
    );
    const adjustedSwapPathStats = findSwapPath(adjustedUsdIn, {
      order: swapOptimizationOrder
    });
    if (adjustedSwapPathStats) {
      return {
        type: "internalSwap",
        swapPathStats: adjustedSwapPathStats,
        externalSwapQuote: void 0,
        amountIn: adjustedAmountIn,
        amountOut: adjustedSwapPathStats.amountOut,
        usdIn: adjustedUsdIn,
        usdOut: adjustedSwapPathStats.usdOut,
        priceIn,
        priceOut,
        feesUsd: adjustedUsdIn - adjustedSwapPathStats.usdOut
      };
    }
  }
  const availableExternalSwapPaths = getAvailableExternalSwapPaths({
    chainId,
    fromTokenAddress: tokenIn.address
  });
  const suitableSwapPath = availableExternalSwapPaths.find((path) => {
    if (path.outTokenAddress !== tokenOut.address) return false;
    const findSwapPath2 = createFindSwapPath({
      chainId,
      fromTokenAddress: tokenIn.address,
      toTokenAddress: path.inTokenAddress,
      marketsInfoData,
      isExpressFeeSwap: false
    });
    const swapPathStats = findSwapPath2(approximateUsdIn);
    return Boolean(swapPathStats);
  });
  if (suitableSwapPath) {
    const approximateExternalSwapQuoteForCombinedSwap = getExternalSwapQuoteByPath({
      amountIn: approximateAmountIn,
      externalSwapPath: suitableSwapPath,
      externalSwapQuoteParams
    });
    if (!approximateExternalSwapQuoteForCombinedSwap) {
      return defaultSwapStrategy;
    }
    const findSwapPathForSuitableSwapPath = createFindSwapPath({
      chainId,
      fromTokenAddress: tokenIn.address,
      toTokenAddress: suitableSwapPath.inTokenAddress,
      marketsInfoData,
      isExpressFeeSwap: false
    });
    const approximateSwapPathStatsForCombinedSwap = findSwapPathForSuitableSwapPath(
      approximateExternalSwapQuoteForCombinedSwap.usdOut
    );
    if (!approximateSwapPathStatsForCombinedSwap) {
      return defaultSwapStrategy;
    }
    const adjustedUsdIn = approximateSwapPathStatsForCombinedSwap.usdOut > 0 ? bigMath.mulDiv(
      approximateUsdIn,
      preferredUsdOut,
      approximateSwapPathStatsForCombinedSwap.usdOut
    ) : 0n;
    const adjustedAmountIn = convertToTokenAmount(
      adjustedUsdIn,
      tokenIn.decimals,
      getMidPrice(tokenIn.prices)
    );
    const adjustedExternalSwapQuoteForCombinedSwap = getExternalSwapQuoteByPath(
      {
        amountIn: adjustedAmountIn,
        externalSwapPath: suitableSwapPath,
        externalSwapQuoteParams
      }
    );
    if (!adjustedExternalSwapQuoteForCombinedSwap) {
      return defaultSwapStrategy;
    }
    const adjustedSwapPathStatsForCombinedSwap = findSwapPathForSuitableSwapPath(
      adjustedExternalSwapQuoteForCombinedSwap.usdOut
    );
    if (!adjustedSwapPathStatsForCombinedSwap) {
      return defaultSwapStrategy;
    }
    return {
      type: "combinedSwap",
      externalSwapQuote: adjustedExternalSwapQuoteForCombinedSwap,
      swapPathStats: adjustedSwapPathStatsForCombinedSwap,
      amountIn: adjustedAmountIn,
      amountOut: adjustedSwapPathStatsForCombinedSwap.amountOut,
      usdIn: adjustedExternalSwapQuoteForCombinedSwap.usdIn,
      usdOut: adjustedSwapPathStatsForCombinedSwap.usdOut,
      priceIn: adjustedExternalSwapQuoteForCombinedSwap.priceIn,
      priceOut,
      feesUsd: adjustedExternalSwapQuoteForCombinedSwap.usdIn - adjustedSwapPathStatsForCombinedSwap.usdOut
    };
  }
  return defaultSwapStrategy;
}

export { buildReverseSwapStrategy, buildSwapStrategy };
//# sourceMappingURL=buildSwapStrategy.js.map
//# sourceMappingURL=buildSwapStrategy.js.map