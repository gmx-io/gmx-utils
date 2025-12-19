// TODO

// import { ContractsChainId } from "configs/chains";

// import { getContract } from "configs/contracts";
// import {
//   GasLimitsConfig,
//   L1ExpressOrderGasReference,
// } from "domain/executionFee/types";
// import { MarketsInfoData } from "domain/markets/types";
// import { Subaccount } from "domain/subaccount";
// import { TokensData } from "domain/tokens/types";
// import { TokensAllowanceData } from "domain/tokens/types";
// import { ISigner } from "lib/signing/signing";
// import {
//   ExpressTxnData,
//   sendExpressTransaction,
// } from "lib/transactions/sendExpressTransaction";
// import { sendWalletTransaction } from "lib/transactions/sendWalletTransaction";
// import {
//   BatchOrderTxnParams,
//   CancelOrderTxnParams,
//   DecreasePositionOrderParams,
//   getBatchOrderMulticallPayload,
//   IncreasePositionOrderParams,
//   SwapOrderParams,
//   UpdateOrderParams,
// } from "transactions/batch/payloads/orderTransactions";
// import {
//   buildAndSignExpressBatchOrderTxn,
//   estimateExpressParams,
// } from "transactions/express/expressOrderUtils";
// import {
//   ExpressTransactionEstimatorParams,
//   ExpressTxnParams,
//   GlobalExpressParams,
// } from "transactions/express/types";

// type BatchTransactionPayloadNode = {
//   chainId: ContractsChainId;
//   batchParams: BatchOrderTxnParams;
//   // data: {
//   //   marketsData: MarketsInfoData;
//   //   tokensData: TokensData;
//   //   routerTokenAllowancesData: TokensAllowanceData;
//   //   relayRouterTokenAllowancesData: TokensAllowanceData;
//   //   gasLimits: GasLimitsConfig;
//   //   l1Reference: L1ExpressOrderGasReference;
//   //   gasPrice: bigint;
//   // };
//   express: Omit<ExpressTransactionBuilder, "create">;
//   classic: Omit<ClassicTransactionSender, "create">;
// };

// type BatchTransactionBuilder = {
//   create: (params: BatchTransactionBuilderParams) => BatchTransactionBuilder;

//   increase: (params: IncreasePositionOrderParams) => BatchTransactionBuilder;
//   decrease: (params: DecreasePositionOrderParams) => BatchTransactionBuilder;
//   swap: (params: SwapOrderParams) => BatchTransactionBuilder;
//   updateOrder: (params: UpdateOrderParams) => BatchTransactionBuilder;
//   cancelOrder: (params: CancelOrderTxnParams) => BatchTransactionBuilder;
//   cancelOrders: (params: CancelOrderTxnParams[]) => BatchTransactionBuilder;

//   build: () => BatchTransactionPayloadNode;
// };

// type ExpressTransactionUserParams = {
//   gasPaymentTokenAddress?: string;
//   subaccount?: Subaccount;
//   isGmxAccount: boolean;
// };

// type ExpressTransactionBuilder = {
//   setIsGmxAccount: (isGmxAccount: boolean) => ExpressTransactionBuilder;
//   setSubaccount: (subaccount: Subaccount) => ExpressTransactionBuilder;
//   setGasPaymentTokenAddress: (
//     gasPaymentTokenAddress: string
//   ) => ExpressTransactionBuilder;

//   estimate: () => Promise<ExpressTransactionSigner>;

//   send: () => Promise<void>;
// };

// type ExpressTransactionSigner = {
//   sign: () => Promise<SignedExpressTransactionNode>;
//   send: () => Promise<void>;
// };

// type SignedExpressTransactionNode = {
//   signature: string;
// };

// type ClassicTransactionSender = {
//   send: (signer: ISigner) => Promise<void>;
// };

// type TransactionComposer = {
//   batch: BatchTransactionBuilder;
// };

// const transactionComposer = {
//   batch: batchBuilder,
// };

// type BatchTransactionBuilderParams = {};

// function batchBuilder(node: {
//   chainId: ContractsChainId;
//   batchParams: BatchOrderTxnParams;
// }) {
//   function build(): BatchTransactionPayloadNode {
//     const classicPayload = getBatchOrderMulticallPayload({
//       params: node.batchParams,
//     });

//     const transactionParams = getBatchExpressEstimatorParams({
//       signer,
//       batchParams,
//       gasLimits: globalExpressParams.gasLimits,
//       gasPaymentToken: globalExpressParams.gasPaymentToken,
//       chainId,
//       tokensData: globalExpressParams.tokensData,
//       isGmxAccount,
//     });

//     return {
//       chainId: node.chainId,
//       batchParams: node.batchParams,
//       express: () => expressBuilder(node),
//       classic: classicBuilder({
//         chainId: node.chainId,
//         callData: classicPayload.callData,
//         value: classicPayload.value,
//       }),
//     };
//   }

//   return {
//     create: () => batchBuilder(node),
//     increase: (params: IncreasePositionOrderParams) => batchBuilder(node),
//     decrease: (params: DecreasePositionOrderParams) => batchBuilder(node),
//     swap: (params: SwapOrderParams) => batchBuilder(node),
//     updateOrder: (params: UpdateOrderParams) => batchBuilder(node),
//     cancelOrder: (params: CancelOrderTxnParams) => batchBuilder(node),
//     cancelOrders: (params: CancelOrderTxnParams[]) => batchBuilder(node),
//     build,
//   };
// }

