import { extendError } from '../errors/index.js';
import { estimateGasLimit } from '../gas/estimateGasLimit.js';
import { getGasPrice } from '../gas/gasPrice.js';
import { TxnEventBuilder } from './types.js';

async function sendWalletTransaction({
  chainId,
  signer,
  rpc,
  to,
  callData,
  value,
  gasLimit,
  gasPriceData,
  runSimulation,
  nonce,
  callback
}) {
  const from = signer.address;
  const eventBuilder = new TxnEventBuilder({});
  try {
    const gasLimitPromise = gasLimit ? Promise.resolve(gasLimit) : estimateGasLimit(rpc, {
      to,
      from,
      data: callData,
      value
    }).catch(() => void 0);
    const gasPriceDataPromise = gasPriceData ? Promise.resolve(gasPriceData) : getGasPrice(chainId, rpc).catch(() => void 0);
    const [gasLimitResult, gasPriceDataResult] = await Promise.all([
      gasLimitPromise,
      gasPriceDataPromise,
      runSimulation?.().then(() => callback?.(eventBuilder.Simulated()))
    ]);
    callback?.(eventBuilder.Sending());
    const txnData = {
      to,
      data: callData,
      value,
      from,
      nonce: nonce !== void 0 ? Number(nonce) : void 0,
      gasLimit: gasLimitResult,
      ...gasPriceDataResult ?? {}
    };
    const res = await signer.sendTransaction(txnData).catch((error) => {
      throw extendError(error, {
        errorContext: "sending"
      });
    });
    callback?.(
      eventBuilder.Sent({
        type: "wallet",
        transactionHash: res.hash
      })
    );
    return {
      transactionHash: res.hash,
      wait: makeWalletTxnResultWaiter(res.hash, res)
    };
  } catch (error) {
    callback?.(eventBuilder.Error(error));
    throw error;
  }
}
function makeWalletTxnResultWaiter(hash, txn) {
  return async () => {
    const receipt = await txn.wait();
    return {
      transactionHash: hash,
      blockNumber: receipt?.blockNumber,
      status: receipt?.status === 1 ? "success" : "failed"
    };
  };
}

export { sendWalletTransaction };
//# sourceMappingURL=sendWalletTransaction.js.map
//# sourceMappingURL=sendWalletTransaction.js.map