import { getBotanixStakingExternalSwapQuote } from './botanixStaking.js';
import { ExternalSwapAggregator } from './types.js';

// src/domain/externalSwap/externalSwapQuoteByPath.ts
var getExternalSwapQuoteByPath = ({
  amountIn,
  externalSwapPath,
  externalSwapQuoteParams
}) => {
  if (amountIn === void 0 || externalSwapQuoteParams.gasPrice === void 0 || externalSwapQuoteParams.tokensData === void 0 || externalSwapQuoteParams.botanixStakingAssetsPerShare === void 0 || externalSwapQuoteParams.receiverAddress === void 0) {
    return void 0;
  }
  if (externalSwapPath.aggregator === ExternalSwapAggregator.BotanixStaking) {
    return getBotanixStakingExternalSwapQuote({
      tokenInAddress: externalSwapPath.inTokenAddress,
      tokenOutAddress: externalSwapPath.outTokenAddress,
      amountIn,
      gasPrice: externalSwapQuoteParams.gasPrice,
      receiverAddress: externalSwapQuoteParams.receiverAddress,
      tokensData: externalSwapQuoteParams.tokensData,
      assetsPerShare: externalSwapQuoteParams.botanixStakingAssetsPerShare
    });
  }
  return void 0;
};

export { getExternalSwapQuoteByPath };
//# sourceMappingURL=externalSwapQuoteByPath.js.map
//# sourceMappingURL=externalSwapQuoteByPath.js.map