function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
function sleepWithSignal(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(createAbortError());
      return;
    }
    const abortHandler = () => {
      clearTimeout(timeout);
      signal.removeEventListener("abort", abortHandler);
      reject(createAbortError());
    };
    const timeout = setTimeout(() => {
      signal.removeEventListener("abort", abortHandler);
      resolve();
    }, ms);
    signal.addEventListener("abort", abortHandler);
  });
}
function createAbortError() {
  if (typeof DOMException !== "undefined") {
    return new DOMException("Sleep aborted", "AbortError");
  }
  const error = new Error("Sleep aborted");
  error.name = "AbortError";
  return error;
}

export { sleep, sleepWithSignal };
//# sourceMappingURL=sleep.js.map
//# sourceMappingURL=sleep.js.map