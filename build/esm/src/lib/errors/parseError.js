import cryptoJs from 'crypto-js';
import { decodeErrorResult } from 'viem';
import { CustomErrors } from '../../abis/index.js';
import { extractTxnError, getIsUserError, getIsUserRejectedError, extractDataFromError } from './transactionsErrors.js';

const URL_REGEXP = /((?:http[s]?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@%._\\+~#=]{2,256}\.[a-z]{2,6}\b(?::\d+)?)(?:[-a-zA-Z0-9@:%_\\+.~#?&\\/\\/=]*)/gi;
const MAX_ERRORS_DEPTH = 1;
function extendError(error, params) {
  let errorLike;
  if (typeof error === "object" && error !== null) {
    errorLike = error;
  } else if (typeof error === "string") {
    errorLike = {
      message: error
    };
  } else {
    errorLike = {};
  }
  errorLike.errorContext = params.errorContext;
  errorLike.errorSource = params.errorSource;
  errorLike.isAdditionalValidationPassed = params.isAdditionalValidationPassed;
  errorLike.additionalValidationType = params.additionalValidationType;
  errorLike.data = params.data;
  return errorLike;
}
function parseError(error, errorDepth = 0) {
  if (errorDepth > MAX_ERRORS_DEPTH) {
    return void 0;
  }
  const errorInfo = typeof error === "string" ? void 0 : error?.info?.error;
  const errorSource = typeof error === "string" ? void 0 : error?.errorSource;
  const errorContext = typeof error === "string" ? void 0 : error?.errorContext;
  const isAdditionalValidationPassed = typeof error === "string" ? void 0 : error?.isAdditionalValidationPassed;
  const additionalValidationType = typeof error === "string" ? void 0 : error?.additionalValidationType;
  const data = typeof error === "string" ? void 0 : error?.data;
  let errorMessage = "Unknown error";
  let errorStack = void 0;
  let errorStackHash = void 0;
  let errorName = void 0;
  let contractError = void 0;
  let contractErrorArgs = void 0;
  let txErrorType = void 0;
  let errorGroup = "Unknown group";
  let errorStackGroup = "Unknown stack group";
  let txErrorData = void 0;
  let isUserError = void 0;
  let isUserRejectedError = void 0;
  let parentError = void 0;
  try {
    errorMessage = hasMessage(errorInfo) ? errorInfo.message ?? (hasMessage(error) ? error.message : String(error)) : String(error);
    errorStack = hasStack(error) ? error.stack : void 0;
    if (hasName(errorInfo)) {
      errorName = errorInfo.name;
    } else if (hasName(error)) {
      errorName = error.name;
    }
    try {
      let txError;
      if (errorInfo) {
        txError = extractTxnError(errorInfo);
      } else if (error && typeof error === "object") {
        txError = extractTxnError(error);
      }
      if (txError && txError.length) {
        const [message, type, errorData] = txError;
        errorMessage = message;
        txErrorType = type || void 0;
        txErrorData = errorData;
        isUserError = type ? getIsUserError(type) : false;
        isUserRejectedError = type ? getIsUserRejectedError(type) : false;
      }
    } catch (e) {
    }
    if (errorMessage) {
      const errorData = extractDataFromError(errorMessage) ?? extractDataFromError(error?.message);
      if (errorData) {
        const parsedError = decodeErrorResult({
          abi: CustomErrors,
          data: errorData
        });
        if (parsedError) {
          contractError = parsedError.errorName;
          contractErrorArgs = parsedError.args;
        }
      }
    }
    if (typeof error !== "string" && error?.parentError) {
      parentError = parseError(error.parentError, errorDepth + 1);
    }
  } catch (e) {
  }
  if (errorStack) {
    errorStackHash = cryptoJs.SHA256(errorStack).toString(cryptoJs.enc.Hex);
    errorStackGroup = errorStack.slice(0, 300);
    errorStackGroup = errorStackGroup.replace(URL_REGEXP, "$1");
    errorStackGroup = errorStackGroup.replace(/\d+/g, "XXX");
  }
  if (txErrorType) {
    errorGroup = `Txn Error: ${txErrorType}`;
  } else if (errorMessage) {
    errorGroup = errorMessage.slice(0, 300);
    errorGroup = errorGroup.replace(URL_REGEXP, "$1");
    errorGroup = errorGroup.replace(/\d+/g, "XXX");
    errorGroup = errorGroup.slice(0, 50);
  } else if (errorName) {
    errorGroup = errorName;
  }
  return {
    errorMessage,
    errorGroup,
    errorStackGroup,
    errorStack,
    errorStackHash,
    errorName,
    contractError,
    contractErrorArgs,
    errorContext,
    isUserError,
    data,
    isUserRejectedError,
    txErrorType,
    txErrorData,
    errorSource,
    parentError,
    isAdditionalValidationPassed,
    additionalValidationType,
    errorDepth
  };
}
function isContractError(error, errorType) {
  return error.contractError === errorType;
}
function hasMessage(error) {
  return !!error && typeof error === "object" && typeof error.message === "string";
}
function hasStack(error) {
  return !!error && typeof error === "object" && typeof error.stack === "string";
}
function hasName(error) {
  return !!error && typeof error === "object" && typeof error.name === "string";
}
class CustomError extends Error {
  constructor({
    name,
    message,
    args
  }) {
    super(message);
    this.isGmxCustomError = true;
    this.name = name;
    this.args = args;
  }
}
function isCustomError(error) {
  return error?.isGmxCustomError === true;
}
function getCustomError(error) {
  const data = error?.info?.error?.data ?? error?.data;
  let prettyErrorName = error.name;
  let prettyErrorMessage = error.message;
  let prettyErrorArgs = void 0;
  try {
    const parsedError = decodeErrorResult({
      abi: CustomErrors,
      data
    });
    prettyErrorArgs = parsedError.args;
    prettyErrorName = parsedError.errorName;
    prettyErrorMessage = JSON.stringify(parsedError, null, 2);
  } catch (decodeError) {
    return error;
  }
  const prettyError = new CustomError({
    name: prettyErrorName,
    message: prettyErrorMessage,
    args: prettyErrorArgs
  });
  return prettyError;
}

export { CustomError, extendError, getCustomError, isContractError, isCustomError, parseError };
//# sourceMappingURL=parseError.js.map
//# sourceMappingURL=parseError.js.map