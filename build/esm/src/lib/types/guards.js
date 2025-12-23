function definedOrThrow(value) {
  if (value === void 0 || value === null) {
    throw new Error("Item is null or undefined");
  }
}
function defined(value) {
  return value !== void 0 && value !== null;
}

export { defined, definedOrThrow };
//# sourceMappingURL=guards.js.map
//# sourceMappingURL=guards.js.map