var TxErrorType = /* @__PURE__ */ ((TxErrorType2) => {
  TxErrorType2["NotEnoughFunds"] = "NOT_ENOUGH_FUNDS";
  TxErrorType2["UserDenied"] = "USER_DENIED";
  TxErrorType2["Slippage"] = "SLIPPAGE";
  TxErrorType2["RpcError"] = "RPC_ERROR";
  TxErrorType2["NetworkChanged"] = "NETWORK_CHANGED";
  TxErrorType2["Expired"] = "EXPIRED";
  return TxErrorType2;
})(TxErrorType || {});
const TX_ERROR_PATTERNS = {
  ["NOT_ENOUGH_FUNDS" /* NotEnoughFunds */]: [
    { msg: "insufficient funds for gas" },
    { msg: "not enough funds for gas" },
    { msg: "failed to execute call with revert code InsufficientGasFunds" },
    { msg: "insufficient funds for transfer" }
  ],
  ["USER_DENIED" /* UserDenied */]: [
    { msg: "User denied transaction signature" },
    { msg: "User rejected" },
    { msg: "User cancelled" },
    { msg: "Cancelled" },
    { msg: "Cancelled by user" },
    { msg: "user rejected action" },
    { msg: "ethers-user-denied" },
    { msg: "Action cancelled by user" },
    { msg: "Signing aborted by user" }
  ],
  ["SLIPPAGE" /* Slippage */]: [
    { msg: "Router: mark price lower than limit" },
    { msg: "Router: mark price higher than limit" }
  ],
  ["NETWORK_CHANGED" /* NetworkChanged */]: [
    { msg: "network changed" },
    { msg: "Invalid network" },
    { msg: "chainId should be same" }
  ],
  ["EXPIRED" /* Expired */]: [{ msg: "Request expired" }],
  ["RPC_ERROR" /* RpcError */]: [
    // @see https://eips.ethereum.org/EIPS/eip-1474#error-codes
    { code: -32700 },
    // Parse error: Invalid JSON
    { code: -32600 },
    // Invalid request: JSON is not a valid request object
    { code: -32601 },
    // Method not found: Method does not exist
    { code: -32602 },
    // Invalid params: Invalid method parameters
    { code: -32603 },
    // Internal error: Internal JSON-RPC error
    { code: -32e3 },
    // Invalid input: Missing or invalid parameters	non-standard
    { code: -32001 },
    // Resource not found: Requested resource not found
    { code: -32002 },
    // Resource unavailable: Requested resource not available
    { code: -32003 },
    // Transaction rejected: Transaction creation failed
    { code: -32004 },
    // Method not supported: Method is not implemented
    { code: -32005 },
    // Limit exceeded: Request exceeds defined limit
    { code: -32006 },
    // JSON-RPC version not supported: Version of JSON-RPC protocol is not supported
    { msg: "Non-200 status code" },
    { msg: "Request limit exceeded" },
    { msg: "Internal JSON-RPC error" },
    { msg: "Response has no error or result" },
    { msg: "we can't execute this request" },
    { msg: "couldn't connect to the network" }
  ]
};
var CustomErrorName = /* @__PURE__ */ ((CustomErrorName2) => {
  CustomErrorName2["EndOfOracleSimulation"] = "EndOfOracleSimulation";
  CustomErrorName2["InsufficientExecutionFee"] = "InsufficientExecutionFee";
  CustomErrorName2["OrderNotFulfillableAtAcceptablePrice"] = "OrderNotFulfillableAtAcceptablePrice";
  CustomErrorName2["InsufficientSwapOutputAmount"] = "InsufficientSwapOutputAmount";
  return CustomErrorName2;
})(CustomErrorName || {});
function getIsUserRejectedError(errorType) {
  return errorType === "USER_DENIED" /* UserDenied */;
}
function getIsUserError(errorType) {
  return ["USER_DENIED" /* UserDenied */, "NETWORK_CHANGED" /* NetworkChanged */, "EXPIRED" /* Expired */, "NOT_ENOUGH_FUNDS" /* NotEnoughFunds */].includes(
    errorType
  );
}
function extractTxnError(ex) {
  if (!ex) {
    return [];
  }
  ex = ex?.info ?? ex;
  let message = ex.error?.message || ex.data?.message || ex.message;
  let code = ex.error?.code || ex.code;
  if (ex.error?.body) {
    try {
      const parsed = JSON.parse(ex.error?.body);
      if (parsed?.error?.message) {
        message = parsed.error.message;
      }
      if (parsed?.error?.code) {
        code = parsed.error.code;
      }
    } catch (e) {
    }
  }
  if (!message && !code) {
    return [];
  }
  for (const [type, patterns] of Object.entries(TX_ERROR_PATTERNS)) {
    for (const pattern of patterns) {
      const matchCode = pattern.code && code === pattern.code;
      const matchMessage = pattern.msg && message && message.includes(pattern.msg);
      if (matchCode || matchMessage) {
        return [message, type, ex.data];
      }
    }
  }
  return [message, null, ex.data];
}
function extractDataFromError(errorMessage) {
  if (typeof errorMessage !== "string") return null;
  const pattern = /data="([^"]+)"/;
  const match = errorMessage.match(pattern);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

export { CustomErrorName, TxErrorType, extractDataFromError, extractTxnError, getIsUserError, getIsUserRejectedError };
//# sourceMappingURL=transactionsErrors.js.map
//# sourceMappingURL=transactionsErrors.js.map