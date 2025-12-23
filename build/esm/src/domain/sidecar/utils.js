import uniqueId from 'lodash/uniqueId';
import { bigMath } from '../../lib/bigmath/index.js';
import { parseValue, removeTrailingZeros, formatAmount, calculateDisplayDecimals, USD_DECIMALS } from '../../lib/numbers/index.js';

const MAX_PERCENTAGE = 100n;
const PERCENTAGE_DECIMALS = 0;
function getDefaultEntryField(decimals, { input, value, error } = {}, visualMultiplier) {
  let nextInput = "";
  let nextValue = null;
  let nextError = error ?? null;
  if (input) {
    nextInput = input;
    nextValue = decimals !== void 0 && parseValue(input, decimals) || null;
    if (nextValue !== null && visualMultiplier !== void 0) {
      nextValue = nextValue / BigInt(visualMultiplier);
    }
  } else if (value) {
    nextInput = "";
    if (decimals !== void 0) {
      nextInput = String(
        removeTrailingZeros(
          formatAmount(
            value,
            decimals,
            calculateDisplayDecimals(value, decimals, visualMultiplier),
            void 0,
            void 0,
            visualMultiplier
          )
        )
      );
    }
    nextValue = value;
  }
  return { input: nextInput, value: nextValue, error: nextError };
}
function getDefaultEntry(prefix, override) {
  return {
    id: uniqueId(`${prefix}_`),
    price: getDefaultEntryField(USD_DECIMALS),
    sizeUsd: getDefaultEntryField(USD_DECIMALS),
    percentage: getDefaultEntryField(PERCENTAGE_DECIMALS, {
      value: MAX_PERCENTAGE
    }),
    mode: "keepPercentage",
    order: null,
    txnType: null,
    ...override
  };
}
function prepareInitialEntries({
  positionOrders,
  sort = "desc",
  visualMultiplier
}) {
  if (!positionOrders) return;
  return positionOrders.sort((a, b) => {
    const [first, second] = sort === "desc" ? [a, b] : [b, a];
    const diff = first.triggerPrice - second.triggerPrice;
    if (diff > 0) return -1;
    if (diff < 0) return 1;
    return 0;
  }).map((order) => {
    const entry = {
      sizeUsd: getDefaultEntryField(USD_DECIMALS, {
        value: order.sizeDeltaUsd
      }),
      price: getDefaultEntryField(
        USD_DECIMALS,
        { value: order.triggerPrice },
        visualMultiplier
      ),
      order
    };
    return entry;
  });
}
function calculateEntryPercentage(sizeUsd, totalPositionSizeUsd) {
  if (sizeUsd === void 0 || sizeUsd === null || totalPositionSizeUsd === void 0 || totalPositionSizeUsd <= 0) {
    return null;
  }
  return bigMath.mulDiv(sizeUsd, MAX_PERCENTAGE, totalPositionSizeUsd);
}
function calculateEntrySizeUsd(percentage, totalPositionSizeUsd) {
  if (percentage === void 0 || percentage === null || percentage === 0n || totalPositionSizeUsd === void 0 || totalPositionSizeUsd <= 0) {
    return null;
  }
  return bigMath.mulDiv(totalPositionSizeUsd, percentage, MAX_PERCENTAGE);
}
function calculateEntryPrice(priceValue, visualMultiplier) {
  return getDefaultEntryField(
    USD_DECIMALS,
    { value: priceValue },
    visualMultiplier
  );
}

export { MAX_PERCENTAGE, PERCENTAGE_DECIMALS, calculateEntryPercentage, calculateEntryPrice, calculateEntrySizeUsd, getDefaultEntry, getDefaultEntryField, prepareInitialEntries };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map