import { encodePacked } from 'viem';
import '../bigmath/index.js';
import { BOTANIX, ARBITRUM_SEPOLIA, AVALANCHE_FUJI, AVALANCHE, ARBITRUM } from './chains.js';
import { getTokenBySymbol } from './tokens.js';
import { GelatoRelay } from '@gelatonetwork/relay-sdk';
import noop from 'lodash/noop';
import * as emitMetricEvent_star from './emitMetricEvent.js';
import * as Metrics_star from './Metrics.js';
import * as types_star from './types.js';
import { TaskState } from './types.js';
import * as utils_star from './utils.js';

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget);
var USD_DECIMALS = 30;
var PRECISION_DECIMALS = 30;
expandDecimals(1, PRECISION_DECIMALS);
BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
function expandDecimals(n, decimals) {
  return BigInt(n) * 10n ** BigInt(decimals);
}

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
function periodToSeconds(periodsCount, period) {
  return periodsCount * secondsFrom(period);
}
-(/* @__PURE__ */ new Date()).getTimezoneOffset() * 60;
periodToSeconds(7, "1d");
periodToSeconds(1, "1h");
periodToSeconds(1, "1h");
var GELATO_API_KEYS = {
  [ARBITRUM]: "6dE6kOa9pc1ap4dQQC2iaK9i6nBFp8eYxQlm00VreWc_",
  [AVALANCHE]: "FalsQh9loL6V0rwPy4gWgnQPR6uTHfWjSVT2qlTzUq4_",
  [BOTANIX]: "s5GgkfX7dvd_2uYqsRSCjzMekUrXh0dibUvfLab1Anc_",
  [ARBITRUM_SEPOLIA]: "nx5nyAg4h2kI_64YtOuPt7LSPDEXo4u8eJY_idF9xDw_"
};
expandDecimals(
  100,
  USD_DECIMALS
);
5n ** BigInt(USD_DECIMALS - 1);
var EXPRESS_DEFAULT_MIN_RESIDUAL_USD_NUMBER = 20;
expandDecimals(
  EXPRESS_DEFAULT_MIN_RESIDUAL_USD_NUMBER,
  USD_DECIMALS
);
var EXPRESS_DEFAULT_MAX_RESIDUAL_USD_NUMBER = 40;
expandDecimals(
  EXPRESS_DEFAULT_MAX_RESIDUAL_USD_NUMBER,
  USD_DECIMALS
);
({
  [ARBITRUM]: [
    getTokenBySymbol(ARBITRUM, "USDC").address,
    getTokenBySymbol(ARBITRUM, "WETH").address,
    getTokenBySymbol(ARBITRUM, "USDT").address
  ],
  [AVALANCHE]: [
    getTokenBySymbol(AVALANCHE, "USDC").address,
    getTokenBySymbol(AVALANCHE, "WAVAX").address,
    getTokenBySymbol(AVALANCHE, "USDT").address
  ],
  [AVALANCHE_FUJI]: [
    getTokenBySymbol(AVALANCHE_FUJI, "USDC").address,
    getTokenBySymbol(AVALANCHE_FUJI, "WAVAX").address
  ],
  [ARBITRUM_SEPOLIA]: [
    getTokenBySymbol(ARBITRUM_SEPOLIA, "USDC.SG").address,
    getTokenBySymbol(ARBITRUM_SEPOLIA, "WETH").address
  ],
  [BOTANIX]: [getTokenBySymbol(BOTANIX, "pBTC").address]
});
var gelatoRelay = new GelatoRelay();
gelatoRelay.onError(noop);

// src/lib/metrics/index.ts
var metrics_exports = {};
__reExport(metrics_exports, emitMetricEvent_star);
__reExport(metrics_exports, Metrics_star);
__reExport(metrics_exports, types_star);
__reExport(metrics_exports, utils_star);

