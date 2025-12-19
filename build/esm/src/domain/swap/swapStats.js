import { maxUint256 } from 'viem';
import { NATIVE_TOKEN_ADDRESS } from '../../configs/tokens.js';
import { getPriceImpactForSwap, getSwapFee, applySwapImpactWithCap } from '../executionFee/index.js';
import { getTokenPoolType, getOppositeCollateral, getAvailableUsdLiquidityForCollateral } from '../markets/utils.js';
import { convertToUsd, getMidPrice, convertToTokenAmount } from '../tokens/utils.js';
import { getByKey } from '../../lib/objects/index.js';

function getSwapCapacityUsd(marketInfo, isLong) {
  const poolAmount = isLong ? marketInfo.longPoolAmount : marketInfo.shortPoolAmount;
  const maxPoolAmount = isLong ? marketInfo.maxLongPoolAmount : marketInfo.maxShortPoolAmount;
  const capacityAmount = maxPoolAmount - poolAmount;
  const token = isLong ? marketInfo.longToken : marketInfo.shortToken;
  const capacityUsd = convertToUsd(
    capacityAmount,
    token.decimals,
    getMidPrice(token.prices)
  );
  return capacityUsd;
}
function getSwapPathOutputAddresses(p) {
  const {
    marketsInfoData,
    initialCollateralAddress,
    swapPath,
    wrappedNativeTokenAddress,
    shouldUnwrapNativeToken,
    isIncrease
  } = p;
  if (swapPath.length === 0) {
    if (isIncrease) {
      return {
        outTokenAddress: initialCollateralAddress,
        outMarketAddress: void 0
      };
    }
    if (shouldUnwrapNativeToken && initialCollateralAddress === wrappedNativeTokenAddress) {
      return {
        outTokenAddress: NATIVE_TOKEN_ADDRESS,
        outMarketAddress: void 0
      };
    }
    return {
      outTokenAddress: initialCollateralAddress,
      outMarketAddress: void 0
    };
  }
  const [firstMarketAddress, ...marketAddresses] = swapPath;
  let outMarket = getByKey(marketsInfoData, firstMarketAddress);
  if (!outMarket) {
    return {
      outTokenAddress: void 0,
      outMarketAddress: void 0
    };
  }
  let outTokenType = getTokenPoolType(outMarket, initialCollateralAddress);
  let outToken = outTokenType === "long" ? outMarket.shortToken : outMarket.longToken;
  for (const marketAddress of marketAddresses) {
    outMarket = getByKey(marketsInfoData, marketAddress);
    if (!outMarket) {
      return {
        outTokenAddress: void 0,
        outMarketAddress: void 0
      };
    }
    outTokenType = outMarket.longTokenAddress === outToken.address ? "short" : "long";
    outToken = outTokenType === "long" ? outMarket.longToken : outMarket.shortToken;
  }
  let outTokenAddress;
  if (isIncrease) {
    outTokenAddress = outToken.address;
  } else {
    if (shouldUnwrapNativeToken && outToken.address === wrappedNativeTokenAddress) {
      outTokenAddress = NATIVE_TOKEN_ADDRESS;
    } else {
      outTokenAddress = outToken.address;
    }
  }
  return {
    outTokenAddress,
    outMarketAddress: outMarket.marketTokenAddress
  };
}
function getSwapPathStats(p) {
  const {
    marketsInfoData,
    swapPath,
    initialCollateralAddress,
    usdIn,
    shouldUnwrapNativeToken,
    shouldApplyPriceImpact,
    wrappedNativeTokenAddress,
    isAtomicSwap
  } = p;
  if (swapPath.length === 0) {
    return void 0;
  }
  const swapSteps = [];
  let usdOut = usdIn;
  let tokenInAddress = initialCollateralAddress;
  let tokenOutAddress = initialCollateralAddress;
  let totalSwapPriceImpactDeltaUsd = 0n;
  let totalSwapFeeUsd = 0n;
  for (let i = 0; i < swapPath.length; i++) {
    const marketAddress = swapPath[i];
    const marketInfo = marketsInfoData[marketAddress];
    if (!marketInfo) {
      return void 0;
    }
    const nextTokenOutAddress = getOppositeCollateral(
      marketInfo,
      tokenInAddress
    )?.address;
    if (!nextTokenOutAddress) {
      return void 0;
    }
    tokenOutAddress = nextTokenOutAddress;
    if (i === swapPath.length - 1 && shouldUnwrapNativeToken && tokenOutAddress === wrappedNativeTokenAddress) {
      tokenOutAddress = NATIVE_TOKEN_ADDRESS;
    }
    const swapStep = getSwapStats({
      marketInfo,
      tokenInAddress,
      tokenOutAddress,
      usdIn: usdOut,
      shouldApplyPriceImpact,
      isAtomicSwap
    });
    tokenInAddress = swapStep.tokenOutAddress;
    usdOut = swapStep.usdOut;
    totalSwapPriceImpactDeltaUsd = totalSwapPriceImpactDeltaUsd + swapStep.priceImpactDeltaUsd;
    totalSwapFeeUsd = totalSwapFeeUsd + swapStep.swapFeeUsd;
    swapSteps.push(swapStep);
  }
  const lastStep = swapSteps[swapSteps.length - 1];
  const targetMarketAddress = lastStep.marketAddress;
  const amountOut = lastStep.amountOut;
  const totalFeesDeltaUsd = 0n - totalSwapFeeUsd + totalSwapPriceImpactDeltaUsd;
  return {
    swapPath,
    tokenInAddress: initialCollateralAddress,
    tokenOutAddress,
    targetMarketAddress,
    swapSteps,
    usdOut,
    amountOut,
    totalSwapFeeUsd,
    totalSwapPriceImpactDeltaUsd,
    totalFeesDeltaUsd
  };
}
function getSwapStats(p) {
  const {
    marketInfo,
    tokenInAddress,
    tokenOutAddress,
    usdIn,
    shouldApplyPriceImpact,
    isAtomicSwap
  } = p;
  const isWrap = tokenInAddress === NATIVE_TOKEN_ADDRESS;
  const isUnwrap = tokenOutAddress === NATIVE_TOKEN_ADDRESS;
  const tokenIn = getTokenPoolType(marketInfo, tokenInAddress) === "long" ? marketInfo.longToken : marketInfo.shortToken;
  const tokenOut = getTokenPoolType(marketInfo, tokenOutAddress) === "long" ? marketInfo.longToken : marketInfo.shortToken;
  const priceIn = tokenIn.prices.minPrice;
  const priceOut = tokenOut.prices.maxPrice;
  const amountIn = convertToTokenAmount(usdIn, tokenIn.decimals, priceIn);
  let priceImpactDeltaUsd;
  let balanceWasImproved;
  try {
    const priceImpactValues = getPriceImpactForSwap(
      marketInfo,
      tokenIn,
      tokenOut,
      usdIn,
      usdIn * -1n
    );
    priceImpactDeltaUsd = priceImpactValues.priceImpactDeltaUsd;
    balanceWasImproved = priceImpactValues.balanceWasImproved;
  } catch (e) {
    const capacityUsd2 = getSwapCapacityUsd(
      marketInfo,
      getTokenPoolType(marketInfo, tokenInAddress) === "long"
    );
    const swapFeeUsd2 = getSwapFee(marketInfo, usdIn, false, isAtomicSwap);
    const usdInAfterFees2 = usdIn - swapFeeUsd2;
    const isOutCapacity2 = capacityUsd2 < usdInAfterFees2;
    return {
      swapFeeUsd: 0n,
      swapFeeAmount: 0n,
      isWrap,
      isUnwrap,
      marketAddress: marketInfo.marketTokenAddress,
      tokenInAddress,
      tokenOutAddress,
      priceImpactDeltaUsd: 0n,
      amountIn,
      amountInAfterFees: amountIn,
      usdIn,
      amountOut: 0n,
      usdOut: 0n,
      isOutLiquidity: true,
      isOutCapacity: isOutCapacity2
    };
  }
  const swapFeeAmount = getSwapFee(
    marketInfo,
    amountIn,
    balanceWasImproved,
    isAtomicSwap
  );
  const swapFeeUsd = getSwapFee(
    marketInfo,
    usdIn,
    balanceWasImproved,
    isAtomicSwap
  );
  const amountInAfterFees = amountIn - swapFeeAmount;
  const usdInAfterFees = usdIn - swapFeeUsd;
  let usdOut = usdInAfterFees;
  let amountOut = convertToTokenAmount(usdOut, tokenOut.decimals, priceOut);
  let cappedImpactDeltaUsd;
  if (priceImpactDeltaUsd > 0) {
    const { impactDeltaAmount: positiveImpactAmountTokenOut, cappedDiffUsd } = applySwapImpactWithCap(marketInfo, tokenOut, priceImpactDeltaUsd);
    cappedImpactDeltaUsd = convertToUsd(
      positiveImpactAmountTokenOut,
      tokenOut.decimals,
      priceOut
    );
    if (cappedDiffUsd > 0) {
      const { impactDeltaAmount: positiveImpactAmountTokenIn } = applySwapImpactWithCap(marketInfo, tokenIn, cappedDiffUsd);
      if (positiveImpactAmountTokenIn > 0) {
        cappedImpactDeltaUsd += convertToUsd(
          positiveImpactAmountTokenIn,
          tokenIn.decimals,
          priceIn
        );
      }
    }
  } else {
    const { impactDeltaAmount: negativeImpactAmount } = applySwapImpactWithCap(
      marketInfo,
      tokenIn,
      priceImpactDeltaUsd
    );
    cappedImpactDeltaUsd = convertToUsd(
      negativeImpactAmount,
      tokenIn.decimals,
      priceIn
    );
  }
  if (shouldApplyPriceImpact) {
    usdOut = usdOut + cappedImpactDeltaUsd;
  }
  if (usdOut < 0) {
    usdOut = 0n;
  }
  amountOut = convertToTokenAmount(usdOut, tokenOut.decimals, priceOut);
  const capacityUsd = getSwapCapacityUsd(
    marketInfo,
    getTokenPoolType(marketInfo, tokenInAddress) === "long"
  );
  const isOutCapacity = capacityUsd < usdInAfterFees;
  const liquidity = getAvailableUsdLiquidityForCollateral(
    marketInfo,
    getTokenPoolType(marketInfo, tokenOutAddress) === "long"
  );
  const isOutLiquidity = liquidity < usdOut;
  return {
    swapFeeUsd,
    swapFeeAmount,
    isWrap,
    isUnwrap,
    marketAddress: marketInfo.marketTokenAddress,
    tokenInAddress,
    tokenOutAddress,
    priceImpactDeltaUsd: cappedImpactDeltaUsd,
    amountIn,
    amountInAfterFees,
    usdIn,
    amountOut,
    usdOut,
    isOutLiquidity,
    isOutCapacity
  };
}
function getMaxSwapPathLiquidity(p) {
  const { marketsInfoData, swapPath, initialCollateralAddress } = p;
  if (swapPath.length === 0) {
    return 0n;
  }
  let minMarketLiquidity = maxUint256;
  let tokenInAddress = initialCollateralAddress;
  for (const marketAddress of swapPath) {
    const marketInfo = getByKey(marketsInfoData, marketAddress);
    if (!marketInfo) {
      return 0n;
    }
    const tokenOut = getOppositeCollateral(marketInfo, tokenInAddress);
    if (!tokenOut) {
      return 0n;
    }
    const isTokenOutLong = getTokenPoolType(marketInfo, tokenOut.address) === "long";
    const liquidity = getAvailableUsdLiquidityForCollateral(
      marketInfo,
      isTokenOutLong
    );
    if (liquidity < minMarketLiquidity) {
      minMarketLiquidity = liquidity;
    }
    tokenInAddress = tokenOut.address;
  }
  if (minMarketLiquidity === maxUint256) {
    return 0n;
  }
  return minMarketLiquidity;
}

export { getMaxSwapPathLiquidity, getSwapCapacityUsd, getSwapPathOutputAddresses, getSwapPathStats, getSwapStats };
//# sourceMappingURL=swapStats.js.map
//# sourceMappingURL=swapStats.js.map