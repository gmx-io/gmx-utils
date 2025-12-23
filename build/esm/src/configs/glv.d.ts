import type { GlvInfo, GlvOrMarketInfo } from "../domain/glv/types.js";
import { ContractsChainId, SettlementChainId } from "./chains.js";
export declare const ENOUGH_DAYS_SINCE_LISTING_FOR_APY = 8;
export declare const MARKETS_INDEX: Record<number, Record<string, boolean>>;
export declare function isMarketEnabled(chainId: number, marketAddress: string): boolean;
export declare const GLV_MARKETS: {
    [chainId: number]: Record<string, {
        name: string | undefined;
        subtitle: string;
        shortening: string;
        glvTokenAddress: string;
        longTokenAddress: string;
        shortTokenAddress: string;
    }>;
};
export type GlvLabel = `GLV [${string}-${string}]`;
export declare function getGlvByLabel(chainId: ContractsChainId, label: GlvLabel): {
    name: string | undefined;
    subtitle: string;
    shortening: string;
    glvTokenAddress: string;
    longTokenAddress: string;
    shortTokenAddress: string;
};
export declare function getIsGlv(chainId: ContractsChainId, address: string): boolean;
export declare function getMarketUiConfig(chainId: number, marketAddress: string): any;
export declare function getSettlementChainTradableTokenAddresses(chainId: SettlementChainId): string[];
export declare function isGlvInfo(market?: GlvOrMarketInfo): market is GlvInfo;
export declare function isGlvEnabled(chainId: number): boolean;
