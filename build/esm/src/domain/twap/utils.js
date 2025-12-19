import { MIN_TWAP_NUMBER_OF_PARTS, MAX_TWAP_NUMBER_OF_PARTS, DEFAULT_TWAP_NUMBER_OF_PARTS } from '../../configs/twap.js';
import { isSwapOrderType } from '../orders/utils.js';

function getIsValidTwapParams(duration, numberOfParts) {
  return duration.hours >= 0 && duration.minutes >= 0 && numberOfParts >= MIN_TWAP_NUMBER_OF_PARTS && numberOfParts <= MAX_TWAP_NUMBER_OF_PARTS;
}
function getTwapDurationInSeconds(duration) {
  return duration.hours * 60 * 60 + duration.minutes * 60;
}
function getTwapValidFromTime(duration, numberOfParts, partIndex) {
  const durationMinutes = duration.hours * 60 + duration.minutes;
  const durationMs = durationMinutes * 60;
  const startTime = Math.ceil(Date.now() / 1e3);
  return BigInt(
    Math.floor(startTime + durationMs / (numberOfParts - 1) * partIndex)
  );
}
function changeTwapNumberOfPartsValue(value) {
  if (value < MIN_TWAP_NUMBER_OF_PARTS) {
    return MIN_TWAP_NUMBER_OF_PARTS;
  }
  if (value > MAX_TWAP_NUMBER_OF_PARTS) {
    return MAX_TWAP_NUMBER_OF_PARTS;
  }
  if (isNaN(value)) {
    return DEFAULT_TWAP_NUMBER_OF_PARTS;
  }
  return value;
}
function getTwapOrderKey({
  twapId,
  orderType,
  pool,
  isLong,
  collateralTokenSymbol,
  swapPath,
  account,
  initialCollateralToken
}) {
  if (isSwapOrderType(orderType)) {
    return `${twapId}-${swapPath.join(
      "-"
    )}-${account}-${initialCollateralToken}`;
  }
  const type = isLong ? "long" : "short";
  return `${twapId}-${type}-${pool}-${collateralTokenSymbol}`;
}
function makeTwapValidFromTimeGetter(duration, numberOfParts) {
  const durationMinutes = duration.hours * 60 + duration.minutes;
  const durationMs = durationMinutes * 60;
  const startTime = Math.ceil(Date.now() / 1e3);
  return (part) => {
    return BigInt(
      Math.floor(startTime + durationMs / (numberOfParts - 1) * part)
    );
  };
}

export { changeTwapNumberOfPartsValue, getIsValidTwapParams, getTwapDurationInSeconds, getTwapOrderKey, getTwapValidFromTime, makeTwapValidFromTimeGetter };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map