// src/lib/sleep/sleep.ts
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
async function sendExpressTransaction(p) {
  const data = encodePacked(
    ["bytes", "address", "address", "uint256"],
    [
      p.txnData.callData,
      p.txnData.to,
      p.txnData.feeToken,
      p.txnData.feeAmount
    ]
  );
  let gelatoPromise;
  const apiKey = GELATO_API_KEYS[p.chainId];
  gelatoPromise = sendTxnToGelato({
    chainId: p.chainId,
    target: p.txnData.to,
    data,
    feeToken: p.txnData.feeToken,
    sponsorApiKey: apiKey,
    retries: 0,
    isSponsoredCall: apiKey ? p.isSponsoredCall : false
  });
  return gelatoPromise?.then((res) => {
    return {
      taskId: res.taskId,
      wait: makeExpressTxnResultWaiter(res)
    };
  });
}
function makeExpressTxnResultWaiter(res) {
  return async () => {
    return new Promise((resolve, reject) => {
      pollGelatoTask(res.taskId, async (status, error) => {
        if (error) {
          reject(error);
          return;
        }
        switch (status?.taskState) {
          case "ExecSuccess":
          case "ExecReverted":
          case "Cancelled": {
            const result = {
              transactionHash: status.transactionHash,
              blockNumber: status?.blockNumber,
              status: status.taskState === "ExecSuccess" ? "success" : "failed",
              relayStatus: {
                taskId: res.taskId,
                taskState: status.taskState
              }
            };
            resolve(result);
            break;
          }
          case "CheckPending":
          case "ExecPending":
          case "WaitingForConfirmation":
          default:
            break;
        }
      });
    });
  };
}
var GELATO_API = "https://api.gelato.digital";
async function sendTxnToGelato({
  chainId,
  target,
  data,
  feeToken,
  sponsorApiKey,
  retries,
  isSponsoredCall
}) {
  if (isSponsoredCall && !sponsorApiKey) {
    throw new Error("Sponsor API key is required for sponsored call");
  }
  const url = isSponsoredCall ? `${GELATO_API}/relays/v2/sponsored-call` : `${GELATO_API}/relays/v2/call-with-sync-fee`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chainId,
      target,
      data,
      feeToken,
      sponsorApiKey,
      retries
    })
  });
  if (!res.ok) {
    throw new Error(`Failed to call with sync fee: ${res.statusText}`);
  }
  const result = await res.json();
  gelatoRelay.subscribeTaskStatusUpdate(result.taskId);
  return result;
}
var finalStatuses = [
  TaskState.ExecSuccess,
  TaskState.ExecReverted,
  TaskState.Cancelled
];
async function pollGelatoTask(taskId, cb) {
  const pollInterval = 500;
  const maxAttempts = 60;
  let attempts = 0;
  let lastStatus;
  const startTime = Date.now();
  while (attempts < maxAttempts) {
    try {
      const res = await fetch(`${GELATO_API}/tasks/status/${taskId}`);
      const { task: status } = await res.json();
      lastStatus = status;
      cb(status);
      if (finalStatuses.includes(status.taskState)) {
        const elapsedTime = Date.now() - startTime;
        (0, metrics_exports.emitMetricTiming)({
          event: "express.pollGelatoTask.finalStatus",
          time: elapsedTime,
          data: {
            status: status.taskState
          }
        });
        return;
      }
    } catch (e) {
      console.error(e);
    } finally {
      await sleep(pollInterval);
      attempts++;
    }
  }
  cb(lastStatus, new Error("Gelato Task timeout"));
}
async function getGelatoTaskDebugInfo(taskId, accountSlug, projectSlug) {
  const accountParams = accountSlug && projectSlug ? `?tenderlyUsername=${accountSlug}&tenderlyProjectName=${projectSlug}` : "";
  try {
    const res = await fetch(
      `${GELATO_API}/tasks/status/${taskId}/debug${accountParams}`
    );
    const debugData = await res.json();
    return debugData;
  } catch (error) {
    return void 0;
  }
}

export { getGelatoTaskDebugInfo, pollGelatoTask, sendExpressTransaction, sendTxnToGelato };
//# sourceMappingURL=sendExpressTransaction.js.map
//# sourceMappingURL=sendExpressTransaction.js.map