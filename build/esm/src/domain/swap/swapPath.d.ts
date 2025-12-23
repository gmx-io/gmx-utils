import { GasLimitsConfig } from "../executionFee/types.js";
import { MarketsInfoData } from "../markets/types.js";
import { FindSwapPath } from "../swap/types.js";
import { TokensData } from "../tokens/types.js";
export declare const getWrappedAddress: (chainId: number, address: string | undefined) => import("../tokens/types.js").ERC20Address | undefined;
export declare const createFindSwapPath: (params: {
    chainId: number;
    fromTokenAddress: string | undefined;
    toTokenAddress: string | undefined;
    marketsInfoData: MarketsInfoData | undefined;
    /**
     * Pass gas limits to take into account gas costs in swap path
     */
    gasEstimationParams?: {
        gasPrice: bigint;
        gasLimits: GasLimitsConfig;
        tokensData: TokensData;
    } | undefined;
    isExpressFeeSwap: boolean | undefined;
    disabledMarkets?: string[] | undefined;
    manualPath?: string[] | undefined;
}) => FindSwapPath;
