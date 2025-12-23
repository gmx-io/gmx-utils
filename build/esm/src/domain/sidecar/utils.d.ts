import { PositionOrderInfo } from "../orders/types.js";
import type { EntryField, InitialEntry, SidecarOrderEntryBase } from "./types.js";
export declare const MAX_PERCENTAGE = 100n;
export declare const PERCENTAGE_DECIMALS = 0;
export declare function getDefaultEntryField(decimals: number | undefined, { input, value, error }?: Partial<EntryField>, visualMultiplier?: number): EntryField;
export declare function getDefaultEntry<T extends SidecarOrderEntryBase>(prefix: string, override?: Partial<SidecarOrderEntryBase>): T;
export declare function prepareInitialEntries({ positionOrders, sort, visualMultiplier, }: {
    positionOrders: PositionOrderInfo[] | undefined;
    sort: "desc" | "asc";
    visualMultiplier?: number;
}): undefined | InitialEntry[];
export declare function calculateEntryPercentage(sizeUsd: bigint | null, totalPositionSizeUsd: bigint | undefined): bigint | null;
export declare function calculateEntrySizeUsd(percentage: bigint | null, totalPositionSizeUsd: bigint | undefined): bigint | null;
export declare function calculateEntryPrice(priceValue: bigint | null, visualMultiplier?: number): EntryField;
