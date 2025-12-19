import { encodePacked } from 'viem';
import { GELATO_API_KEYS } from '../../configs/express.js';
import { gelatoRelay } from '../gelatoRelay/gelatoRelay.js';
import { emitMetricTiming } from '../metrics/index.js';
import { sleep } from '../sleep/sleep.js';
import { TaskState } from './types.js';

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
const GELATO_API = "https://api.gelato.digital";
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
const finalStatuses = [
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
        emitMetricTiming({
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