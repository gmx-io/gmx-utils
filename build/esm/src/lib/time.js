// src/lib/time.ts
var SECONDS_IN_PERIOD = {
  "1m": 60,
  "5m": 60 * 5,
  "15m": 60 * 15,
  "1h": 60 * 60,
  "4h": 60 * 60 * 4,
  "1d": 60 * 60 * 24,
  "1y": 60 * 60 * 24 * 365
};
function secondsFrom(period) {
  return SECONDS_IN_PERIOD[period];
}
function secondsToPeriod(seconds, period, roundUp = false) {
  const secondsInPeriod = secondsFrom(period);
  const roundedSeconds = roundUp ? Math.ceil(seconds / secondsInPeriod) : Math.floor(seconds / secondsInPeriod);
  return roundedSeconds;
}
function periodToSeconds(periodsCount, period) {
  return periodsCount * secondsFrom(period);
}
function nowInSeconds() {
  return Math.floor(Date.now() / 1e3);
}
var TIMEZONE_OFFSET_SEC = -(/* @__PURE__ */ new Date()).getTimezoneOffset() * 60;

export { TIMEZONE_OFFSET_SEC, nowInSeconds, periodToSeconds, secondsFrom, secondsToPeriod };
//# sourceMappingURL=time.js.map
//# sourceMappingURL=time.js.map