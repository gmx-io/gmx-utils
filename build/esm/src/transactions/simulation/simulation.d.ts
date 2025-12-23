import type { ContractsChainId } from "../../configs/chains.js";
import { SwapPricingType } from "../../domain/swap/types.js";
import { SignedTokenPermit } from "../../domain/tokens/types.js";
import { TokenPrices, TokensData } from "../../domain/tokens/types.js";
import { ErrorData } from "../../lib/errors/index.js";
import { CreateOrderTxnParams } from "../batch/payloads/orderTransactions.js";
export type BlockTimestampData = {
    blockTimestamp: bigint;
    localTimestamp: bigint;
};
export type BlockTimestampResult = {
    blockTimestampData?: BlockTimestampData;
};
export declare function adjustBlockTimestamp(blockTimestampData: BlockTimestampData): bigint;
export type SimulateExecuteParams = {
    account: string;
    createMulticallPayload: string[];
    prices: SimulationPrices;
    value: bigint;
    tokenPermits: SignedTokenPermit[];
    isExpress: boolean;
    method?: "simulateExecuteLatestDeposit" | "simulateExecuteLatestWithdrawal" | "simulateExecuteLatestOrder" | "simulateExecuteLatestShift" | "simulateExecuteLatestGlvDeposit" | "simulateExecuteLatestGlvWithdrawal";
    swapPricingType?: SwapPricingType;
    blockTimestampData: BlockTimestampData | undefined;
};
export declare function isSimulationPassed(errorData: ErrorData): boolean;
export declare function simulateExecution(chainId: ContractsChainId, p: SimulateExecuteParams): Promise<void>;
export declare function getOrdersTriggerPriceOverrides(createOrderPayloads: CreateOrderTxnParams<any>[]): PriceOverride[];
export type SimulationPrices = ReturnType<typeof getSimulationPrices>;
export type PriceOverride = {
    tokenAddress: string;
    contractPrices?: TokenPrices;
    prices?: TokenPrices;
};
export declare function getSimulationPrices(chainId: number, tokensData: TokensData, overrides: PriceOverride[]): {
    primaryTokens: string[];
    primaryPrices: {
        min: bigint;
        max: bigint;
    }[];
};
