import { GasLimitsConfig } from "domain/executionFee/types";
import { MarketsInfoData } from "domain/markets/types";
import { FindSwapPath } from "domain/swap/types";
import { TokensData } from "domain/tokens/types";
export declare const getWrappedAddress: (chainId: number, address: string | undefined) => import("domain/tokens/types").ERC20Address | undefined;
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
