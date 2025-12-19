import uniqueId from "lodash/uniqueId";

import { PositionOrderInfo } from "domain/orders/types";
import { bigMath } from "lib/bigmath";
import { USD_DECIMALS } from "lib/numbers";
import {
  calculateDisplayDecimals,
  formatAmount,
  parseValue,
  removeTrailingZeros,
} from "lib/numbers";

import type { EntryField, InitialEntry, SidecarOrderEntryBase } from "./types";

export const MAX_PERCENTAGE = 100n;
export const PERCENTAGE_DECIMALS = 0;

export function getDefaultEntryField(
  decimals: number | undefined,
  { input, value, error }: Partial<EntryField> = {},
  visualMultiplier?: number
): EntryField {
  let nextInput = "";
  let nextValue: bigint | null = null;
  let nextError = error ?? null;

  if (input) {
    nextInput = input;
    nextValue = (decimals !== undefined && parseValue(input, decimals)) || null;
    if (nextValue !== null && visualMultiplier !== undefined) {
      nextValue = nextValue / BigInt(visualMultiplier);
    }
  } else if (value) {
    nextInput = "";
    if (decimals !== undefined) {
      nextInput = String(
        removeTrailingZeros(
          formatAmount(
            value,
            decimals,
            calculateDisplayDecimals(value, decimals, visualMultiplier),
            undefined,
            undefined,
            visualMultiplier
          )
        )
      );
    }
    nextValue = value;
  }

  return { input: nextInput, value: nextValue, error: nextError };
}

export function getDefaultEntry<T extends SidecarOrderEntryBase>(
  prefix: string,
  override?: Partial<SidecarOrderEntryBase>
): T {
  return {
    id: uniqueId(`${prefix}_`),
    price: getDefaultEntryField(USD_DECIMALS),
    sizeUsd: getDefaultEntryField(USD_DECIMALS),
    percentage: getDefaultEntryField(PERCENTAGE_DECIMALS, {
      value: MAX_PERCENTAGE,
    }),
    mode: "keepPercentage",
    order: null,
    txnType: null,
    ...override,
  } as T;
}

export function prepareInitialEntries({
  positionOrders,
  sort = "desc",
  visualMultiplier,
}: {
  positionOrders: PositionOrderInfo[] | undefined;
  sort: "desc" | "asc";
  visualMultiplier?: number;
}): undefined | InitialEntry[] {
  if (!positionOrders) return;

  return positionOrders
    .sort((a, b) => {
      const [first, second] = sort === "desc" ? [a, b] : [b, a];
      const diff = first.triggerPrice - second.triggerPrice;
      if (diff > 0) return -1;
      if (diff < 0) return 1;
      return 0;
    })
    .map((order) => {
      const entry: InitialEntry = {
        sizeUsd: getDefaultEntryField(USD_DECIMALS, {
          value: order.sizeDeltaUsd,
        }),
        price: getDefaultEntryField(
          USD_DECIMALS,
          { value: order.triggerPrice },
          visualMultiplier
        ),
        order,
      };

      return entry;
    });
}

export function calculateEntryPercentage(
  sizeUsd: bigint | null,
  totalPositionSizeUsd: bigint | undefined
): bigint | null {
  if (
    sizeUsd === undefined ||
    sizeUsd === null ||
    totalPositionSizeUsd === undefined ||
    totalPositionSizeUsd <= 0
  ) {
    return null;
  }

  return bigMath.mulDiv(sizeUsd, MAX_PERCENTAGE, totalPositionSizeUsd);
}

export function calculateEntrySizeUsd(
  percentage: bigint | null,
  totalPositionSizeUsd: bigint | undefined
): bigint | null {
  if (
    percentage === undefined ||
    percentage === null ||
    percentage === 0n ||
    totalPositionSizeUsd === undefined ||
    totalPositionSizeUsd <= 0
  ) {
    return null;
  }

  return bigMath.mulDiv(totalPositionSizeUsd, percentage, MAX_PERCENTAGE);
}

export function calculateEntryPrice(
  priceValue: bigint | null,
  visualMultiplier?: number
): EntryField {
  return getDefaultEntryField(
    USD_DECIMALS,
    { value: priceValue },
    visualMultiplier
  );
}
