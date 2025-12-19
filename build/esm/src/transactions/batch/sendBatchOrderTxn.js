import { withRetry } from 'viem';
import { getContract } from '../../configs/contracts.js';
import { OrderType } from '../../domain/orders/types.js';
import { isLimitOrderType } from '../../domain/orders/utils.js';
import { extendError } from '../../lib/errors/index.js';
import { callRelayTransaction } from '../../lib/transactions/callRelayTransaction.js';
import { sendExpressTransaction } from '../../lib/transactions/sendExpressTransaction.js';
import { sendWalletTransaction } from '../../lib/transactions/sendWalletTransaction.js';
import { TxnEventBuilder } from '../../lib/transactions/types.js';
import { getBatchOrderMulticallPayload, getIsInvalidBatchReceiver, getIsTwapOrderPayload } from '../batch/payloads/orderTransactions.js';
import { buildAndSignExpressBatchOrderTxn } from '../express/expressOrderUtils.js';
import { simulateExecution, getSimulationPrices, getOrdersTriggerPriceOverrides } from '../simulation/simulation.js';

const signerAddressError = "Invalid receiver address";
function isTriggerDecreaseOrderType(orderType) {
  return [OrderType.LimitDecrease, OrderType.StopLossDecrease].includes(
    orderType
  );
}
const DEFAULT_RUN_SIMULATION = () => Promise.resolve(void 0);
async function sendBatchOrderTxn({
  chainId,
  signer,
  isGmxAccount,
  provider,
  batchParams,
  expressParams,
  simulationParams,
  callback
}) {
  const eventBuilder = new TxnEventBuilder({
    expressParams,
    batchParams,
    signer
  });
  try {
    if (isGmxAccount && !expressParams) {
      throw new Error(
        "Multichain orders are only supported with express params"
      );
    }
    if (isGmxAccount && !provider) {
      throw new Error("provider is required for multichain txns");
    }
    callback?.(eventBuilder.Submitted());
    let runSimulation = DEFAULT_RUN_SIMULATION;
    if (simulationParams) {
      runSimulation = () => {
        return makeBatchOrderSimulation({
          chainId,
          signer,
          batchParams,
          blockTimestampData: simulationParams.blockTimestampData,
          tokensData: simulationParams.tokensData,
          expressParams,
          provider,
          isGmxAccount
        });
      };
    }
    if (expressParams) {
      await runSimulation().then(() => callback?.(eventBuilder.Simulated()));
      const txnData = await buildAndSignExpressBatchOrderTxn({
        chainId,
        signer,
        batchParams,
        relayParamsPayload: expressParams.relayParamsPayload,
        relayerFeeTokenAddress: expressParams.gasPaymentParams.relayerFeeTokenAddress,
        relayerFeeAmount: expressParams.gasPaymentParams.relayerFeeAmount,
        subaccount: expressParams.subaccount,
        isGmxAccount
      });
      callback?.(eventBuilder.Sending());
      const res = withRetry(
        () => sendExpressTransaction({
          chainId,
          txnData,
          isSponsoredCall: expressParams.isSponsoredCall
        }),
        {
          retryCount: 3,
          delay: 300
        }
      ).then(async (res2) => {
        callback?.(
          eventBuilder.Sent({
            type: "relay",
            relayTaskId: res2?.taskId
          })
        );
        return res2;
      }).catch((error) => {
        throw extendError(error, {
          errorContext: "sending"
        });
      });
      return res;
    }
    const { callData, value } = getBatchOrderMulticallPayload({
      params: batchParams
    });
    return sendWalletTransaction({
      chainId,
      signer,
      rpc: provider,
      to: getContract(chainId, "ExchangeRouter"),
      callData,
      value,
      runSimulation,
      callback: (event) => {
        callback?.(eventBuilder.extend(event));
      }
    });
  } catch (error) {
    callback?.(eventBuilder.Error(error));
    throw error;
  }
}
const makeBatchOrderSimulation = async ({
  chainId,
  signer,
  isGmxAccount,
  provider,
  batchParams,
  blockTimestampData,
  tokensData,
  expressParams
}) => {
  try {
    if (getIsInvalidBatchReceiver(batchParams, signer.address)) {
      throw extendError(new Error(signerAddressError), {
        errorContext: "simulation"
      });
    }
    if (expressParams?.subaccount && expressParams?.subaccountValidations && !expressParams.subaccountValidations.isValid) {
      const { onchainData, signedApproval } = expressParams.subaccount;
      throw extendError(new Error("Invalid subaccount"), {
        data: {
          isExpired: expressParams.subaccountValidations.isExpired,
          isActionsExceeded: expressParams.subaccountValidations.isActionsExceeded,
          isNonceExceeded: expressParams.subaccountValidations.isNonceExpired,
          onchainData: {
            maxAllowedCount: onchainData.maxAllowedCount,
            currentCount: onchainData.currentActionsCount,
            expiresAt: onchainData.expiresAt,
            isActive: onchainData.active,
            nonce: onchainData.approvalNonce,
            multichainNonce: onchainData.multichainApprovalNonce,
            integrationId: onchainData.integrationId
          },
          signedData: {
            maxAllowedCount: signedApproval.maxAllowedCount,
            expiresAt: signedApproval.expiresAt,
            shouldAdd: signedApproval.shouldAdd,
            nonce: signedApproval.nonce,
            integrationId: signedApproval.integrationId
          }
        }
      });
    }
    if (expressParams && expressParams.gasPaymentValidations.isOutGasTokenBalance) {
      throw extendError(new Error("Out of gas token balance"), {
        data: {
          gasPaymentTokenAmount: expressParams.gasPaymentParams.gasPaymentTokenAmount,
          gasPaymentTokenAddress: expressParams.gasPaymentParams.gasPaymentTokenAddress
        }
      });
    }
    if (expressParams && expressParams.gasPaymentValidations.needGasPaymentTokenApproval) {
      throw extendError(new Error("Need gas payment token approval"), {
        data: {
          gasPaymentTokenAmount: expressParams.gasPaymentParams.gasPaymentTokenAmount,
          gasPaymentTokenAddress: expressParams.gasPaymentParams.gasPaymentTokenAddress
        }
      });
    }
    const isSimulationAllowed = batchParams.createOrderParams.every(
      (co) => !isLimitOrderType(co.orderPayload.orderType) && !isTriggerDecreaseOrderType(co.orderPayload.orderType) && !getIsTwapOrderPayload(co.orderPayload)
    );
    if (batchParams.createOrderParams.length === 0 || !isSimulationAllowed) {
      return Promise.resolve();
    }
    if (isGmxAccount) {
      if (!expressParams) {
        throw new Error(
          "Multichain orders are only supported with express params"
        );
      }
      const { callData, feeAmount, feeToken, to } = await buildAndSignExpressBatchOrderTxn({
        signer,
        chainId,
        relayParamsPayload: expressParams.relayParamsPayload,
        batchParams,
        subaccount: expressParams.subaccount,
        emptySignature: true,
        relayerFeeTokenAddress: expressParams.gasPaymentParams.relayerFeeTokenAddress,
        relayerFeeAmount: expressParams.gasPaymentParams.relayerFeeAmount,
        isGmxAccount
      });
      await callRelayTransaction({
        chainId,
        relayRouterAddress: to,
        gelatoRelayFeeToken: feeToken,
        gelatoRelayFeeAmount: feeAmount,
        rpc: provider,
        calldata: callData
      });
    } else {
      const { encodedMulticall, value } = getBatchOrderMulticallPayload({
        params: {
          ...batchParams,
          createOrderParams: [batchParams.createOrderParams[0]]
        }
      });
      await simulateExecution(chainId, {
        account: signer.address,
        prices: getSimulationPrices(
          chainId,
          tokensData,
          getOrdersTriggerPriceOverrides([batchParams.createOrderParams[0]])
        ),
        tokenPermits: expressParams?.relayParamsPayload.tokenPermits ?? [],
        createMulticallPayload: encodedMulticall,
        value,
        blockTimestampData,
        isExpress: Boolean(expressParams)
      });
    }
  } catch (error) {
    throw extendError(error, {
      errorContext: "simulation"
    });
  }
};

export { makeBatchOrderSimulation, sendBatchOrderTxn };
//# sourceMappingURL=sendBatchOrderTxn.js.map
//# sourceMappingURL=sendBatchOrderTxn.js.map