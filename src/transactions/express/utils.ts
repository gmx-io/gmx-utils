import { Address, encodeAbiParameters, keccak256 } from "viem";

import { abis } from "abis";
import type { ContractsChainId, SourceChainId } from "configs/chains";
import { BOTANIX } from "configs/chains";
import { ContractName, getContract } from "configs/contracts";
import { convertTokenAddress, NATIVE_TOKEN_ADDRESS } from "configs/tokens";
import { ExternalSwapQuote } from "domain/externalSwap/types";
import { getBestSwapStrategy } from "domain/externalSwap/utils";
import type { MarketsInfoData } from "domain/markets/types";
import { getOppositeCollateral } from "domain/markets/utils";
import { getSwapAmountsByToValue } from "domain/swap/swapValues";
import type { FindSwapPath, SwapAmounts } from "domain/swap/types";
import type {
  SignedTokenPermit,
  TokenData,
  TokensAllowanceData,
} from "domain/tokens/types";
import { getByKey } from "lib/objects";
import { nowInSeconds } from "lib/time";

import type {
  GasPaymentParams,
  GasPaymentValidations,
  RawRelayParamsPayload,
  RelayFeePayload,
  RelayParamsPayload,
} from "./types";
import {
  combineExternalCalls,
  type ExternalCallsPayload,
  getEmptyExternalCallsPayload,
  getExternalCallsPayload,
} from "../batch/payloads/orderTransactions";

export function getExpressContractAddress(
  chainId: ContractsChainId,
  {
    isSubaccount,
    isMultichain,
    scope,
  }: {
    isSubaccount?: boolean;
    isMultichain?: boolean;
    scope?: "glv" | "gm" | "transfer" | "claims" | "order" | "subaccount";
  }
): Address {
  let contractName: ContractName;
  if (isMultichain) {
    switch (scope) {
      case "claims":
        contractName = "MultichainClaimsRouter";
        break;
      case "order":
        contractName = "MultichainOrderRouter";
        break;
      case "subaccount":
        contractName = "MultichainSubaccountRouter";
        break;
      case "glv":
        contractName = "MultichainGlvRouter";
        break;
      case "gm":
        contractName = "MultichainGmRouter";
        break;
      case "transfer":
        contractName = "MultichainTransferRouter";
        break;
      default:
        throw new Error(`Invalid scope: ${scope}`);
    }
  } else {
    if (isSubaccount) {
      contractName = "SubaccountGelatoRelayRouter";
    } else {
      contractName = "GelatoRelayRouter";
    }
  }

  return getContract(chainId, contractName);
}

export type SignatureDomain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: Address;
};

export function getGelatoRelayRouterDomain(
  chainId: SourceChainId | ContractsChainId,
  relayRouterAddress: string
): SignatureDomain {
  const name = "GmxBaseGelatoRelayRouter";

  return {
    name,
    version: "1",
    chainId,
    verifyingContract: relayRouterAddress as Address,
  };
}

export function getOracleParams({
  chainId,
  tokenAddresses,
}: {
  chainId: ContractsChainId;
  tokenAddresses: string[];
}) {
  const uniqTokenAddresses = Array.from(
    new Set(
      tokenAddresses.map((tokenAddress) =>
        convertTokenAddress(chainId, tokenAddress, "wrapped")
      )
    )
  );
  const chainLinkPriceFeedProvider = getContract(
    chainId,
    "ChainlinkPriceFeedProvider"
  );

  return {
    tokens: uniqTokenAddresses,
    providers: Array(uniqTokenAddresses.length).fill(
      chainLinkPriceFeedProvider
    ),
    data: Array(uniqTokenAddresses.length).fill("0x"),
  };
}