// type IRpc = {
//   send: (request: any) => Promise<any>;
//   call: (request: any) => Promise<any>;
//   estimateGas: (request: any) => Promise<any>;
//   getBlockNumber: () => Promise<number>;
//   getTransaction: (hash: string) => Promise<any>;
//   getBlock: (hash: string) => Promise<any>;
//   getTransactionReceipt: (hash: string) => Promise<any>;
//   getTransactionCount: (address: string) => Promise<number>;
//   getBalance: (address: string) => Promise<bigint>;
//   provider: any;
// };

// type ExpressBuilderNode = {};

// function expressBuilder(node: {
//   chainId: ContractsChainId;
//   globalExpressParams: GlobalExpressParams;
//   batchParams: BatchOrderTxnParams;
//   userParams: ExpressTransactionUserParams;
//   isGmxAccount: boolean;
//   rpc: IRpc;
//   transactionParams: ExpressTransactionEstimatorParams;
//   expressTransactionBuilder: ExpressTransactionBuilder;
// }) {
//   async function _getExpressParams({
//     requireValidations = true,
//     method = "approximate",
//   }: {
//     requireValidations?: boolean;
//     method: "approximate" | "estimateGas";
//   }): Promise<ExpressTxnParams | undefined> {
//     return estimateExpressParams({
//       chainId: node.chainId,
//       isGmxAccount: node.isGmxAccount,
//       provider: node.rpc.provider,
//       transactionParams: node.transactionParams,
//       globalExpressParams: node.globalExpressParams,
//       estimationMethod: method,
//       requireValidations: requireValidations,
//       subaccount: node.userParams.subaccount,
//     });
//   }

//   async function estimate({
//     requireValidations = true,
//     method = "approximate",
//   }: {
//     requireValidations?: boolean;
//     method: "approximate" | "estimateGas";
//   }): Promise<ExpressTransactionSigner> {
//     const expressParams = await _getExpressParams({
//       requireValidations,
//       method,
//     });

//     if (!expressParams) {
//       throw new Error("Failed to estimate express params");
//     }

//     return expressEstimatedBuilder({});
//   }

//   async function send(signer: ISigner) {
//     const expressParams = await _getExpressParams({
//       requireValidations: true,
//       method: "approximate",
//     });

//     if (!expressParams) {
//       throw new Error("Failed to estimate express params");
//     }

//     const txnData = await buildAndSignExpressBatchOrderTxn({
//       chainId: node.chainId,
//       signer: signer as any,
//       batchParams: node.batchParams,
//       relayParamsPayload: expressParams.relayParamsPayload,
//       relayerFeeTokenAddress:
//         expressParams.gasPaymentParams.relayerFeeTokenAddress,
//       relayerFeeAmount: expressParams.gasPaymentParams.relayerFeeAmount,
//       subaccount: expressParams.subaccount,
//       isGmxAccount: node.isGmxAccount,
//     });

//     await sendExpressTransaction({
//       chainId: node.chainId,
//       txnData,
//       isSponsoredCall: expressParams.isSponsoredCall,
//     });
//   }

//   return {
//     estimate,
//     send,
//   };
// }

// function expressEstimatedBuilder(node: {
//   chainId: ContractsChainId;
//   batchParams: BatchOrderTxnParams;
//   expressParams: ExpressTxnParams;
//   isGmxAccount: boolean;
//   txnData?: ExpressTxnData;
// }): ExpressTransactionSigner {
//   async function sign(signer: ISigner) {
//     const txnData =
//       node.txnData ??
//       (await buildAndSignExpressBatchOrderTxn({
//         chainId: node.chainId,
//         signer: signer as any,
//         batchParams: node.batchParams,
//         relayParamsPayload: node.expressParams.relayParamsPayload,
//         relayerFeeTokenAddress:
//           node.expressParams.gasPaymentParams.relayerFeeTokenAddress,
//         relayerFeeAmount: node.expressParams.gasPaymentParams.relayerFeeAmount,
//         subaccount: node.expressParams.subaccount,
//         isGmxAccount: node.isGmxAccount,
//       }));

//     return expressEstimatedBuilder({
//       chainId: node.chainId,
//       batchParams: node.batchParams,
//       expressParams: node.expressParams,
//       isGmxAccount: node.isGmxAccount,
//       txnData,
//     });
//   }

//   async function send(signer: ISigner) {
//     const txnData =
//       node.txnData ??
//       (await buildAndSignExpressBatchOrderTxn({
//         chainId: node.chainId,
//         signer: signer as any,
//         batchParams: node.batchParams,
//         relayParamsPayload: node.expressParams.relayParamsPayload,
//         relayerFeeTokenAddress:
//           node.expressParams.gasPaymentParams.relayerFeeTokenAddress,
//         relayerFeeAmount: node.expressParams.gasPaymentParams.relayerFeeAmount,
//         subaccount: node.expressParams.subaccount,
//         isGmxAccount: node.isGmxAccount,
//       }));

//     await sendExpressTransaction({
//       chainId: node.chainId,
//       txnData,
//       isSponsoredCall: node.expressParams.isSponsoredCall,
//     });
//   }

//   return {
//     sign,
//     send,
//   };
// }

// function classicBuilder(node: {
//   chainId: ContractsChainId;
//   callData: string;
//   value: bigint;
// }): ClassicTransactionSender {
//   async function send(signer: ISigner) {
//     await sendWalletTransaction({
//       chainId: node.chainId,
//       signer,
//       to: getContract(node.chainId, "ExchangeRouter"),
//       callData: node.callData,
//       value: node.value,
//     });
//   }

//   return {
//     send,
//   };
// }
