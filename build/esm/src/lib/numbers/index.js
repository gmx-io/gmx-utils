import { formatUnits, parseUnits } from 'viem';
import { bigMath } from '../bigmath/index.js';

const USD_DECIMALS = 30;
const BASIS_POINTS_DIVISOR = 1e4;
const BASIS_POINTS_DIVISOR_BIGINT = 10000n;
const BASIS_POINTS_DECIMALS = 4;
const PRECISION_DECIMALS = 30;
const PRECISION = expandDecimals(1, PRECISION_DECIMALS);
const BN_ZERO = 0n;
const BN_ONE = 1n;
const BN_NEGATIVE_ONE = -1n;
const MaxUint256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
const PERCENT_PRECISION_DECIMALS = PRECISION_DECIMALS - 2;
const MAX_EXCEEDING_THRESHOLD = "1000000000";
const MIN_EXCEEDING_THRESHOLD = "0.01";
const TRIGGER_PREFIX_ABOVE = ">";
const TRIGGER_PREFIX_BELOW = "<";
function isNonZero(value) {
  return value !== 0 && value !== 0n;
}
function safeDivide(a, b) {
  return a / b;
}
function expandDecimals(n, decimals) {
  return BigInt(n) * 10n ** BigInt(decimals);
}
function basisPointsToFloat(basisPoints) {
  return basisPoints * PRECISION / BASIS_POINTS_DIVISOR_BIGINT;
}
function getBasisPoints(numerator, denominator, shouldRoundUp = false) {
  const result = numerator * BASIS_POINTS_DIVISOR_BIGINT / denominator;
  if (shouldRoundUp) {
    const remainder = numerator * BASIS_POINTS_DIVISOR_BIGINT % denominator;
    if (remainder !== 0n) {
      return result < 0n ? result - 1n : result + 1n;
    }
  }
  return result;
}
function roundUpMagnitudeDivision(a, b) {
  if (a < 0n) {
    return (a - b + 1n) / b;
  }
  return (a + b - 1n) / b;
}
function applyFactor(value, factor) {
  return value * factor / PRECISION;
}
function numberToBigint(value, decimals) {
  const negative = value < 0;
  if (negative) value *= -1;
  const int = Math.trunc(value);
  let frac = value - int;
  let res = BigInt(int);
  for (let i = 0; i < decimals; i++) {
    res *= 10n;
    if (frac !== 0) {
      frac *= 10;
      const fracInt = Math.trunc(frac);
      res += BigInt(fracInt);
      frac -= fracInt;
    }
  }
  return negative ? -res : res;
}
const trimZeroDecimals = (amount) => {
  if (parseFloat(amount) === parseInt(amount)) {
    return parseInt(amount).toString();
  }
  return amount;
};
function bigintToNumber(value, decimals) {
  const negative = value < 0;
  if (negative) value *= -1n;
  const precision = 10n ** BigInt(decimals);
  const int = value / precision;
  const frac = value % precision;
  const num = parseFloat(`${int}.${frac.toString().padStart(decimals, "0")}`);
  return negative ? -num : num;
}
function adjustForDecimals(amount, divDecimals, mulDecimals) {
  return amount * expandDecimals(1, mulDecimals) / expandDecimals(1, divDecimals);
}
function formatUsd(usd, opts = {}) {
  const { fallbackToZero = false, displayDecimals = 2 } = opts;
  if (typeof usd !== "bigint") {
    if (fallbackToZero) {
      usd = 0n;
    } else {
      return void 0;
    }
  }
  if (opts.visualMultiplier) {
    usd *= BigInt(opts.visualMultiplier);
  }
  const defaultMinThreshold = displayDecimals > 1 ? "0." + "0".repeat(displayDecimals - 1) + "1" : void 0;
  const exceedingInfo = getLimitedDisplay(usd, USD_DECIMALS, {
    maxThreshold: opts.maxThreshold,
    minThreshold: opts.minThreshold ?? defaultMinThreshold
  });
  const maybePlus = opts.displayPlus ? "+" : "";
  const sign = usd < 0n ? "-" : maybePlus;
  const symbol = exceedingInfo.symbol ? `${exceedingInfo.symbol}\xA0` : "";
  const displayUsd = formatAmount(
    exceedingInfo.value,
    USD_DECIMALS,
    displayDecimals,
    true
  );
  return `${symbol}${sign}$\u200A${displayUsd}`;
}
function formatBigUsd(amount, opts = {}) {
  return formatUsd(amount, {
    maxThreshold: "9999999999999999999999999",
    displayDecimals: opts.displayDecimals ?? 0
  });
}
function formatDeltaUsd(deltaUsd, percentage, opts = {}) {
  if (typeof deltaUsd !== "bigint") {
    if (opts.fallbackToZero) {
      return `${formatUsd(0n)} (${formatAmount(0n, 2, 2)}%)`;
    }
    return void 0;
  }
  const sign = getPlusOrMinusSymbol(deltaUsd, {
    showPlusForZero: opts.showPlusForZero
  });
  const exceedingInfo = getLimitedDisplay(deltaUsd, USD_DECIMALS);
  const percentageStr = percentage !== void 0 ? ` (${sign}${formatPercentage(bigMath.abs(percentage))})` : "";
  const deltaUsdStr = formatAmount(exceedingInfo.value, USD_DECIMALS, 2, true);
  const symbol = exceedingInfo.symbol ? `${exceedingInfo.symbol} ` : "";
  return `${symbol}${sign}$\u200A${deltaUsdStr}${percentageStr}`;
}
function formatPercentage(percentage, opts = {}) {
  const {
    fallbackToZero = false,
    signed = false,
    displayDecimals = 2,
    bps = true,
    showPlus = true
  } = opts;
  if (percentage === void 0) {
    if (fallbackToZero) {
      return `${formatAmount(
        0n,
        PERCENT_PRECISION_DECIMALS,
        displayDecimals
      )}%`;
    }
    return void 0;
  }
  const sign = signed ? `${getPlusOrMinusSymbol(percentage)}` : "";
  const displaySign = !showPlus && sign === "+" ? "" : `${sign}`;
  return `${displaySign}${displaySign ? "\u200A" : ""}${formatAmount(
    bigMath.abs(percentage),
    bps ? 2 : PERCENT_PRECISION_DECIMALS,
    displayDecimals
  )}%`;
}
function formatTokenAmount(amount, tokenDecimals, symbol, opts = {}) {
  const {
    showAllSignificant = false,
    fallbackToZero = false,
    useCommas = false,
    minThreshold = "0",
    maxThreshold
  } = opts;
  const displayDecimals = opts.displayDecimals ?? (opts.isStable ? 2 : 4);
  const symbolStr = symbol ? `\xA0${symbol}` : "";
  if (typeof amount !== "bigint" || !tokenDecimals) {
    if (fallbackToZero) {
      amount = 0n;
      tokenDecimals = displayDecimals;
    } else {
      return void 0;
    }
  }
  let amountStr;
  const maybePlus = opts.displayPlus ? "+" : "";
  const sign = amount < 0n ? "-" : maybePlus;
  if (showAllSignificant) {
    amountStr = formatAmountFree(amount, tokenDecimals, tokenDecimals);
  } else {
    const exceedingInfo = getLimitedDisplay(amount, tokenDecimals, {
      maxThreshold,
      minThreshold
    });
    const symbol2 = exceedingInfo.symbol ? `${exceedingInfo.symbol} ` : "";
    amountStr = `${symbol2}${sign}${formatAmount(
      exceedingInfo.value,
      tokenDecimals,
      displayDecimals,
      useCommas,
      void 0
    )}`;
  }
  return `${amountStr}${symbolStr}`;
}
function formatTokenAmountWithUsd(tokenAmount, usdAmount, tokenSymbol, tokenDecimals, opts = {}) {
  if (typeof tokenAmount !== "bigint" || typeof usdAmount !== "bigint" || !tokenSymbol || !tokenDecimals) {
    if (!opts.fallbackToZero) {
      return void 0;
    }
  }
  const tokenStr = formatTokenAmount(tokenAmount, tokenDecimals, tokenSymbol, {
    ...opts,
    useCommas: true,
    displayPlus: opts.displayPlus
  });
  const usdStr = formatUsd(usdAmount, {
    fallbackToZero: opts.fallbackToZero,
    displayPlus: opts.displayPlus
  });
  return `${tokenStr} (${usdStr})`;
}
function formatRatePercentage(rate, opts) {
  if (typeof rate !== "bigint") {
    return "-";
  }
  const signed = opts?.signed ?? true;
  const plurOrMinus = signed ? getPlusOrMinusSymbol(rate) : "";
  const amount = bigMath.abs(rate * 100n);
  return `${plurOrMinus}\u200A${formatAmount(
    amount,
    30,
    opts?.displayDecimals ?? 4
  )}%`;
}
function formatUsdPrice(price, opts = {}) {
  if (price === void 0) {
    return;
  }
  if (price < 0n) {
    return "NA";
  }
  const decimals = calculateDisplayDecimals(
    price,
    void 0,
    opts.visualMultiplier
  );
  return formatUsd(price, {
    ...opts,
    displayDecimals: decimals
  });
}
function formatPercentageDisplay(percentage, hideThreshold) {
  if (hideThreshold && percentage < hideThreshold) {
    return "";
  }
  return `${percentage}%`;
}
function formatAmountHuman(amount, tokenDecimals, showDollar = false, displayDecimals = 1) {
  if (amount === void 0) {
    return "...";
  }
  let n = Number(formatAmount(amount, tokenDecimals));
  if (n >= 1e6) {
    n = Math.round(n);
  }
  const isNegative = n < 0;
  const absN = Math.abs(n);
  const sign = showDollar ? "$\u200A" : "";
  if (absN >= 1e9) {
    return `${isNegative ? "-" : ""}${sign}${(absN / 1e9).toFixed(
      displayDecimals
    )}b`;
  }
  if (absN >= 1e6) {
    return `${isNegative ? "-" : ""}${sign}${(absN / 1e6).toFixed(
      displayDecimals
    )}m`;
  }
  if (absN >= 1e3) {
    return `${isNegative ? "-" : ""}${sign}${(absN / 1e3).toFixed(
      displayDecimals
    )}k`;
  }
  return `${isNegative ? "-" : ""}${sign}${absN.toFixed(displayDecimals)}`;
}
function formatBalanceAmount(amount, tokenDecimals, tokenSymbol, {
  showZero = false,
  toExponential = true,
  isStable = false,
  signed = false
} = {}) {
  if (amount === void 0) return "-";
  if (amount === 0n) {
    if (showZero === true) {
      if (tokenSymbol) {
        if (isStable) {
          return `0.00\xA0${tokenSymbol}`;
        }
        return `0.0000\xA0${tokenSymbol}`;
      }
      if (isStable) {
        return "0.00";
      }
      return "0.0000";
    }
    return "-";
  }
  const sign = signed || amount < 0n ? getPlusOrMinusSymbol(amount) : "";
  const absAmount = bigMath.abs(amount);
  const absAmountFloat = bigintToNumber(absAmount, tokenDecimals);
  let value = "";
  const baseDecimals = isStable ? 2 : 4;
  if (absAmountFloat >= 1)
    value = formatAmount(absAmount, tokenDecimals, baseDecimals, true);
  else if (absAmountFloat >= 0.1)
    value = formatAmount(absAmount, tokenDecimals, baseDecimals + 1, true);
  else if (absAmountFloat >= 0.01)
    value = formatAmount(absAmount, tokenDecimals, baseDecimals + 2, true);
  else if (absAmountFloat >= 1e-3)
    value = formatAmount(absAmount, tokenDecimals, baseDecimals + 3, true);
  else if (absAmountFloat >= 1e-8)
    value = formatAmount(absAmount, tokenDecimals, 8, true);
  else {
    if (toExponential) {
      value = bigintToNumber(absAmount, tokenDecimals).toExponential(2);
    } else {
      value = bigintToNumber(absAmount, tokenDecimals).toFixed(8);
    }
  }
  if (tokenSymbol) {
    return `${sign}${value}\xA0${tokenSymbol}`;
  }
  return `${sign}${value}`;
}
function formatFactor(factor) {
  if (factor == 0n) {
    return "0";
  }
  if (bigMath.abs(factor) > PRECISION * 1000n) {
    return (factor / PRECISION).toString();
  }
  const trailingZeroes = bigMath.abs(factor).toString().match(/^(.+?)(?<zeroes>0*)$/)?.groups?.zeroes?.length || 0;
  const factorDecimals = 30 - trailingZeroes;
  return formatAmount(factor, 30, factorDecimals);
}
function numberWithCommas(x, { showDollar = false } = {}) {
  if (x === void 0 || x === null) {
    return "...";
  }
  const parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${showDollar ? "$\u200A" : ""}${parts.join(".")}`;
}
const formatAmount = (amount, tokenDecimals, displayDecimals, useCommas, defaultValue, visualMultiplier) => {
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
  if (useCommas) {
    return numberWithCommas(amountStr);
  }
  return amountStr;
};
const formatKeyAmount = (map, key, tokenDecimals, displayDecimals, useCommas) => {
  const value = map ? map[key] ?? void 0 : void 0;
  if (value === void 0 || value === null) {
    return "...";
  }
  return formatAmount(
    value,
    tokenDecimals,
    displayDecimals,
    useCommas
  );
};
const formatArrayAmount = (arr, index, tokenDecimals, displayDecimals, useCommas) => {
  if (!arr || arr[index] === void 0 || arr[index] === null) {
    return "...";
  }
  return formatAmount(arr[index], tokenDecimals, displayDecimals, useCommas);
};
const formatAmountFree = (amount, tokenDecimals, displayDecimals) => {
  if (amount === void 0 || amount === null) {
    return "...";
  }
  amount = BigInt(amount);
  let amountStr = formatUnits(amount, tokenDecimals);
  amountStr = limitDecimals(amountStr, displayDecimals);
  return trimZeroDecimals(amountStr);
};
function getLimitedDisplay(amount, tokenDecimals, opts = {}) {
  const {
    maxThreshold = MAX_EXCEEDING_THRESHOLD,
    minThreshold = MIN_EXCEEDING_THRESHOLD
  } = opts;
  const max = maxThreshold === null ? null : expandDecimals(BigInt(maxThreshold), tokenDecimals);
  const min = parseUnits(minThreshold.toString(), tokenDecimals);
  const absAmount = bigMath.abs(amount);
  if (absAmount == 0n) {
    return {
      symbol: "",
      value: absAmount
    };
  }
  const symbol = max !== null && absAmount > max ? TRIGGER_PREFIX_ABOVE : absAmount < min ? TRIGGER_PREFIX_BELOW : "";
  const value = max !== null && absAmount > max ? max : absAmount < min ? min : absAmount;
  return {
    symbol,
    value
  };
}
const limitDecimals = (amount, maxDecimals) => {
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
const padDecimals = (amount, minDecimals) => {
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
function getPlusOrMinusSymbol(value, opts = {}) {
  if (value === void 0) {
    return "";
  }
  const { showPlusForZero = false } = opts;
  return value === 0n ? showPlusForZero ? "+" : "" : value < 0n ? "-" : "+";
}
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
function toBigNumberWithDecimals(value, decimals) {
  if (!value) return BN_ZERO;
  const parts = value.split(".");
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : "";
  const paddingZeros = decimals - decimalPart.length;
  if (paddingZeros >= 0) {
    const result = integerPart + decimalPart + "0".repeat(paddingZeros);
    return BigInt(result);
  } else {
    const result = integerPart + decimalPart.substring(0, decimals);
    return BigInt(result);
  }
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
const parseValue = (value, tokenDecimals) => {
  const pValue = parseFloat(value);
  if (isNaN(pValue)) {
    return void 0;
  }
  value = limitDecimals(value, tokenDecimals);
  const amount = parseUnits(value, tokenDecimals);
  return bigNumberify(amount);
};
function roundUpDivision(a, b) {
  return (a + b - 1n) / b;
}
function roundToTwoDecimals(n) {
  return Math.round(n * 100) / 100;
}
function roundToOrder(n, significantDigits = 1) {
  const decimals = Math.max(n.toString().length - significantDigits, 0);
  return n / expandDecimals(1, decimals) * expandDecimals(1, decimals);
}
function roundBigIntToDecimals(value, tokenDecimals, roundToDecimals) {
  const excessDecimals = tokenDecimals - roundToDecimals;
  const divisor = BigInt(10 ** excessDecimals);
  const scaledValue = value / divisor;
  const remainder = scaledValue % 10n;
  const roundedValue = remainder >= 5n ? scaledValue + 10n - remainder : scaledValue - remainder;
  return roundedValue * divisor;
}
function minBigNumber(...args) {
  if (!args.length) return void 0;
  return args.reduce((acc, num) => num < acc ? num : acc, args[0]);
}
function maxbigint(...args) {
  if (!args.length) return void 0;
  return args.reduce((acc, num) => num > acc ? num : acc, args[0]);
}
function removeTrailingZeros(amount) {
  const amountWithoutZeros = Number(amount);
  if (!amountWithoutZeros) return amount;
  return amountWithoutZeros;
}
function serializeBigIntsInObject(obj) {
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "bigint") {
      result[key] = { type: "bigint", value: String(value) };
    } else if (value && typeof value === "object") {
      result[key] = serializeBigIntsInObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
function deserializeBigIntsInObject(obj) {
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "object" && value !== null && ("type" in value && value.type === "bigint" || "_type" in value && value._type === "BigNumber")) {
      if ("value" in value && typeof value.value === "string") {
        result[key] = BigInt(value.value);
      } else if ("hex" in value && typeof value.hex === "string") {
        if (value.hex.startsWith("-")) {
          result[key] = BigInt(value.hex.slice(1)) * -1n;
        } else {
          result[key] = BigInt(value.hex);
        }
      }
    } else if (value && typeof value === "object") {
      result[key] = deserializeBigIntsInObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
function calculateDisplayDecimals(price, decimals = USD_DECIMALS, visualMultiplier = 1, isStable = false) {
  if (price === void 0 || price === 0n) return 2;
  const priceNumber = bigintToNumber(
    bigMath.abs(price) * BigInt(visualMultiplier),
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
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}
function absDiffBps(value, base) {
  if (value === 0n && base !== 0n || value !== 0n && base === 0n) {
    return BASIS_POINTS_DIVISOR_BIGINT;
  }
  if (value === 0n && base === 0n) {
    return 0n;
  }
  return bigMath.mulDiv(
    bigMath.abs(value - base),
    BASIS_POINTS_DIVISOR_BIGINT,
    base
  );
}

export { BASIS_POINTS_DECIMALS, BASIS_POINTS_DIVISOR, BASIS_POINTS_DIVISOR_BIGINT, BN_NEGATIVE_ONE, BN_ONE, BN_ZERO, MaxUint256, PERCENT_PRECISION_DECIMALS, PRECISION, PRECISION_DECIMALS, TRIGGER_PREFIX_ABOVE, TRIGGER_PREFIX_BELOW, USD_DECIMALS, absDiffBps, adjustForDecimals, applyFactor, basisPointsToFloat, bigNumberify, bigintToNumber, calculateDisplayDecimals, clamp, deserializeBigIntsInObject, expandDecimals, formatAmount, formatAmountFree, formatAmountHuman, formatArrayAmount, formatBalanceAmount, formatBigUsd, formatDeltaUsd, formatFactor, formatKeyAmount, formatPercentage, formatPercentageDisplay, formatRatePercentage, formatTokenAmount, formatTokenAmountWithUsd, formatUsd, formatUsdPrice, getBasisPoints, getLimitedDisplay, getPlusOrMinusSymbol, isNonZero, limitDecimals, maxbigint, minBigNumber, numberToBigint, numberWithCommas, padDecimals, parseValue, removeTrailingZeros, roundBigIntToDecimals, roundToOrder, roundToTwoDecimals, roundUpDivision, roundUpMagnitudeDivision, roundWithDecimals, safeDivide, serializeBigIntsInObject, toBigNumberWithDecimals, trimZeroDecimals };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map