export function getSwapPathOracleTokens({
  marketsInfoData,
  initialCollateralAddress,
  swapPath,
}: {
  marketsInfoData: MarketsInfoData;
  initialCollateralAddress: string;
  swapPath: string[];
}): string[] {
  let currentToken = initialCollateralAddress;
  const tokenAddresses: string[] = [initialCollateralAddress];

  for (const marketAddress of swapPath) {
    const marketInfo = getByKey(marketsInfoData, marketAddress);

    if (!marketInfo) {
      throw new Error(`Market not found for oracle params: ${marketAddress}`);
    }

    const tokenOut = getOppositeCollateral(marketInfo, currentToken);

    if (!tokenOut?.address) {
      throw new Error(
        `Token not found for oracle params: ${initialCollateralAddress}`
      );
    }

    currentToken = tokenOut.address;
    tokenAddresses.push(currentToken, marketInfo.indexToken.address);
  }

  return tokenAddresses;
}

export function getOracleParamsForRelayParams({
  chainId,
  gasPaymentTokenAddress,
  relayerFeeTokenAddress,
  feeSwapPath,
  externalCalls,
  marketsInfoData,
}: {
  chainId: ContractsChainId;
  gasPaymentTokenAddress: string;
  relayerFeeTokenAddress: string;
  feeSwapPath: string[];
  externalCalls: ExternalCallsPayload | undefined;
  marketsInfoData: MarketsInfoData;
}) {
  const tokenAddresses = [gasPaymentTokenAddress, relayerFeeTokenAddress];

  if (externalCalls) {
    tokenAddresses.push(...externalCalls.sendTokens);
  }

  if (feeSwapPath.length) {
    tokenAddresses.push(
      ...getSwapPathOracleTokens({
        marketsInfoData,
        initialCollateralAddress: gasPaymentTokenAddress,
        swapPath: feeSwapPath,
      })
    );
  }

  return getOracleParams({ chainId, tokenAddresses });
}

export function getRelayerFeeParams({
  chainId,
  account,
  gasPaymentToken,
  relayerFeeToken,
  relayerFeeAmount,
  totalRelayerFeeTokenAmount,
  gasPaymentTokenAsCollateralAmount,
  transactionExternalCalls,
  feeExternalSwapQuote,
  findFeeSwapPath,
}: {
  chainId: ContractsChainId;
  account: string;
  relayerFeeAmount: bigint;
  totalRelayerFeeTokenAmount: bigint;
  relayerFeeToken: TokenData;
  gasPaymentToken: TokenData;
  gasPaymentTokenAsCollateralAmount: bigint;
  findFeeSwapPath: FindSwapPath | undefined;
  feeExternalSwapQuote: ExternalSwapQuote | undefined;
  transactionExternalCalls: ExternalCallsPayload | undefined;
}) {
  const gasPaymentParams: GasPaymentParams = {
    gasPaymentToken: gasPaymentToken,
    relayFeeToken: relayerFeeToken,
    gasPaymentTokenAddress: gasPaymentToken.address,
    relayerFeeTokenAddress: relayerFeeToken.address,
    relayerFeeAmount,
    totalRelayerFeeTokenAmount,
    gasPaymentTokenAmount: 0n,
    gasPaymentTokenAsCollateralAmount,
  };

  let feeParams: RelayFeePayload;
  let externalCalls =
    transactionExternalCalls ?? getEmptyExternalCallsPayload();
  let feeExternalSwapGasLimit = 0n;

  if (relayerFeeToken.address === gasPaymentToken.address) {
    feeParams = {
      feeToken: relayerFeeToken.address,
      feeAmount: totalRelayerFeeTokenAmount,
      feeSwapPath: [],
    };
    gasPaymentParams.gasPaymentTokenAmount = totalRelayerFeeTokenAmount;
  } else {
    let feeSwapAmounts: SwapAmounts | undefined;

    if (findFeeSwapPath) {
      feeSwapAmounts = getSwapAmountsByToValue({
        tokenIn: gasPaymentToken,
        tokenOut: relayerFeeToken,
        amountOut: totalRelayerFeeTokenAmount,
        isLimit: false,
        findSwapPath: findFeeSwapPath,
        swapOptimizationOrder: ["length"],
        uiFeeFactor: 0n,
        marketsInfoData: undefined,
        chainId,
        externalSwapQuoteParams: undefined,
      });
    }

    const bestFeeSwapStrategy = getBestSwapStrategy({
      internalSwapAmounts: feeSwapAmounts,
      externalSwapQuote: feeExternalSwapQuote,
    });

    if (bestFeeSwapStrategy?.swapPath) {
      feeParams = {
        feeToken: gasPaymentToken.address,
        feeAmount: bestFeeSwapStrategy.amountIn,
        feeSwapPath: bestFeeSwapStrategy.swapPath,
      };
      gasPaymentParams.gasPaymentTokenAmount = bestFeeSwapStrategy.amountIn;
      gasPaymentParams.totalRelayerFeeTokenAmount =
        bestFeeSwapStrategy.amountOut;
    } else if (bestFeeSwapStrategy?.externalSwapQuote) {
      externalCalls = combineExternalCalls([
        externalCalls,
        getExternalCallsPayload({
          chainId,
          account,
          quote: bestFeeSwapStrategy.externalSwapQuote,
        }),
      ]);
      feeExternalSwapGasLimit =
        bestFeeSwapStrategy.externalSwapQuote.txnData.estimatedGas;
      feeParams = {
        feeToken: relayerFeeToken.address,
        feeAmount: 0n,
        feeSwapPath: [],
      };
      gasPaymentParams.gasPaymentTokenAmount =
        bestFeeSwapStrategy.externalSwapQuote.amountIn;
      gasPaymentParams.totalRelayerFeeTokenAmount =
        bestFeeSwapStrategy.externalSwapQuote.amountOut;
    } else {
      return undefined;
    }
  }

  return {
    feeParams,
    externalCalls,
    feeExternalSwapGasLimit,
    gasPaymentParams,
  };
}

