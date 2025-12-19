// src/lib/metrics/Metrics.ts
var Metrics = class {
  constructor() {
    this.timers = {};
    this.startTimer = (label) => {
      this.timers[label] = Date.now();
    };
    this.getTime = (label, clear) => {
      const startTime = this.timers[label];
      if (startTime === void 0) {
        return void 0;
      }
      const elapsed = Date.now() - startTime;
      if (clear) {
        delete this.timers[label];
      }
      return elapsed;
    };
    this.pushError = (error, errorSource) => {
    };
    this.pushEvent = (params) => {
    };
    this.pushCounter = (event, data) => {
    };
  }
  pushTiming(event, time, data) {
  }
};
var metrics = new Metrics();

export { Metrics, metrics };
//# sourceMappingURL=Metrics.js.map
//# sourceMappingURL=Metrics.js.map