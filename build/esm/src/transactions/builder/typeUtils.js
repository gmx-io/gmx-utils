function withBaseState(state, updates) {
  return {
    ...state,
    ...updates
  };
}
function withBaseCapabilities(state, capabilityUpdates) {
  const newCapabilities = {
    ...state.capabilities,
    ...capabilityUpdates
  };
  return {
    ...state,
    capabilities: newCapabilities
  };
}

export { withBaseCapabilities, withBaseState };
//# sourceMappingURL=typeUtils.js.map
//# sourceMappingURL=typeUtils.js.map