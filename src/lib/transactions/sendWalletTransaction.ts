import { TransactionRequest, TransactionResponse } from "ethers";

import { extendError } from "lib/errors";
import { estimateGasLimit } from "lib/gas/estimateGasLimit";
import { GasPriceData, getGasPrice } from "lib/gas/gasPrice";
import { iRpc } from "lib/rpc/types";
import { ISigner } from "lib/signing/signing";

import { TransactionWaiterResult, TxnCallback, TxnEventBuilder } from "./types";

export type WalletTxnCtx = {};

export type WalletTxnResult = {
  transactionHash: string;
  wait: () => Promise<TransactionWaiterResult>;
};

export async function sendWalletTransaction({
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
  callback,
}: {
  chainId: number;
  signer: ISigner;
  rpc: iRpc;
  to: string;
  callData: string;
  value?: bigint;
  gasLimit?: bigint | number;
  gasPriceData?: GasPriceData;
  nonce?: number | bigint;
  msg?: string;
  runSimulation?: () => Promise<void>;
  callback?: TxnCallback<WalletTxnCtx>;
}) {
  const from = signer.address;
  const eventBuilder = new TxnEventBuilder<WalletTxnCtx>({});

  try {
    // TODO: move outside somehow
    const gasLimitPromise = gasLimit
      ? Promise.resolve(gasLimit)
      : estimateGasLimit(rpc, {
          to,
          from,
          data: callData,
          value,
        }).catch(() => undefined);

    const gasPriceDataPromise = gasPriceData
      ? Promise.resolve(gasPriceData)
      : getGasPrice(chainId, rpc!).catch(() => undefined);

    const [gasLimitResult, gasPriceDataResult] = await Promise.all([
      gasLimitPromise,
      gasPriceDataPromise,
      runSimulation?.().then(() => callback?.(eventBuilder.Simulated())),
    ]);

    callback?.(eventBuilder.Sending());

    const txnData: TransactionRequest = {
      to,
      data: callData,
      value,
      from,
      nonce: nonce !== undefined ? Number(nonce) : undefined,
      gasLimit: gasLimitResult,
      ...(gasPriceDataResult ?? {}),
    };

    const res = await signer.sendTransaction(txnData).catch((error) => {
      throw extendError(error, {
        errorContext: "sending",
      });
    });

    callback?.(
      eventBuilder.Sent({
        type: "wallet",
        transactionHash: res.hash,
      })
    );

    return {
      transactionHash: res.hash,
      wait: makeWalletTxnResultWaiter(res.hash, res),
    };
  } catch (error: any) {
    callback?.(eventBuilder.Error(error));

    throw error;
  }
}

function makeWalletTxnResultWaiter(hash: string, txn: TransactionResponse) {
  return async () => {
    const receipt = await txn.wait();
    return {
      transactionHash: hash,
      blockNumber: receipt?.blockNumber,
      status: receipt?.status === 1 ? "success" : "failed",
    };
  };
}
