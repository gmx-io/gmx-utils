import { zeroAddress } from 'viem';
import { getMarketFullName } from '../../markets/utils.js';
import { usdToToken } from '../../tokens/__tests__/mock.js';
import { getTokenData } from '../../tokens/utils.js';
import { expandDecimals, USD_DECIMALS } from '../../../lib/numbers/index.js';

function mockMarketKeys() {
  return [
    "AVAX-AVAX-USDC",
    "ETH-ETH-USDC",
    "ETH-ETH-DAI",
    "SOL-ETH-USDC",
    "BTC-BTC-DAI",
    "SPOT-USDC-DAI",
    "SPOT-DAI-USDC",
    "ETH-USDC-USDC",
    "TBTC-TBTC-TBTC",
    "TETH_A-TETH_A-TETH_B",
    "TEST_B-TEST_B-TEST_A",
    "TEST_C-TEST_C-TEST_A"
  ];
}
function mockMarketsData(marketKeys) {
  return marketKeys.reduce((acc, key) => {
    const [indexTokenAddress, longTokenAddress, shortTokenAddress] = key.split("-");
    acc[key] = {
      marketTokenAddress: key,
      indexTokenAddress,
      longTokenAddress,
      shortTokenAddress,
      isSameCollaterals: longTokenAddress === shortTokenAddress,
      isSpotOnly: indexTokenAddress === "SPOT",
      data: "",
      name: "Test Market"
    };
    return acc;
  }, {});
}
function mockMarketsInfoData(tokensData, marketKeys, overrides = {}) {
  return marketKeys.reduce((acc, key) => {
    const [indexTokenAddress, longTokenAddress, shortTokenAddress] = key.split("-");
    const indexToken = getTokenData(tokensData, indexTokenAddress);
    const longToken = getTokenData(tokensData, longTokenAddress);
    const shortToken = getTokenData(tokensData, shortTokenAddress);
    const isSpotOnly = indexTokenAddress === "SPOT";
    acc[key] = {
      isDisabled: false,
      marketTokenAddress: key,
      indexTokenAddress,
      longTokenAddress,
      shortTokenAddress,
      isSameCollaterals: longTokenAddress === shortTokenAddress,
      isSpotOnly,
      name: getMarketFullName({
        longToken,
        shortToken,
        indexToken,
        isSpotOnly
      }),
      longToken,
      shortToken,
      indexToken,
      longPoolAmount: usdToToken(1e3, longToken),
      shortPoolAmount: usdToToken(1e3, shortToken),
      maxLongPoolAmount: usdToToken(1e4, longToken),
      maxShortPoolAmount: usdToToken(1e4, shortToken),
      maxLongPoolUsdForDeposit: usdToToken(1e4, longToken),
      maxShortPoolUsdForDeposit: usdToToken(1e4, shortToken),
      poolValueMax: expandDecimals(2e3, USD_DECIMALS),
      poolValueMin: expandDecimals(2e3, USD_DECIMALS),
      reserveFactorLong: expandDecimals(5, 29),
      reserveFactorShort: expandDecimals(5, 29),
      openInterestReserveFactorLong: expandDecimals(5, 29),
      openInterestReserveFactorShort: expandDecimals(5, 29),
      maxOpenInterestLong: expandDecimals(5, 29),
      maxOpenInterestShort: expandDecimals(5, 29),
      positionImpactPoolAmount: usdToToken(1e3, indexToken),
      positionImpactPoolDistributionRate: 0n,
      minPositionImpactPoolAmount: 0n,
      swapImpactPoolAmountLong: usdToToken(1e3, longToken),
      swapImpactPoolAmountShort: usdToToken(1e3, shortToken),
      positionFeeFactorForBalanceWasImproved: expandDecimals(5, 26),
      positionFeeFactorForBalanceWasNotImproved: expandDecimals(5, 26),
      positionImpactFactorPositive: expandDecimals(2, 23),
      positionImpactFactorNegative: expandDecimals(1, 23),
      maxPositionImpactFactorPositive: expandDecimals(2, 23),
      maxPositionImpactFactorNegative: expandDecimals(1, 23),
      maxPositionImpactFactorForLiquidations: expandDecimals(1, 23),
      maxLendableImpactFactor: expandDecimals(1, 23),
      maxLendableImpactFactorForWithdrawals: expandDecimals(1, 23),
      maxLendableImpactUsd: expandDecimals(1, 23),
      lentPositionImpactPoolAmount: expandDecimals(1, 23),
      positionImpactExponentFactorPositive: expandDecimals(2, 30),
      positionImpactExponentFactorNegative: expandDecimals(2, 30),
      useOpenInterestInTokensForBalance: true,
      swapFeeFactorForBalanceWasImproved: expandDecimals(2, 27),
      swapFeeFactorForBalanceWasNotImproved: expandDecimals(2, 27),
      atomicSwapFeeFactor: expandDecimals(2, 27),
      swapImpactFactorPositive: expandDecimals(2, 23),
      swapImpactFactorNegative: expandDecimals(1, 23),
      swapImpactExponentFactor: expandDecimals(2, 30),
      borrowingFactorPerSecondForLongs: 0n,
      borrowingFactorPerSecondForShorts: 0n,
      borrowingExponentFactorLong: 0n,
      borrowingExponentFactorShort: 0n,
      fundingFactor: 0n,
      fundingExponentFactor: 0n,
      fundingIncreaseFactorPerSecond: 0n,
      fundingDecreaseFactorPerSecond: 0n,
      maxFundingFactorPerSecond: 0n,
      minFundingFactorPerSecond: 0n,
      thresholdForDecreaseFunding: 0n,
      thresholdForStableFunding: 0n,
      totalBorrowingFees: 0n,
      minCollateralFactor: 0n,
      minCollateralFactorForLiquidation: 0n,
      minCollateralFactorForOpenInterestLong: 0n,
      minCollateralFactorForOpenInterestShort: 0n,
      borrowingFactorLong: 0n,
      borrowingFactorShort: 0n,
      fundingFactorPerSecond: 0n,
      longsPayShorts: false,
      longInterestUsd: expandDecimals(500, USD_DECIMALS),
      shortInterestUsd: expandDecimals(500, USD_DECIMALS),
      longInterestInTokens: usdToToken(500, indexToken),
      shortInterestInTokens: usdToToken(500, indexToken),
      maxPnlFactorForTradersLong: expandDecimals(1, 30),
      maxPnlFactorForTradersShort: expandDecimals(1, 30),
      data: "",
      virtualPoolAmountForLongToken: 0n,
      virtualPoolAmountForShortToken: 0n,
      virtualInventoryForPositions: 0n,
      virtualMarketId: zeroAddress,
      virtualLongTokenId: zeroAddress,
      virtualShortTokenId: zeroAddress,
      ...overrides[key] || {}
    };
    return acc;
  }, {});
}

export { mockMarketKeys, mockMarketsData, mockMarketsInfoData };
//# sourceMappingURL=mock.js.map
//# sourceMappingURL=mock.js.map