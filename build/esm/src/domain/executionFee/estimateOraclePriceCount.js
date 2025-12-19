function estimateDepositOraclePriceCount(swapsCount) {
  return 3n + BigInt(swapsCount);
}
function estimateWithdrawalOraclePriceCount(swapsCount) {
  return 3n + BigInt(swapsCount);
}
function estimateOrderOraclePriceCount(swapsCount) {
  return 3n + BigInt(swapsCount);
}
function estimateShiftOraclePriceCount() {
  return 4n;
}
function estimateGlvDepositOraclePriceCount(marketCount, swapsCount = 0n) {
  return 2n + marketCount + swapsCount;
}
function estimateGlvWithdrawalOraclePriceCount(marketCount, swapsCount = 0n) {
  return 2n + marketCount + swapsCount;
}

export { estimateDepositOraclePriceCount, estimateGlvDepositOraclePriceCount, estimateGlvWithdrawalOraclePriceCount, estimateOrderOraclePriceCount, estimateShiftOraclePriceCount, estimateWithdrawalOraclePriceCount };
//# sourceMappingURL=estimateOraclePriceCount.js.map
//# sourceMappingURL=estimateOraclePriceCount.js.map