export function getRawRelayerParams({
  chainId,
  gasPaymentTokenAddress,
  relayerFeeTokenAddress,
  feeParams,
  externalCalls,
  tokenPermits,
  marketsInfoData,
}: {
  chainId: ContractsChainId;
  gasPaymentTokenAddress: string;
  relayerFeeTokenAddress: string;
  feeParams: RelayFeePayload;
  externalCalls: ExternalCallsPayload;
  tokenPermits: SignedTokenPermit[];
  marketsInfoData: MarketsInfoData;
}): RawRelayParamsPayload {
  const oracleParams = getOracleParamsForRelayParams({
    chainId,
    externalCalls,
    feeSwapPath: feeParams.feeSwapPath,
    gasPaymentTokenAddress,
    relayerFeeTokenAddress,
    marketsInfoData,
  });

  const relayParamsPayload: RawRelayParamsPayload = {
    oracleParams,
    tokenPermits,
    externalCalls,
    fee: feeParams,
    desChainId: BigInt(chainId),
    userNonce: BigInt(nowInSeconds()),
  };

  return relayParamsPayload;
}

export function hashRelayParams(relayParams: RelayParamsPayload) {
  const encoded = encodeAbiParameters(abis.RelayParams, [
    {
      tokens: relayParams.oracleParams.tokens as readonly `0x${string}`[],
      providers: relayParams.oracleParams.providers as readonly `0x${string}`[],
      data: relayParams.oracleParams.data as readonly `0x${string}`[],
    },
    {
      sendTokens: relayParams.externalCalls
        .sendTokens as readonly `0x${string}`[],
      sendAmounts: relayParams.externalCalls.sendAmounts,
      externalCallTargets: relayParams.externalCalls
        .externalCallTargets as readonly `0x${string}`[],
      externalCallDataList: relayParams.externalCalls
        .externalCallDataList as readonly `0x${string}`[],
      refundTokens: relayParams.externalCalls
        .refundTokens as readonly `0x${string}`[],
      refundReceivers: relayParams.externalCalls
        .refundReceivers as readonly `0x${string}`[],
    },
    relayParams.tokenPermits as readonly {
      owner: `0x${string}`;
      spender: `0x${string}`;
      value: bigint;
      deadline: bigint;
      v: number;
      r: `0x${string}`;
      s: `0x${string}`;
      token: `0x${string}`;
    }[],
    {
      feeToken: relayParams.fee.feeToken as `0x${string}`,
      feeAmount: relayParams.fee.feeAmount,
      feeSwapPath: relayParams.fee.feeSwapPath as readonly `0x${string}`[],
    },
    relayParams.userNonce,
    relayParams.deadline,
    relayParams.desChainId,
  ]);

  const hash = keccak256(encoded);

  return hash;
}

