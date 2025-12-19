import { MARKETS } from '../../configs/markets.js';
import { convertTokenAddress, getWrappedToken, NATIVE_TOKEN_ADDRESS } from '../../configs/tokens.js';
import { getIsMarketAvailableForExpressSwaps } from '../markets/utils.js';
import { LRUCache } from '../../lib/LruCache/index.js';
import { buildMarketsAdjacencyGraph } from './buildMarketsAdjacencyGraph.js';
import { getTokenSwapPathsForTokenPairPrebuilt, createMarketEdgeLiquidityGetter, createNaiveSwapEstimator, createNaiveNetworkEstimator, createSwapEstimator, getMaxLiquidityMarketSwapPathFromTokenSwapPaths, getNaiveBestMarketSwapPathsFromTokenSwapPaths, marketRouteToMarketEdges, getBestSwapPath, getMarketAdjacencyGraph } from './swapRouting.js';
import { getSwapPathStats } from './swapStats.js';

const getWrappedAddress = (chainId, address) => {
  return address ? convertTokenAddress(chainId, address, "wrapped") : void 0;
};
const DEBUG_MARKET_ADJACENCY_GRAPH_CACHE = new LRUCache(100);
function buildMarketAdjacencyGraph(chainId, disabledMarkets) {
  if (!disabledMarkets?.length) {
    return getMarketAdjacencyGraph(chainId);
  }
  const cacheKey = `${chainId}-${JSON.stringify(disabledMarkets)}`;
  const cachedGraph = DEBUG_MARKET_ADJACENCY_GRAPH_CACHE.get(cacheKey);
  if (cachedGraph) {
    return cachedGraph;
  }
  const disabledMarketAddresses = disabledMarkets;
  const strippedMarkets = Object.fromEntries(
    Object.entries(MARKETS[chainId]).filter(
      ([marketAddress]) => !disabledMarketAddresses.includes(marketAddress)
    )
  );
  const graph = buildMarketsAdjacencyGraph(
    strippedMarkets
  );
  DEBUG_MARKET_ADJACENCY_GRAPH_CACHE.set(cacheKey, graph);
  return graph;
}
const FALLBACK_FIND_SWAP_PATH = () => void 0;
const createFindSwapPath = (params) => {
  const {
    chainId,
    fromTokenAddress,
    toTokenAddress,
    marketsInfoData,
    disabledMarkets,
    manualPath,
    gasEstimationParams,
    isExpressFeeSwap
  } = params;
  const wrappedFromAddress = getWrappedAddress(chainId, fromTokenAddress);
  const wrappedToAddress = getWrappedAddress(chainId, toTokenAddress);
  const wrappedToken = getWrappedToken(chainId);
  let tokenSwapPaths = wrappedFromAddress && wrappedToAddress ? getTokenSwapPathsForTokenPairPrebuilt(
    chainId,
    wrappedFromAddress,
    wrappedToAddress
  ) : [];
  const finalDisabledMarkets = [...disabledMarkets ?? []];
  if (isExpressFeeSwap) {
    const expressSwapUnavailableMarkets = Object.values(marketsInfoData ?? {}).filter((market) => !getIsMarketAvailableForExpressSwaps(market)).map((market) => market.marketTokenAddress);
    finalDisabledMarkets.push(...expressSwapUnavailableMarkets);
  }
  const isAtomicSwap = Boolean(isExpressFeeSwap);
  const marketAdjacencyGraph = buildMarketAdjacencyGraph(
    chainId,
    finalDisabledMarkets
  );
  const cache = {};
  if (!marketsInfoData) {
    return FALLBACK_FIND_SWAP_PATH;
  }
  const marketEdgeLiquidityGetter = createMarketEdgeLiquidityGetter(marketsInfoData);
  const naiveEstimator = createNaiveSwapEstimator(
    marketsInfoData,
    isAtomicSwap
  );
  const naiveNetworkEstimator = gasEstimationParams ? createNaiveNetworkEstimator({
    gasLimits: gasEstimationParams.gasLimits,
    tokensData: gasEstimationParams.tokensData,
    gasPrice: gasEstimationParams.gasPrice,
    chainId
  }) : void 0;
  const estimator = createSwapEstimator(marketsInfoData, isAtomicSwap);
  const findSwapPath = (usdIn, opts) => {
    if (tokenSwapPaths.length === 0 || !fromTokenAddress || !wrappedFromAddress || !wrappedToAddress) {
      return void 0;
    }
    const cacheKey = `${usdIn}-${opts?.order?.join("-") || "none"}`;
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    let swapPath = void 0;
    if (manualPath !== void 0) {
      swapPath = manualPath;
    } else if (opts?.order || usdIn === 0n) {
      const primaryOrder = opts?.order?.at(0) === "length" ? "length" : "liquidity";
      if (!marketEdgeLiquidityGetter) {
        swapPath = void 0;
      } else {
        let applicableTokenSwapPaths = tokenSwapPaths;
        if (primaryOrder === "length") {
          const shortestLength = Math.min(
            ...tokenSwapPaths.map((path) => path.length)
          );
          applicableTokenSwapPaths = tokenSwapPaths.filter(
            (path) => path.length === shortestLength
          );
        }
        const maxLiquidityPathInfo = getMaxLiquidityMarketSwapPathFromTokenSwapPaths({
          graph: marketAdjacencyGraph,
          tokenSwapPaths: applicableTokenSwapPaths,
          tokenInAddress: wrappedFromAddress,
          tokenOutAddress: wrappedToAddress,
          getLiquidity: marketEdgeLiquidityGetter
        });
        if (maxLiquidityPathInfo) {
          swapPath = maxLiquidityPathInfo.path;
        }
      }
    } else {
      if (naiveEstimator) {
        const naiveSwapRoutes = getNaiveBestMarketSwapPathsFromTokenSwapPaths({
          graph: marketAdjacencyGraph,
          tokenSwapPaths,
          usdIn,
          tokenInAddress: wrappedFromAddress,
          tokenOutAddress: wrappedToAddress,
          estimator: naiveEstimator,
          networkEstimator: naiveNetworkEstimator
        });
        if (naiveSwapRoutes?.length) {
          const edges = naiveSwapRoutes.map(
            (path) => marketRouteToMarketEdges(path, wrappedFromAddress, marketsInfoData)
          );
          swapPath = getBestSwapPath({
            routes: edges,
            usdIn,
            estimator,
            networkEstimator: naiveNetworkEstimator
          })?.map((edge) => edge.marketAddress);
        }
      }
    }
    if (!swapPath) {
      cache[cacheKey] = void 0;
      return void 0;
    }
    let result = getSwapPathStats({
      marketsInfoData,
      swapPath,
      initialCollateralAddress: fromTokenAddress,
      wrappedNativeTokenAddress: wrappedToken.address,
      shouldUnwrapNativeToken: toTokenAddress === NATIVE_TOKEN_ADDRESS,
      shouldApplyPriceImpact: true,
      usdIn,
      isAtomicSwap
    });
    cache[cacheKey] = result;
    return result;
  };
  return findSwapPath;
};

export { createFindSwapPath, getWrappedAddress };
//# sourceMappingURL=swapPath.js.map
//# sourceMappingURL=swapPath.js.map