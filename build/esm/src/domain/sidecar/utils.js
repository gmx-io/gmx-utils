import uniqueId from 'lodash/uniqueId';
import { parseUnits, formatUnits } from 'viem';
import { bigMath as bigMath$1 } from '../bigmath/index.js';

// src/domain/sidecar/utils.ts

// src/lib/bigmath/index.ts
var bigMath = {
  abs(x) {
    return x < 0n ? -x : x;
  },
  mulDiv(x, y, z, roundUpMagnitude = false) {
    const result = x * y / z;
    if (roundUpMagnitude && this.mulmod(x, y, z) > 0n) {
      return result + 1n;
    }
    return result;
  },
  max(max, ...rest) {
    return rest.reduce((currentMax, val) => currentMax < val ? val : currentMax, max);
  },
  min(min, ...rest) {
    return rest.reduce((currentMin, val) => currentMin > val ? val : currentMin, min);
  },
  avg(...values) {
    let sum = 0n;
    let count = 0n;
    for (const value of values) {
      if (value !== void 0) {
        sum += value;
        count += 1n;
      }
    }
    if (count === 0n) {
      return void 0;
    }
    return sum / count;
  },
  divRound(x, y) {
    return x / y + (x % y * 2n > y ? 1n : 0n);
  },
  divRoundUp(x, y) {
    return (x + y - 1n) / y;
  },
  mulmod(x, y, m) {
    return x * y % m;
  },
  clamp(value, min, max) {
    return bigMath.max(min, bigMath.min(value, max));
  }
};
var USD_DECIMALS = 30;
var PRECISION_DECIMALS = 30;
expandDecimals(1, PRECISION_DECIMALS);
BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
function expandDecimals(n, decimals) {
  return BigInt(n) * 10n ** BigInt(decimals);
}
function bigintToNumber(value, decimals) {
  const negative = value < 0;
  if (negative) value *= -1n;
  const precision = 10n ** BigInt(decimals);
  const int = value / precision;
  const frac = value % precision;
  const num = parseFloat(`${int}.${frac.toString().padStart(decimals, "0")}`);
  return negative ? -num : num;
}
var formatAmount = (amount, tokenDecimals, displayDecimals, useCommas, defaultValue, visualMultiplier) => {
  if (defaultValue === void 0 || defaultValue === null) {
    defaultValue = "...";
  }
  if (amount === void 0 || amount === null || amount === "") {
    return defaultValue;
  }
  if (displayDecimals === void 0) {
    displayDecimals = 4;
  }
  const amountBigInt = roundWithDecimals(
    BigInt(amount) * BigInt(visualMultiplier ?? 1),
    {
      displayDecimals,
      decimals: tokenDecimals
    }
  );
  let amountStr = formatUnits(amountBigInt, tokenDecimals);
  amountStr = limitDecimals(amountStr, displayDecimals);
  if (displayDecimals !== 0) {
    amountStr = padDecimals(amountStr, displayDecimals);
  }
  return amountStr;
};
var limitDecimals = (amount, maxDecimals) => {
  let amountStr = amount.toString();
  if (maxDecimals === void 0) {
    return amountStr;
  }
  if (maxDecimals === 0) {
    return amountStr.split(".")[0];
  }
  const dotIndex = amountStr.indexOf(".");
  if (dotIndex !== -1) {
    let decimals = amountStr.length - dotIndex - 1;
    if (decimals > maxDecimals) {
      amountStr = amountStr.substr(
        0,
        amountStr.length - (decimals - maxDecimals)
      );
    }
  }
  return amountStr;
};
var padDecimals = (amount, minDecimals) => {
  let amountStr = amount.toString();
  const dotIndex = amountStr.indexOf(".");
  if (dotIndex !== -1) {
    const decimals = amountStr.length - dotIndex - 1;
    if (decimals < minDecimals) {
      amountStr = amountStr.padEnd(
        amountStr.length + (minDecimals - decimals),
        "0"
      );
    }
  } else {
    amountStr = amountStr + "." + "0".repeat(minDecimals);
  }
  return amountStr;
};
function roundWithDecimals(value, opts) {
  if (opts.displayDecimals === opts.decimals) {
    return BigInt(value);
  }
  let valueString = value.toString();
  let isNegative = false;
  if (valueString[0] === "-") {
    valueString = valueString.slice(1);
    isNegative = true;
  }
  if (valueString.length < opts.decimals) {
    valueString = valueString.padStart(opts.decimals, "0");
  }
  const mainPart = valueString.slice(
    0,
    valueString.length - opts.decimals + opts.displayDecimals
  );
  const partToRound = valueString.slice(
    valueString.length - opts.decimals + opts.displayDecimals
  );
  let mainPartBigInt = BigInt(mainPart);
  let returnValue = mainPartBigInt;
  if (partToRound.length !== 0) {
    if (Number(partToRound[0]) >= 5) {
      mainPartBigInt += 1n;
    }
    returnValue = BigInt(
      mainPartBigInt.toString() + new Array(partToRound.length).fill("0").join("")
    );
  }
  return isNegative ? returnValue * -1n : returnValue;
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
var parseValue = (value, tokenDecimals) => {
  const pValue = parseFloat(value);
  if (isNaN(pValue)) {
    return void 0;
  }
  value = limitDecimals(value, tokenDecimals);
  const amount = parseUnits(value, tokenDecimals);
  return bigNumberify(amount);
};
function removeTrailingZeros(amount) {
  const amountWithoutZeros = Number(amount);
  if (!amountWithoutZeros) return amount;
  return amountWithoutZeros;
}
function calculateDisplayDecimals(price, decimals = USD_DECIMALS, visualMultiplier = 1, isStable = false) {
  if (price === void 0 || price === 0n) return 2;
  const priceNumber = bigintToNumber(
    bigMath$1.abs(price) * BigInt(visualMultiplier),
    decimals
  );
  if (isNaN(priceNumber)) return 2;
  if (isStable) {
    if (priceNumber >= 0.1) return 2;
    if (priceNumber >= 0.01) return 3;
    if (priceNumber >= 1e-3) return 4;
    if (priceNumber >= 1e-4) return 5;
    if (priceNumber >= 1e-5) return 6;
    if (priceNumber >= 1e-6) return 7;
    if (priceNumber >= 1e-7) return 8;
    if (priceNumber >= 1e-8) return 9;
  } else {
    if (priceNumber >= 1e3) return 2;
    if (priceNumber >= 100) return 3;
    if (priceNumber >= 1) return 4;
    if (priceNumber >= 0.1) return 5;
    if (priceNumber >= 0.01) return 6;
    if (priceNumber >= 1e-4) return 7;
    if (priceNumber >= 1e-5) return 8;
  }
  return 9;
}

// src/domain/sidecar/utils.ts
var MAX_PERCENTAGE = 100n;
var PERCENTAGE_DECIMALS = 0;
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