export function getNeedTokenApprove(
  tokenAllowanceData: TokensAllowanceData | undefined,
  tokenAddress: string | undefined,
  amountToSpend: bigint | undefined,
  permits: SignedTokenPermit[]
): boolean {
  if (
    tokenAddress === NATIVE_TOKEN_ADDRESS ||
    amountToSpend === undefined ||
    amountToSpend <= 0n
  ) {
    return false;
  }

  if (
    !tokenAllowanceData ||
    !tokenAddress ||
    tokenAllowanceData?.[tokenAddress] === undefined
  ) {
    return true;
  }

  const shouldApprove = amountToSpend > tokenAllowanceData[tokenAddress];
  const signedPermit = permits.find(
    (permit) =>
      permit.token === tokenAddress &&
      BigInt(permit.value) >= amountToSpend &&
      Number(permit.deadline) > nowInSeconds()
  );

  return shouldApprove && !signedPermit;
}

export function getGasPaymentValidations({
  gasPaymentToken,
  gasPaymentTokenAmount,
  gasPaymentTokenAsCollateralAmount,
  gasPaymentAllowanceData,
  tokenPermits,
  isGmxAccount,
}: {
  gasPaymentToken: TokenData;
  gasPaymentTokenAmount: bigint;
  gasPaymentTokenAsCollateralAmount: bigint;
  gasPaymentAllowanceData: TokensAllowanceData;
  tokenPermits: SignedTokenPermit[];
  isGmxAccount: boolean;
}): GasPaymentValidations {
  const gasTokenAmountWithBuffer = (gasPaymentTokenAmount * 13n) / 10n;
  const totalGasPaymentTokenAmount =
    gasPaymentTokenAsCollateralAmount + gasTokenAmountWithBuffer;

  const tokenBalance = isGmxAccount
    ? gasPaymentToken.gmxAccountBalance
    : gasPaymentToken.walletBalance;

  const isOutGasTokenBalance =
    tokenBalance === undefined || totalGasPaymentTokenAmount > tokenBalance;

  const needGasPaymentTokenApproval = isGmxAccount
    ? false
    : getNeedTokenApprove(
        gasPaymentAllowanceData,
        gasPaymentToken?.address,
        totalGasPaymentTokenAmount,
        tokenPermits
      );

  return {
    isOutGasTokenBalance,
    needGasPaymentTokenApproval,
    isValid: !isOutGasTokenBalance && !needGasPaymentTokenApproval,
  };
}

export function getIsValidExpressParams({
  chainId,
  gasPaymentValidations,
  isSponsoredCall,
}: {
  chainId: number;
  isSponsoredCall: boolean;
  gasPaymentValidations: GasPaymentValidations;
}): boolean {
  if (chainId === BOTANIX && !isSponsoredCall) {
    return false;
  }

  return gasPaymentValidations.isValid;
}

export function getOrderRelayRouterAddress(
  chainId: ContractsChainId,
  isSubaccount: boolean,
  isMultichain: boolean
): string {
  let contractName: ContractName;
  if (isMultichain) {
    if (isSubaccount) {
      contractName = "MultichainSubaccountRouter";
    } else {
      contractName = "MultichainOrderRouter";
    }
  } else {
    if (isSubaccount) {
      contractName = "SubaccountGelatoRelayRouter";
    } else {
      contractName = "GelatoRelayRouter";
    }
  }

  return getContract(chainId, contractName);
}
