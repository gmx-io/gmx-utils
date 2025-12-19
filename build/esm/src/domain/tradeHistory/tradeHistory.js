import { getAddress } from 'viem';
import { isSwapOrderType, isIncreaseOrderType } from '../orders/utils.js';
import { parseContractPrice } from '../pricing/contractPrice.js';
import { getSwapPathOutputAddresses } from '../swap/swapStats.js';
import { getByKey } from '../../lib/objects/index.js';

function createRawTradeActionTransformer(marketsInfoData, wrappedToken, tokensData) {
  return (rawAction) => {
    const orderType = Number(rawAction.orderType);
    if (isSwapOrderType(orderType)) {
      const initialCollateralTokenAddress = getAddress(
        rawAction.initialCollateralTokenAddress
      );
      const swapPath = rawAction.swapPath.map(
        (address) => getAddress(address)
      );
      const swapPathOutputAddresses = getSwapPathOutputAddresses({
        marketsInfoData,
        swapPath,
        initialCollateralAddress: initialCollateralTokenAddress,
        wrappedNativeTokenAddress: wrappedToken.address,
        shouldUnwrapNativeToken: rawAction.shouldUnwrapNativeToken,
        isIncrease: false
      });
      const initialCollateralToken = getByKey(
        tokensData,
        initialCollateralTokenAddress
      );
      const targetCollateralToken = getByKey(
        tokensData,
        swapPathOutputAddresses.outTokenAddress
      );
      if (!initialCollateralToken || !targetCollateralToken) {
        return void 0;
      }
      const tradeAction = {
        type: "swap",
        id: rawAction.id,
        srcChainId: rawAction.srcChainId ? Number(rawAction.srcChainId) : void 0,
        eventName: rawAction.eventName,
        account: rawAction.account,
        swapPath,
        orderType,
        orderKey: rawAction.orderKey,
        initialCollateralTokenAddress: rawAction.initialCollateralTokenAddress,
        initialCollateralDeltaAmount: bigNumberify(
          rawAction.initialCollateralDeltaAmount
        ),
        minOutputAmount: bigNumberify(rawAction.minOutputAmount),
        executionAmountOut: rawAction.executionAmountOut ? bigNumberify(rawAction.executionAmountOut) : void 0,
        shouldUnwrapNativeToken: rawAction.shouldUnwrapNativeToken,
        targetCollateralToken,
        initialCollateralToken,
        timestamp: rawAction.timestamp,
        transaction: rawAction.transaction,
        reason: rawAction.reason ?? void 0,
        reasonBytes: rawAction.reasonBytes ?? void 0,
        twapParams: rawAction.twapGroupId && rawAction.numberOfParts ? {
          twapGroupId: rawAction.twapGroupId,
          numberOfParts: rawAction.numberOfParts
        } : void 0
      };
      return tradeAction;
    } else {
      const marketAddress = getAddress(rawAction.marketAddress);
      const marketInfo = getByKey(marketsInfoData, marketAddress);
      const indexToken = marketInfo?.indexToken;
      const initialCollateralTokenAddress = getAddress(
        rawAction.initialCollateralTokenAddress
      );
      const swapPath = rawAction.swapPath.map(
        (address) => getAddress(address)
      );
      const swapPathOutputAddresses = getSwapPathOutputAddresses({
        marketsInfoData,
        swapPath,
        initialCollateralAddress: initialCollateralTokenAddress,
        wrappedNativeTokenAddress: wrappedToken.address,
        shouldUnwrapNativeToken: rawAction.shouldUnwrapNativeToken,
        isIncrease: isIncreaseOrderType(rawAction.orderType)
      });
      const initialCollateralToken = getByKey(
        tokensData,
        initialCollateralTokenAddress
      );
      const targetCollateralToken = getByKey(
        tokensData,
        swapPathOutputAddresses.outTokenAddress
      );
      if (!marketInfo || !indexToken || !initialCollateralToken || !targetCollateralToken) {
        return void 0;
      }
      const tradeAction = {
        type: "position",
        id: rawAction.id,
        eventName: rawAction.eventName,
        account: rawAction.account,
        marketAddress,
        marketInfo,
        srcChainId: rawAction.srcChainId ? Number(rawAction.srcChainId) : void 0,
        indexToken,
        swapPath,
        initialCollateralTokenAddress,
        initialCollateralToken,
        targetCollateralToken,
        initialCollateralDeltaAmount: bigNumberify(
          rawAction.initialCollateralDeltaAmount
        ),
        sizeDeltaUsd: bigNumberify(rawAction.sizeDeltaUsd),
        sizeDeltaInTokens: rawAction.sizeDeltaInTokens ? bigNumberify(rawAction.sizeDeltaInTokens) : void 0,
        triggerPrice: rawAction.triggerPrice ? parseContractPrice(
          bigNumberify(rawAction.triggerPrice),
          indexToken.decimals
        ) : void 0,
        acceptablePrice: parseContractPrice(
          bigNumberify(rawAction.acceptablePrice),
          indexToken.decimals
        ),
        executionPrice: rawAction.executionPrice ? parseContractPrice(
          bigNumberify(rawAction.executionPrice),
          indexToken.decimals
        ) : void 0,
        minOutputAmount: bigNumberify(rawAction.minOutputAmount),
        collateralTokenPriceMax: rawAction.collateralTokenPriceMax ? parseContractPrice(
          bigNumberify(rawAction.collateralTokenPriceMax),
          initialCollateralToken.decimals
        ) : void 0,
        collateralTokenPriceMin: rawAction.collateralTokenPriceMin ? parseContractPrice(
          bigNumberify(rawAction.collateralTokenPriceMin),
          initialCollateralToken.decimals
        ) : void 0,
        indexTokenPriceMin: rawAction.indexTokenPriceMin ? parseContractPrice(
          BigInt(rawAction.indexTokenPriceMin),
          indexToken.decimals
        ) : void 0,
        indexTokenPriceMax: rawAction.indexTokenPriceMax ? parseContractPrice(
          BigInt(rawAction.indexTokenPriceMax),
          indexToken.decimals
        ) : void 0,
        orderType,
        orderKey: rawAction.orderKey,
        isLong: rawAction.isLong,
        pnlUsd: rawAction.pnlUsd ? BigInt(rawAction.pnlUsd) : void 0,
        basePnlUsd: rawAction.basePnlUsd ? BigInt(rawAction.basePnlUsd) : void 0,
        priceImpactDiffUsd: rawAction.priceImpactDiffUsd ? BigInt(rawAction.priceImpactDiffUsd) : void 0,
        priceImpactUsd: rawAction.priceImpactUsd ? BigInt(rawAction.priceImpactUsd) : void 0,
        totalImpactUsd: rawAction.totalImpactUsd ? BigInt(rawAction.totalImpactUsd) : void 0,
        positionFeeAmount: rawAction.positionFeeAmount ? BigInt(rawAction.positionFeeAmount) : void 0,
        borrowingFeeAmount: rawAction.borrowingFeeAmount ? BigInt(rawAction.borrowingFeeAmount) : void 0,
        fundingFeeAmount: rawAction.fundingFeeAmount ? BigInt(rawAction.fundingFeeAmount) : void 0,
        liquidationFeeAmount: rawAction.liquidationFeeAmount ? BigInt(rawAction.liquidationFeeAmount) : void 0,
        reason: rawAction.reason ?? void 0,
        reasonBytes: rawAction.reasonBytes ?? void 0,
        transaction: rawAction.transaction,
        timestamp: rawAction.timestamp,
        shouldUnwrapNativeToken: rawAction.shouldUnwrapNativeToken,
        twapParams: rawAction.twapGroupId && rawAction.numberOfParts ? {
          twapGroupId: rawAction.twapGroupId,
          numberOfParts: rawAction.numberOfParts
        } : void 0
      };
      return tradeAction;
    }
  };
}
function bigNumberify(n) {
  try {
    if (n === void 0) throw new Error("n is undefined");
    if (n === null) throw new Error("n is null");
    return BigInt(n);
  } catch (e) {
    console.error("bigNumberify error", e);
    return void 0;
  }
}

export { bigNumberify, createRawTradeActionTransformer };
//# sourceMappingURL=tradeHistory.js.map
//# sourceMappingURL=tradeHistory.js.map