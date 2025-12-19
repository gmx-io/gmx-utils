import { getSwapFee } from '../executionFee/index.js';
import { marketTokenAmountToUsd, usdToMarketTokenAmount } from '../markets/utils.js';
import { getPriceImpactForSwap, applySwapImpactWithCap } from '../pricing/priceImpact.js';
import { getMidPrice, convertToUsd, convertToTokenAmount } from '../tokens/utils.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { applyFactor } from '../../lib/numbers/index.js';

function getDepositAmounts(p) {
  const {
    marketInfo,
    marketToken,
    longToken,
    shortToken,
    longTokenAmount,
    shortTokenAmount,
    glvTokenAmount,
    marketTokenAmount,
    strategy,
    includeLongToken,
    includeShortToken,
    uiFeeFactor,
    isMarketTokenDeposit,
    glvInfo,
    glvToken
  } = p;
  const longTokenPrice = longToken && getMidPrice(longToken.prices);
  const shortTokenPrice = shortToken && getMidPrice(shortToken.prices);
  const values = {
    longTokenAmount: 0n,
    longTokenUsd: 0n,
    shortTokenAmount: 0n,
    shortTokenUsd: 0n,
    marketTokenAmount: 0n,
    glvTokenAmount: 0n,
    glvTokenUsd: 0n,
    marketTokenUsd: 0n,
    swapFeeUsd: 0n,
    uiFeeUsd: 0n,
    swapPriceImpactDeltaUsd: 0n
  };
  if (strategy === "byCollaterals") {
    if (longTokenAmount == 0n && shortTokenAmount == 0n && marketTokenAmount == 0n) {
      return values;
    }
    values.longTokenAmount = longTokenAmount;
    values.longTokenUsd = convertToUsd(
      longTokenAmount,
      longToken.decimals,
      longTokenPrice
    );
    values.shortTokenAmount = shortTokenAmount;
    values.shortTokenUsd = convertToUsd(
      shortTokenAmount,
      shortToken.decimals,
      shortTokenPrice
    );
    if (isMarketTokenDeposit && glvInfo && marketToken && glvToken) {
      const marketTokenUsd = convertToUsd(
        marketTokenAmount,
        marketToken.decimals,
        marketToken.prices.minPrice
      );
      const glvTokenAmount2 = convertToTokenAmount(
        marketTokenUsd,
        glvToken.decimals,
        glvToken.prices.minPrice
      ) ?? 0n;
      const glvTokenUsd = convertToUsd(
        glvTokenAmount2,
        glvToken.decimals,
        glvToken.prices.minPrice
      ) ?? 0n;
      values.glvTokenAmount = glvTokenAmount2;
      values.glvTokenUsd = glvTokenUsd;
      values.marketTokenAmount = marketTokenAmount ?? 0n;
      values.marketTokenUsd = marketTokenUsd;
      return values;
    }
    const priceImpactValues = getPriceImpactForSwap(
      marketInfo,
      longToken,
      shortToken,
      values.longTokenUsd,
      values.shortTokenUsd
    );
    values.swapPriceImpactDeltaUsd = priceImpactValues.priceImpactDeltaUsd;
    const totalDepositUsd = values.longTokenUsd + values.shortTokenUsd;
    if (values.longTokenUsd > 0) {
      const swapFeeUsd = p.forShift ? 0n : getSwapFee(
        marketInfo,
        values.longTokenUsd,
        priceImpactValues.balanceWasImproved,
        false
      );
      values.swapFeeUsd = values.swapFeeUsd + swapFeeUsd;
      const uiFeeUsd = applyFactor(values.longTokenUsd, uiFeeFactor);
      values.uiFeeUsd = values.uiFeeUsd + uiFeeUsd;
      values.marketTokenAmount += getMarketTokenAmountByCollateral({
        marketInfo,
        marketToken,
        tokenIn: longToken,
        tokenOut: shortToken,
        amount: values.longTokenAmount,
        priceImpactDeltaUsd: bigMath.mulDiv(
          values.swapPriceImpactDeltaUsd,
          values.longTokenUsd,
          totalDepositUsd
        ),
        swapFeeUsd,
        uiFeeUsd
      });
    }
    if (values.shortTokenUsd > 0) {
      const swapFeeUsd = p.forShift ? 0n : getSwapFee(
        marketInfo,
        values.shortTokenUsd,
        priceImpactValues.balanceWasImproved,
        false
      );
      values.swapFeeUsd = values.swapFeeUsd + swapFeeUsd;
      const uiFeeUsd = applyFactor(values.shortTokenUsd, uiFeeFactor);
      values.uiFeeUsd = values.uiFeeUsd + uiFeeUsd;
      values.marketTokenAmount += getMarketTokenAmountByCollateral({
        marketInfo,
        marketToken,
        tokenIn: shortToken,
        tokenOut: longToken,
        amount: values.shortTokenAmount,
        priceImpactDeltaUsd: bigMath.mulDiv(
          values.swapPriceImpactDeltaUsd,
          values.shortTokenUsd,
          totalDepositUsd
        ),
        swapFeeUsd,
        uiFeeUsd
      });
    }
    values.marketTokenUsd = convertToUsd(
      values.marketTokenAmount,
      marketToken.decimals,
      marketToken.prices.minPrice
    );
    if (glvInfo && glvToken) {
      values.glvTokenUsd = values.marketTokenUsd;
      values.glvTokenAmount = convertToTokenAmount(
        values.glvTokenUsd,
        glvToken.decimals,
        glvToken.prices.minPrice
      );
    }
  } else if (strategy === "byMarketToken") {
    if (glvInfo && glvTokenAmount == 0n) {
      return values;
    }
    if (!glvInfo && marketTokenAmount == 0n) {
      return values;
    }
    if (glvInfo && glvToken) {
      values.marketTokenUsd = convertToUsd(
        glvTokenAmount,
        glvToken.decimals,
        glvToken.prices.minPrice
      );
      values.marketTokenAmount = convertToTokenAmount(
        values.marketTokenUsd,
        marketToken.decimals,
        marketToken.prices.minPrice
      );
      values.glvTokenAmount = glvTokenAmount ?? 0n;
      values.glvTokenUsd = values.marketTokenUsd;
    } else {
      values.marketTokenAmount = marketTokenAmount;
      values.marketTokenUsd = marketTokenAmountToUsd(
        marketInfo,
        marketToken,
        marketTokenAmount
      );
    }
    if (glvInfo && isMarketTokenDeposit) {
      return values;
    }
    const prevLongTokenUsd = convertToUsd(
      longTokenAmount,
      longToken.decimals,
      longTokenPrice
    );
    const prevShortTokenUsd = convertToUsd(
      shortTokenAmount,
      shortToken.decimals,
      shortTokenPrice
    );
    const prevSumUsd = prevLongTokenUsd + prevShortTokenUsd;
    if (p.forShift) {
      const longPoolAmount = marketInfo.longPoolAmount;
      const shortPoolAmount = marketInfo.shortPoolAmount;
      const longPoolUsd = convertToUsd(
        longPoolAmount,
        longToken.decimals,
        longToken.prices.maxPrice
      );
      const shortPoolUsd = convertToUsd(
        shortPoolAmount,
        shortToken.decimals,
        shortToken.prices.maxPrice
      );
      const totalPoolUsd = longPoolUsd + shortPoolUsd;
      values.longTokenUsd = bigMath.mulDiv(
        values.marketTokenUsd,
        longPoolUsd,
        totalPoolUsd
      );
      values.shortTokenUsd = bigMath.mulDiv(
        values.marketTokenUsd,
        shortPoolUsd,
        totalPoolUsd
      );
    } else if (includeLongToken && includeShortToken && prevSumUsd > 0) {
      values.longTokenUsd = bigMath.mulDiv(
        values.marketTokenUsd,
        prevLongTokenUsd,
        prevSumUsd
      );
      values.shortTokenUsd = values.marketTokenUsd - values.longTokenUsd;
    } else if (includeLongToken) {
      values.longTokenUsd = values.marketTokenUsd;
    } else if (includeShortToken) {
      values.shortTokenUsd = values.marketTokenUsd;
    }
    const priceImpactValues = getPriceImpactForSwap(
      marketInfo,
      longToken,
      shortToken,
      values.longTokenUsd,
      values.shortTokenUsd
    );
    values.swapPriceImpactDeltaUsd = priceImpactValues.priceImpactDeltaUsd;
    if (!p.forShift) {
      const swapFeeUsd = getSwapFee(
        marketInfo,
        values.marketTokenUsd,
        priceImpactValues.balanceWasImproved,
        false
      );
      values.swapFeeUsd = values.swapFeeUsd + swapFeeUsd;
    }
    const uiFeeUsd = applyFactor(values.marketTokenUsd, uiFeeFactor);
    values.uiFeeUsd = values.uiFeeUsd + uiFeeUsd;
    const totalFee = values.swapFeeUsd + values.uiFeeUsd;
    let totalDepositUsd = values.longTokenUsd + values.shortTokenUsd;
    if (totalDepositUsd > 0) {
      values.longTokenUsd = values.longTokenUsd + bigMath.mulDiv(totalFee, values.longTokenUsd, totalDepositUsd);
      values.shortTokenUsd = values.shortTokenUsd + bigMath.mulDiv(totalFee, values.shortTokenUsd, totalDepositUsd);
      totalDepositUsd = values.longTokenUsd + values.shortTokenUsd;
      if (values.swapPriceImpactDeltaUsd < 0 && totalDepositUsd > 0) {
        values.longTokenUsd = values.longTokenUsd + bigMath.mulDiv(
          -values.swapPriceImpactDeltaUsd,
          values.longTokenUsd,
          totalDepositUsd
        );
        values.shortTokenUsd = values.shortTokenUsd + bigMath.mulDiv(
          -values.swapPriceImpactDeltaUsd,
          values.shortTokenUsd,
          totalDepositUsd
        );
      }
    }
    values.longTokenAmount = convertToTokenAmount(
      values.longTokenUsd,
      longToken.decimals,
      longTokenPrice
    );
    values.shortTokenAmount = convertToTokenAmount(
      values.shortTokenUsd,
      shortToken.decimals,
      shortTokenPrice
    );
  }
  return values;
}
function getMarketTokenAmountByCollateral(p) {
  const {
    marketInfo,
    marketToken,
    tokenIn,
    tokenOut,
    amount,
    priceImpactDeltaUsd,
    swapFeeUsd,
    uiFeeUsd
  } = p;
  const swapFeeAmount = convertToTokenAmount(
    swapFeeUsd,
    tokenIn.decimals,
    tokenIn.prices.minPrice
  );
  const uiFeeAmount = convertToTokenAmount(
    uiFeeUsd,
    tokenIn.decimals,
    tokenIn.prices.minPrice
  );
  let amountInAfterFees = amount - swapFeeAmount - uiFeeAmount;
  let mintAmount = 0n;
  if (priceImpactDeltaUsd > 0) {
    const { impactDeltaAmount: positiveImpactAmount } = applySwapImpactWithCap(
      marketInfo,
      tokenOut,
      priceImpactDeltaUsd
    );
    const usdValue2 = convertToUsd(
      positiveImpactAmount,
      tokenOut.decimals,
      tokenOut.prices.maxPrice
    );
    mintAmount = mintAmount + usdToMarketTokenAmount(marketInfo, marketToken, usdValue2);
  } else {
    const { impactDeltaAmount: negativeImpactAmount } = applySwapImpactWithCap(
      marketInfo,
      tokenIn,
      priceImpactDeltaUsd
    );
    amountInAfterFees = amountInAfterFees + negativeImpactAmount;
  }
  const usdValue = convertToUsd(
    amountInAfterFees,
    tokenIn.decimals,
    tokenIn.prices.minPrice
  );
  mintAmount = mintAmount + usdToMarketTokenAmount(marketInfo, marketToken, usdValue);
  return mintAmount;
}
function getWithdrawalAmounts(p) {
  const {
    marketInfo,
    marketToken,
    marketTokenAmount,
    longTokenAmount,
    shortTokenAmount,
    uiFeeFactor,
    strategy,
    glvInfo,
    glvToken,
    glvTokenAmount
  } = p;
  const { longToken, shortToken } = marketInfo;
  const longPoolAmount = marketInfo.longPoolAmount;
  const shortPoolAmount = marketInfo.shortPoolAmount;
  const longPoolUsd = convertToUsd(
    longPoolAmount,
    longToken.decimals,
    longToken.prices.maxPrice
  );
  const shortPoolUsd = convertToUsd(
    shortPoolAmount,
    shortToken.decimals,
    shortToken.prices.maxPrice
  );
  const totalPoolUsd = longPoolUsd + shortPoolUsd;
  const values = {
    marketTokenAmount: 0n,
    marketTokenUsd: 0n,
    longTokenAmount: 0n,
    longTokenUsd: 0n,
    shortTokenAmount: 0n,
    shortTokenUsd: 0n,
    glvTokenAmount: 0n,
    glvTokenUsd: 0n,
    swapFeeUsd: 0n,
    uiFeeUsd: 0n,
    swapPriceImpactDeltaUsd: 0n
  };
  if (totalPoolUsd == 0n) {
    return values;
  }
  if (strategy === "byMarketToken") {
    if (glvInfo) {
      values.glvTokenAmount = glvTokenAmount;
      values.glvTokenUsd = convertToUsd(
        glvTokenAmount,
        glvToken?.decimals,
        glvToken?.prices.minPrice
      );
      values.marketTokenAmount = convertToTokenAmount(
        values.glvTokenUsd,
        marketToken.decimals,
        marketToken.prices.maxPrice
      );
      values.marketTokenUsd = values.glvTokenUsd;
    } else {
      values.marketTokenAmount = marketTokenAmount;
      values.marketTokenUsd = marketTokenAmountToUsd(
        marketInfo,
        marketToken,
        marketTokenAmount
      );
    }
    values.longTokenUsd = bigMath.mulDiv(
      values.marketTokenUsd,
      longPoolUsd,
      totalPoolUsd
    );
    values.shortTokenUsd = bigMath.mulDiv(
      values.marketTokenUsd,
      shortPoolUsd,
      totalPoolUsd
    );
    const longSwapFeeUsd = p.forShift ? 0n : applyFactor(
      values.longTokenUsd,
      p.marketInfo.swapFeeFactorForBalanceWasNotImproved
    );
    const shortSwapFeeUsd = p.forShift ? 0n : applyFactor(
      values.shortTokenUsd,
      p.marketInfo.swapFeeFactorForBalanceWasNotImproved
    );
    const longUiFeeUsd = applyFactor(values.marketTokenUsd, uiFeeFactor);
    const shortUiFeeUsd = applyFactor(values.shortTokenUsd, uiFeeFactor);
    values.uiFeeUsd = applyFactor(values.marketTokenUsd, uiFeeFactor);
    values.swapFeeUsd = longSwapFeeUsd + shortSwapFeeUsd;
    values.longTokenUsd = values.longTokenUsd - longSwapFeeUsd - longUiFeeUsd;
    values.shortTokenUsd = values.shortTokenUsd - shortSwapFeeUsd - shortUiFeeUsd;
    values.longTokenAmount = convertToTokenAmount(
      values.longTokenUsd,
      longToken.decimals,
      longToken.prices.maxPrice
    );
    values.shortTokenAmount = convertToTokenAmount(
      values.shortTokenUsd,
      shortToken.decimals,
      shortToken.prices.maxPrice
    );
  } else {
    if (strategy === "byLongCollateral" && longPoolUsd > 0) {
      values.longTokenAmount = longTokenAmount;
      values.longTokenUsd = convertToUsd(
        longTokenAmount,
        longToken.decimals,
        longToken.prices.maxPrice
      );
      values.shortTokenUsd = bigMath.mulDiv(
        values.longTokenUsd,
        shortPoolUsd,
        longPoolUsd
      );
      values.shortTokenAmount = convertToTokenAmount(
        values.shortTokenUsd,
        shortToken.decimals,
        shortToken.prices.maxPrice
      );
    } else if (strategy === "byShortCollateral" && shortPoolUsd > 0) {
      values.shortTokenAmount = shortTokenAmount;
      values.shortTokenUsd = convertToUsd(
        shortTokenAmount,
        shortToken.decimals,
        shortToken.prices.maxPrice
      );
      values.longTokenUsd = bigMath.mulDiv(
        values.shortTokenUsd,
        longPoolUsd,
        shortPoolUsd
      );
      values.longTokenAmount = convertToTokenAmount(
        values.longTokenUsd,
        longToken.decimals,
        longToken.prices.maxPrice
      );
    } else if (strategy === "byCollaterals") {
      values.longTokenAmount = longTokenAmount;
      values.longTokenUsd = convertToUsd(
        longTokenAmount,
        longToken.decimals,
        longToken.prices.maxPrice
      );
      values.shortTokenAmount = shortTokenAmount;
      values.shortTokenUsd = convertToUsd(
        shortTokenAmount,
        shortToken.decimals,
        shortToken.prices.maxPrice
      );
      values.uiFeeUsd = applyFactor(
        values.longTokenUsd + values.shortTokenUsd,
        uiFeeFactor
      );
      values.marketTokenUsd += values.uiFeeUsd;
    }
    values.marketTokenUsd = values.marketTokenUsd + values.longTokenUsd + values.shortTokenUsd;
    if (!p.forShift) {
      values.swapFeeUsd = applyFactor(
        values.longTokenUsd + values.shortTokenUsd,
        p.marketInfo.swapFeeFactorForBalanceWasNotImproved
      );
    }
    values.marketTokenUsd = values.marketTokenUsd + values.swapFeeUsd;
    values.marketTokenAmount = usdToMarketTokenAmount(
      marketInfo,
      marketToken,
      values.marketTokenUsd
    );
    if (glvInfo) {
      values.glvTokenUsd = convertToUsd(
        values.marketTokenAmount,
        marketToken?.decimals,
        marketToken?.prices.minPrice
      );
      values.glvTokenAmount = convertToTokenAmount(
        values.glvTokenUsd,
        glvToken?.decimals,
        glvToken?.prices.minPrice
      );
    }
  }
  return values;
}
function getShiftAmounts({
  strategy,
  fromToken,
  fromMarketInfo,
  toToken,
  toMarketInfo,
  fromTokenAmount,
  toTokenAmount,
  uiFeeFactor
}) {
  const values = {
    fromTokenAmount: 0n,
    fromTokenUsd: 0n,
    fromLongTokenAmount: 0n,
    fromShortTokenAmount: 0n,
    toTokenAmount: 0n,
    toTokenUsd: 0n,
    uiFeeUsd: 0n,
    swapPriceImpactDeltaUsd: 0n
  };
  if (strategy === "byFromToken") {
    values.fromTokenAmount = fromTokenAmount;
    values.fromTokenUsd = marketTokenAmountToUsd(
      fromMarketInfo,
      fromToken,
      fromTokenAmount
    );
    const withdrawalAmounts = getWithdrawalAmounts({
      marketInfo: fromMarketInfo,
      marketToken: fromToken,
      marketTokenAmount: fromTokenAmount,
      strategy: "byMarketToken",
      longTokenAmount: 0n,
      shortTokenAmount: 0n,
      uiFeeFactor,
      forShift: true
    });
    const depositAmounts = getDepositAmounts({
      marketInfo: toMarketInfo,
      marketToken: toToken,
      longToken: toMarketInfo.longToken,
      shortToken: toMarketInfo.shortToken,
      longTokenAmount: withdrawalAmounts.longTokenAmount,
      shortTokenAmount: withdrawalAmounts.shortTokenAmount,
      marketTokenAmount: 0n,
      strategy: "byCollaterals",
      includeLongToken: false,
      includeShortToken: false,
      uiFeeFactor: 0n,
      forShift: true,
      isMarketTokenDeposit: false
    });
    values.fromLongTokenAmount = withdrawalAmounts.longTokenAmount;
    values.fromShortTokenAmount = withdrawalAmounts.shortTokenAmount;
    values.uiFeeUsd = withdrawalAmounts.uiFeeUsd;
    values.swapPriceImpactDeltaUsd = depositAmounts.swapPriceImpactDeltaUsd;
    values.toTokenAmount = depositAmounts.marketTokenAmount;
    values.toTokenUsd = marketTokenAmountToUsd(
      toMarketInfo,
      toToken,
      depositAmounts.marketTokenAmount
    );
  } else {
    values.toTokenAmount = toTokenAmount;
    values.toTokenUsd = marketTokenAmountToUsd(
      toMarketInfo,
      toToken,
      toTokenAmount
    );
    const withdrawalAmounts = getWithdrawalAmounts({
      marketInfo: fromMarketInfo,
      marketToken: fromToken,
      strategy: "byMarketToken",
      marketTokenAmount: usdToMarketTokenAmount(
        fromMarketInfo,
        fromToken,
        values.toTokenUsd
      ),
      longTokenAmount: 0n,
      shortTokenAmount: 0n,
      uiFeeFactor,
      forShift: true
    });
    const depositAmounts = getDepositAmounts({
      marketInfo: toMarketInfo,
      marketToken: toToken,
      strategy: "byCollaterals",
      longToken: toMarketInfo.longToken,
      longTokenAmount: withdrawalAmounts.longTokenAmount,
      shortToken: toMarketInfo.shortToken,
      shortTokenAmount: withdrawalAmounts.shortTokenAmount,
      marketTokenAmount: 0n,
      includeLongToken: true,
      includeShortToken: true,
      uiFeeFactor: 0n,
      forShift: true,
      isMarketTokenDeposit: false
    });
    values.fromLongTokenAmount = depositAmounts.longTokenAmount;
    values.fromShortTokenAmount = depositAmounts.shortTokenAmount;
    values.uiFeeUsd = withdrawalAmounts.uiFeeUsd;
    values.swapPriceImpactDeltaUsd = depositAmounts.swapPriceImpactDeltaUsd;
    values.fromTokenAmount = withdrawalAmounts.marketTokenAmount - usdToMarketTokenAmount(
      fromMarketInfo,
      fromToken,
      values.swapPriceImpactDeltaUsd
    );
    values.fromTokenUsd = marketTokenAmountToUsd(
      fromMarketInfo,
      fromToken,
      values.fromTokenAmount
    );
  }
  return values;
}

export { getDepositAmounts, getShiftAmounts, getWithdrawalAmounts };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map