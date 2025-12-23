import { maxUint256 } from 'viem';
import { DEFAULT_NAIVE_TOP_PATHS_COUNT } from '../../configs/swap.js';
import { estimateOrderOraclePriceCount, getExecutionFee } from '../executionFee/index.js';
import { getNaiveEstimatedGasBySwapCount } from '../executionFee/getNaiveEstimatedGasBySwapCount.js';
import { getTokenPoolType, getAvailableUsdLiquidityForCollateral } from '../markets/utils.js';
import { TOKEN_SWAP_PATHS, MARKETS_ADJACENCY_GRAPH, REACHABLE_TOKENS } from '../swap/preparedSwapData.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { bigintToNumber, PRECISION, PRECISION_DECIMALS } from '../../lib/numbers/index.js';
import { getByKey } from '../../lib/objects/index.js';
import { getSwapStats } from './swapStats.js';

const createSwapEstimator = (marketsInfoData, isAtomicSwap) => {
  return (e, usdIn) => {
    const marketInfo = marketsInfoData[e.marketAddress];
    if (!marketInfo || marketInfo.isDisabled) {
      return {
        usdOut: 0n
      };
    }
    const swapStats = getSwapStats({
      marketInfo,
      usdIn,
      tokenInAddress: e.from,
      tokenOutAddress: e.to,
      shouldApplyPriceImpact: true,
      isAtomicSwap
    });
    const isOutLiquidity = swapStats?.isOutLiquidity;
    const isOutCapacity = swapStats?.isOutCapacity;
    const usdOut = swapStats?.usdOut;
    if (usdOut === void 0 || isOutLiquidity || isOutCapacity) {
      return {
        usdOut: 0n
      };
    }
    return {
      usdOut
    };
  };
};
const createMarketEdgeLiquidityGetter = (marketsInfoData) => {
  return (e) => {
    const marketInfo = getByKey(marketsInfoData, e.marketAddress);
    if (!marketInfo || marketInfo.isDisabled) {
      return 0n;
    }
    const isTokenOutLong = getTokenPoolType(marketInfo, e.to) === "long";
    const liquidity = getAvailableUsdLiquidityForCollateral(
      marketInfo,
      isTokenOutLong
    );
    return liquidity;
  };
};
const createNaiveSwapEstimator = (marketsInfoData, isAtomicSwap) => {
  return (e, usdIn) => {
    let marketInfo = marketsInfoData[e.marketAddress];
    if (marketInfo === void 0 || marketInfo.isDisabled) {
      return { swapYield: 0 };
    }
    const swapStats = getSwapStats({
      marketInfo,
      usdIn,
      tokenInAddress: e.from,
      tokenOutAddress: e.to,
      shouldApplyPriceImpact: true,
      isAtomicSwap
    });
    const usdOut = swapStats?.usdOut;
    if (usdOut === void 0 || usdOut === 0n || swapStats.isOutCapacity || swapStats.isOutLiquidity) {
      return { swapYield: 0 };
    }
    const swapYield = bigintToNumber(
      usdOut * PRECISION / usdIn,
      PRECISION_DECIMALS
    );
    return { swapYield };
  };
};
const createNaiveNetworkEstimator = ({
  gasLimits,
  tokensData,
  gasPrice,
  chainId
}) => {
  return (usdIn, swapsCount) => {
    const estimatedGas = getNaiveEstimatedGasBySwapCount(
      gasLimits.singleSwap,
      swapsCount
    );
    if (estimatedGas === null || estimatedGas === void 0)
      return { networkYield: 1, usdOut: usdIn };
    const oraclePriceCount = estimateOrderOraclePriceCount(swapsCount);
    const feeUsd = getExecutionFee(
      chainId,
      gasLimits,
      tokensData,
      estimatedGas,
      gasPrice,
      oraclePriceCount
    )?.feeUsd;
    if (feeUsd === void 0) return { networkYield: 1, usdOut: usdIn };
    const networkYield = bigintToNumber(
      bigMath.mulDiv(usdIn, PRECISION, usdIn + feeUsd),
      PRECISION_DECIMALS
    );
    return { networkYield, usdOut: usdIn - feeUsd };
  };
};
function getBestSwapPath({
  routes,
  usdIn,
  estimator,
  networkEstimator
}) {
  if (routes.length === 0) {
    return void 0;
  }
  let bestRoute = routes[0];
  let bestUsdOut = 0n;
  for (const route of routes) {
    try {
      let pathUsdOut = route.reduce((prevUsdOut, edge) => {
        const { usdOut } = estimator(edge, prevUsdOut);
        return usdOut;
      }, usdIn);
      if (networkEstimator) {
        const { usdOut } = networkEstimator(pathUsdOut, route.length);
        pathUsdOut = usdOut;
      }
      if (pathUsdOut > bestUsdOut) {
        bestRoute = route;
        bestUsdOut = pathUsdOut;
      }
    } catch (e) {
      continue;
    }
  }
  return bestRoute;
}
function getNaiveBestMarketSwapPathsFromTokenSwapPaths({
  graph,
  tokenSwapPaths,
  usdIn,
  tokenInAddress,
  tokenOutAddress,
  estimator,
  topPathsCount = DEFAULT_NAIVE_TOP_PATHS_COUNT,
  networkEstimator
}) {
  const cachedBestMarketForTokenEdge = {};
  const calculatedCache = {};
  const topPaths = [];
  const networkYieldCache = {};
  for (const pathType of tokenSwapPaths) {
    const marketPath = [];
    let pathTypeSwapYield = 1;
    let bad = false;
    const tokenSwapCounter = {};
    for (let hopIndex = 0; hopIndex <= pathType.length; hopIndex++) {
      const tokenHopFromAddress = hopIndex === 0 ? tokenInAddress : pathType[hopIndex - 1];
      const tokenHopToAddress = hopIndex === pathType.length ? tokenOutAddress : pathType[hopIndex];
      const marketAddresses = getMarketsForTokenPair(
        graph,
        tokenHopFromAddress,
        tokenHopToAddress
      );
      if (marketAddresses.length === 0) {
        bad = true;
        break;
      }
      const tokenSwapCount = tokenSwapCounter[tokenHopFromAddress]?.[tokenHopToAddress] || 0;
      const key = `${tokenHopFromAddress}-${tokenHopToAddress}-${tokenSwapCount}`;
      let bestMarketInfo = cachedBestMarketForTokenEdge[key];
      if (!bestMarketInfo) {
        calculatedCache[tokenHopFromAddress] = calculatedCache[tokenHopFromAddress] || {};
        calculatedCache[tokenHopFromAddress][tokenHopToAddress] = calculatedCache[tokenHopFromAddress][tokenHopToAddress] || {};
        bestMarketInfo = getBestMarketForTokenEdge({
          marketAddresses,
          usdIn,
          tokenInAddress: tokenHopFromAddress,
          tokenOutAddress: tokenHopToAddress,
          estimator,
          marketPath,
          calculatedCache: calculatedCache[tokenHopFromAddress][tokenHopToAddress]
        });
        if (!bestMarketInfo) {
          bad = true;
          break;
        }
        cachedBestMarketForTokenEdge[key] = bestMarketInfo;
      }
      if (bestMarketInfo.swapYield === 0) {
        bad = true;
        break;
      }
      pathTypeSwapYield *= bestMarketInfo.swapYield;
      marketPath.push(bestMarketInfo.marketAddress);
      tokenSwapCounter[tokenHopFromAddress] = tokenSwapCounter[tokenHopFromAddress] || {};
      tokenSwapCounter[tokenHopFromAddress][tokenHopToAddress] = (tokenSwapCounter[tokenHopFromAddress][tokenHopToAddress] || 0) + 1;
    }
    if (bad) {
      continue;
    }
    if (topPaths.length < topPathsCount) {
      topPaths.push({ marketPath, swapYield: pathTypeSwapYield });
    } else {
      let adjustedPathTypeSwapYield = pathTypeSwapYield;
      if (networkEstimator) {
        let networkYield = networkYieldCache[marketPath.length];
        if (networkYield === void 0) {
          networkYield = networkEstimator(
            usdIn,
            marketPath.length
          ).networkYield;
          networkYieldCache[marketPath.length] = networkYield;
        }
        adjustedPathTypeSwapYield = adjustedPathTypeSwapYield * networkYield;
      }
      let minSwapYield = topPaths[0].swapYield;
      let minSwapYieldIndex = 0;
      for (let i = 1; i < topPaths.length; i++) {
        if (topPaths[i].swapYield < minSwapYield) {
          minSwapYield = topPaths[i].swapYield;
          minSwapYieldIndex = i;
        }
      }
      if (adjustedPathTypeSwapYield > minSwapYield) {
        topPaths[minSwapYieldIndex] = {
          marketPath,
          swapYield: adjustedPathTypeSwapYield
        };
      }
    }
  }
  return topPaths.map((p) => p.marketPath);
}
function getMarketsForTokenPair(graph, tokenAAddress, tokenBAddress) {
  if (graph[tokenAAddress]?.[tokenBAddress]) {
    return graph[tokenAAddress][tokenBAddress];
  }
  if (graph[tokenBAddress]?.[tokenAAddress]) {
    return graph[tokenBAddress][tokenAAddress];
  }
  return [];
}
function getBestMarketForTokenEdge({
  marketAddresses,
  usdIn,
  tokenInAddress,
  tokenOutAddress,
  estimator,
  marketPath,
  calculatedCache
}) {
  let bestMarketAddress = marketAddresses[0];
  let bestYield = 0;
  let found = false;
  for (const marketAddress of marketAddresses) {
    if (marketPath && marketPath.includes(marketAddress)) {
      continue;
    }
    let swapYield = void 0;
    const key = marketAddress;
    if (calculatedCache) {
      swapYield = calculatedCache[key];
    }
    if (swapYield === void 0) {
      swapYield = estimator(
        {
          marketAddress,
          from: tokenInAddress,
          to: tokenOutAddress
        },
        usdIn
      ).swapYield;
      if (calculatedCache) {
        calculatedCache[key] = swapYield;
      }
    }
    if (swapYield > bestYield) {
      bestYield = swapYield;
      bestMarketAddress = marketAddress;
      found = true;
    }
  }
  if (!found) {
    return void 0;
  }
  return {
    marketAddress: bestMarketAddress,
    swapYield: bestYield
  };
}
function marketRouteToMarketEdges(marketPath, from, marketsInfoData) {
  let edges = [];
  for (let i = 0; i < marketPath.length; i++) {
    const currentFrom = i === 0 ? from : edges[i - 1].to;
    const currentTo = marketsInfoData[marketPath[i]].longTokenAddress === currentFrom ? marketsInfoData[marketPath[i]].shortTokenAddress : marketsInfoData[marketPath[i]].longTokenAddress;
    edges.push({
      from: currentFrom,
      to: currentTo,
      marketAddress: marketPath[i]
    });
  }
  return edges;
}
function getTokenSwapPathsForTokenPair(tokenSwapPaths, tokenAAddress, tokenBAddress) {
  if (tokenSwapPaths[tokenAAddress]?.[tokenBAddress]) {
    return tokenSwapPaths[tokenAAddress][tokenBAddress];
  }
  if (tokenSwapPaths[tokenBAddress]?.[tokenAAddress]) {
    return tokenSwapPaths[tokenBAddress][tokenAAddress].map(
      (route) => [...route].reverse()
    );
  }
  return [];
}
function getTokenSwapPathsForTokenPairPrebuilt(chainId, from, to) {
  return getTokenSwapPathsForTokenPair(TOKEN_SWAP_PATHS[chainId], from, to);
}
function getMarketAdjacencyGraph(chainId) {
  return MARKETS_ADJACENCY_GRAPH[chainId];
}
function findAllReachableTokens(chainId, from) {
  return REACHABLE_TOKENS[chainId][from];
}
function getMaxLiquidityMarketSwapPathFromTokenSwapPaths({
  graph,
  tokenSwapPaths,
  tokenInAddress,
  tokenOutAddress,
  getLiquidity
}) {
  const cachedMaxLiquidityMarketForTokenEdge = {};
  let bestMarketPath = void 0;
  let bestLiquidity = 0n;
  for (const pathType of tokenSwapPaths) {
    let bad = false;
    let bestMarketPathForPathType = [];
    let pathTypeBestLiquidity = maxUint256;
    for (let hopIndex = 0; hopIndex <= pathType.length; hopIndex++) {
      const tokenFromAddress = hopIndex === 0 ? tokenInAddress : pathType[hopIndex - 1];
      const tokenToAddress = hopIndex === pathType.length ? tokenOutAddress : pathType[hopIndex];
      const markets = getMarketsForTokenPair(
        graph,
        tokenFromAddress,
        tokenToAddress
      );
      if (markets.length === 0) {
        bad = true;
        break;
      }
      let bestMarketInfo = cachedMaxLiquidityMarketForTokenEdge[tokenFromAddress]?.[tokenToAddress];
      if (!bestMarketInfo) {
        bestMarketInfo = getMaxLiquidityMarketForTokenEdge({
          markets,
          tokenInAddress,
          tokenOutAddress,
          getLiquidity
        });
        cachedMaxLiquidityMarketForTokenEdge[tokenFromAddress] = cachedMaxLiquidityMarketForTokenEdge[tokenFromAddress] || {};
        cachedMaxLiquidityMarketForTokenEdge[tokenFromAddress][tokenToAddress] = bestMarketInfo;
      }
      bestMarketPathForPathType.push(bestMarketInfo.marketAddress);
      if (bestMarketInfo.liquidity < pathTypeBestLiquidity) {
        pathTypeBestLiquidity = bestMarketInfo.liquidity;
      }
      if (pathTypeBestLiquidity < bestLiquidity) {
        bad = true;
        break;
      }
    }
    if (bad) {
      continue;
    }
    if (pathTypeBestLiquidity > bestLiquidity) {
      bestLiquidity = pathTypeBestLiquidity;
      bestMarketPath = bestMarketPathForPathType;
    }
  }
  return bestMarketPath ? { path: bestMarketPath, liquidity: bestLiquidity } : void 0;
}
function getMaxLiquidityMarketForTokenEdge({
  markets,
  tokenInAddress,
  tokenOutAddress,
  getLiquidity
}) {
  let bestMarketAddress = markets[0];
  let bestLiquidity = 0n;
  for (const market of markets) {
    const liquidity = getLiquidity({
      marketAddress: market,
      from: tokenInAddress,
      to: tokenOutAddress
    });
    if (liquidity > bestLiquidity) {
      bestLiquidity = liquidity;
      bestMarketAddress = market;
    }
  }
  return {
    marketAddress: bestMarketAddress,
    liquidity: bestLiquidity
  };
}

export { createMarketEdgeLiquidityGetter, createNaiveNetworkEstimator, createNaiveSwapEstimator, createSwapEstimator, findAllReachableTokens, getBestMarketForTokenEdge, getBestSwapPath, getMarketAdjacencyGraph, getMarketsForTokenPair, getMaxLiquidityMarketForTokenEdge, getMaxLiquidityMarketSwapPathFromTokenSwapPaths, getNaiveBestMarketSwapPathsFromTokenSwapPaths, getTokenSwapPathsForTokenPair, getTokenSwapPathsForTokenPairPrebuilt, marketRouteToMarketEdges };
//# sourceMappingURL=swapRouting.js.map
//# sourceMappingURL=swapRouting.js.map