import {
  encodeAbiParameters,
  keccak256,
  maxUint256,
  zeroAddress,
  zeroHash,
  type PublicClient,
} from "viem";

import { abis } from "abis";
import type { AnyChainId, ContractsChainId } from "configs/chains";
import { getContract } from "configs/contracts";
import {
  SUBACCOUNT_ORDER_ACTION,
  maxAllowedSubaccountActionCountKey,
  subaccountActionCountKey,
  subaccountExpiresAtKey,
  subaccountIntegrationIdKey,
  subaccountListKey,
} from "configs/dataStore";
import { isSourceChain } from "configs/multichain";
import { bigMath } from "lib/bigmath";
import { ZERO_DATA } from "lib/hash";
import { nowInSeconds } from "lib/time";

import type {
  SignedSubaccountApproval,
  Subaccount,
  SubaccountApproval,
  SubaccountOnchainData,
  SubaccountValidations,
} from "./types";

export function getSubaccountValidations({
  requiredActions,
  subaccount,
  subaccountRouterAddress,
}: {
  requiredActions: number;
  subaccount: Subaccount;
  subaccountRouterAddress: string;
}): SubaccountValidations {
  return {
    isExpired: getIsSubaccountExpired(subaccount),
    isActionsExceeded: getIsSubaccountActionsExceeded(
      subaccount,
      requiredActions
    ),
    isNonceExpired: getIsSubaccountNonceExpired(subaccount),
    isApprovalInvalid: getIsSubaccountApprovalInvalid({
      chainId: subaccount.chainId,
      signerChainId: subaccount.signerChainId,
      onchainData: subaccount.onchainData,
      signedApproval: subaccount.signedApproval,
      subaccountRouterAddress,
    }),
    isValid: !getIsInvalidSubaccount({
      subaccount,
      requiredActions,
      subaccountRouterAddress,
    }),
  };
}

export function getMaxSubaccountActions(subaccount: {
  onchainData: SubaccountOnchainData;
  signedApproval: SignedSubaccountApproval | undefined;
}): bigint {
  if (
    subaccount.signedApproval &&
    !getIsEmptySubaccountApproval(subaccount.signedApproval)
  ) {
    return BigInt(subaccount.signedApproval.maxAllowedCount);
  }

  return subaccount.onchainData.maxAllowedCount;
}

export function getSubaccountExpiresAt(subaccount: {
  onchainData: SubaccountOnchainData;
  signedApproval: SignedSubaccountApproval | undefined;
}): bigint {
  if (
    subaccount.signedApproval &&
    !getIsEmptySubaccountApproval(subaccount.signedApproval)
  ) {
    return BigInt(subaccount.signedApproval.expiresAt);
  }

  return subaccount.onchainData.expiresAt;
}

export function getRemainingSubaccountActions(subaccount: {
  onchainData: SubaccountOnchainData;
  signedApproval: SignedSubaccountApproval | undefined;
}): bigint {
  const maxAllowedCount = getMaxSubaccountActions(subaccount);
  const currentActionCount = subaccount.onchainData.currentActionsCount;

  return maxAllowedCount - currentActionCount;
}

export function getIsApprovalDeadlineExpired(
  approval: SubaccountApproval
): boolean {
  const now = BigInt(nowInSeconds());
  const deadline = approval.deadline;

  return now >= deadline;
}

export function getIsSubaccountActionsExceeded(
  subaccount: Subaccount,
  requiredActions: number
) {
  return (
    getRemainingSubaccountActions(subaccount) <
    bigMath.max(1n, BigInt(requiredActions))
  );
}

export function getRemainingSubaccountSeconds(subaccount: Subaccount): bigint {
  const expiresAt = getSubaccountExpiresAt(subaccount);

  const now = BigInt(nowInSeconds());

  return bigMath.max(0n, expiresAt - now);
}

export function getIsApprovalExpired(subaccount: Subaccount): boolean {
  const { signedApproval } = subaccount;

  if (getIsEmptySubaccountApproval(signedApproval)) {
    return false;
  }

  const now = BigInt(nowInSeconds());

  const expiresAt = signedApproval.expiresAt;
  const deadline = signedApproval.deadline;

  return now >= expiresAt || now >= deadline;
}

export function getIsSubaccountNonceExpired({
  chainId,
  onchainData,
  signedApproval,
}: {
  chainId: ContractsChainId;
  onchainData: SubaccountOnchainData;
  signedApproval: SignedSubaccountApproval;
}): boolean {
  if (getIsEmptySubaccountApproval(signedApproval)) {
    return false;
  }

  if (chainId !== signedApproval.signatureChainId) {
    return false;
  }

  let onChainNonce: bigint;
  if (
    signedApproval.subaccountRouterAddress ===
    getContract(chainId, "SubaccountGelatoRelayRouter")
  ) {
    onChainNonce = onchainData.approvalNonce;
  } else if (
    signedApproval.subaccountRouterAddress ===
    getContract(chainId, "MultichainSubaccountRouter")
  ) {
    onChainNonce = onchainData.multichainApprovalNonce;
  } else if (!signedApproval.subaccountRouterAddress) {
    if (isSourceChain(signedApproval.signatureChainId)) {
      onChainNonce = onchainData.multichainApprovalNonce;
    } else {
      onChainNonce = onchainData.approvalNonce;
    }
  } else {
    return false;
  }

  const signedNonce = signedApproval.nonce;

  return signedNonce !== onChainNonce;
}

export function getIsSubaccountApprovalInvalid({
  chainId,
  signerChainId,
  signedApproval,
  onchainData,
  subaccountRouterAddress,
}: {
  chainId: ContractsChainId;
  signerChainId: AnyChainId;
  signedApproval: SignedSubaccountApproval;
  onchainData: SubaccountOnchainData;
  subaccountRouterAddress: string;
}): boolean {
  if (getIsEmptySubaccountApproval(signedApproval)) {
    return false;
  }

  const isSignedSubaccountFresh = !onchainData.active;

  let relatedOnchainNonce: bigint | undefined;
  if (
    signedApproval.subaccountRouterAddress ===
    getContract(chainId, "MultichainSubaccountRouter")
  ) {
    relatedOnchainNonce = onchainData.multichainApprovalNonce;
  } else if (
    signedApproval.subaccountRouterAddress ===
      getContract(chainId, "SubaccountGelatoRelayRouter") ||
    !signedApproval.subaccountRouterAddress
  ) {
    relatedOnchainNonce = onchainData.approvalNonce;
  } else {
    return true;
  }

  const isSignedSubaccountPossibleUpdate =
    signedApproval.nonce === relatedOnchainNonce;

  const result =
    (isSignedSubaccountFresh || isSignedSubaccountPossibleUpdate) &&
    (signedApproval.signatureChainId !== signerChainId ||
      signedApproval.subaccountRouterAddress !== subaccountRouterAddress);

  return result;
}

export function getIsSubaccountExpired(subaccount: Subaccount): boolean {
  const now = BigInt(nowInSeconds());
  const isApprovalExpired = getIsApprovalExpired(subaccount);

  if (isApprovalExpired) {
    return true;
  }

  const expiresAt = getSubaccountExpiresAt(subaccount);
  const isExpired = now >= expiresAt;

  return isExpired;
}

export function getIsInvalidSubaccount({
  subaccount,
  requiredActions,
  subaccountRouterAddress,
}: {
  subaccount: Subaccount;
  requiredActions: number;
  subaccountRouterAddress: string;
}): boolean {
  const isExpired = getIsSubaccountExpired(subaccount);
  const isNonceExpired = getIsSubaccountNonceExpired(subaccount);
  const actionsExceeded = getIsSubaccountActionsExceeded(
    subaccount,
    requiredActions
  );
  const isApprovalInvalid = getIsSubaccountApprovalInvalid({
    chainId: subaccount.chainId,
    signedApproval: subaccount.signedApproval,
    subaccountRouterAddress,
    signerChainId: subaccount.signerChainId,
    onchainData: subaccount.onchainData,
  });

  return isExpired || isNonceExpired || actionsExceeded || isApprovalInvalid;
}

export function getEmptySubaccountApproval(
  chainId: ContractsChainId,
  subaccountAddress: string
): SignedSubaccountApproval {
  return {
    subaccount: subaccountAddress,
    shouldAdd: false,
    expiresAt: 0n,
    maxAllowedCount: 0n,
    actionType: SUBACCOUNT_ORDER_ACTION,
    nonce: 0n,
    deadline: maxUint256,
    desChainId: BigInt(chainId),
    signature: ZERO_DATA,
    signedAt: 0,
    integrationId: zeroHash,
    subaccountRouterAddress: zeroAddress,
    signatureChainId: chainId,
  };
}

export function getIsEmptySubaccountApproval(
  subaccountApproval: SignedSubaccountApproval
): boolean {
  return (
    subaccountApproval.signature === ZERO_DATA &&
    subaccountApproval.nonce === 0n &&
    subaccountApproval.expiresAt === 0n &&
    subaccountApproval.maxAllowedCount === 0n &&
    subaccountApproval.shouldAdd === false &&
    subaccountApproval.integrationId === zeroHash
  );
}

export function hashSubaccountApproval(
  subaccountApproval: SignedSubaccountApproval
) {
  if (!subaccountApproval) {
    return zeroHash;
  }

  const encodedData = encodeAbiParameters(
    [
      {
        type: "tuple",
        components: [
          { name: "subaccount", type: "address" },
          { name: "shouldAdd", type: "bool" },
          { name: "expiresAt", type: "uint256" },
          { name: "maxAllowedCount", type: "uint256" },
          { name: "actionType", type: "bytes32" },
          { name: "nonce", type: "uint256" },
          { name: "desChainId", type: "uint256" },
          { name: "deadline", type: "uint256" },
          { name: "integrationId", type: "bytes32" },
          { name: "signature", type: "bytes" },
        ],
      },
    ],
    [subaccountApproval as any]
  );

  return keccak256(encodedData);
}

export function getIsSubaccountApprovalSynced(params: {
  chainId: ContractsChainId;
  signedApproval: SignedSubaccountApproval;
  onchainData: SubaccountOnchainData;
}): boolean {
  const { signedApproval, onchainData } = params;

  if (getIsSubaccountNonceExpired(params)) {
    return true;
  }

  return (
    onchainData.maxAllowedCount === signedApproval.maxAllowedCount &&
    onchainData.expiresAt === signedApproval.expiresAt &&
    onchainData.active === true
  );
}

export async function getSubaccountOnchainData({
  chainId,
  signer,
  publicClient,
  subaccountAddress,
}: {
  chainId: ContractsChainId;
  signer: { address: string };
  publicClient: PublicClient;
  subaccountAddress: string;
}): Promise<SubaccountOnchainData> {
  const account = signer.address;

  const results = await publicClient.multicall({
    contracts: [
      {
        address: getContract(
          chainId,
          "SubaccountGelatoRelayRouter"
        ) as `0x${string}`,
        abi: abis.AbstractSubaccountApprovalNonceable,
        functionName: "subaccountApprovalNonces",
        args: [account as `0x${string}`],
      },
      {
        address: getContract(
          chainId,
          "MultichainSubaccountRouter"
        ) as `0x${string}`,
        abi: abis.AbstractSubaccountApprovalNonceable,
        functionName: "subaccountApprovalNonces",
        args: [account as `0x${string}`],
      },
      {
        address: getContract(chainId, "DataStore") as `0x${string}`,
        abi: abis.DataStore,
        functionName: "containsAddress",
        args: [
          subaccountListKey(account) as `0x${string}`,
          subaccountAddress as `0x${string}`,
        ],
      },
      {
        address: getContract(chainId, "DataStore") as `0x${string}`,
        abi: abis.DataStore,
        functionName: "getUint",
        args: [
          maxAllowedSubaccountActionCountKey(
            account,
            subaccountAddress,
            SUBACCOUNT_ORDER_ACTION
          ) as `0x${string}`,
        ],
      },
      {
        address: getContract(chainId, "DataStore") as `0x${string}`,
        abi: abis.DataStore,
        functionName: "getUint",
        args: [
          subaccountActionCountKey(
            account,
            subaccountAddress,
            SUBACCOUNT_ORDER_ACTION
          ) as `0x${string}`,
        ],
      },
      {
        address: getContract(chainId, "DataStore") as `0x${string}`,
        abi: abis.DataStore,
        functionName: "getUint",
        args: [
          subaccountExpiresAtKey(
            account,
            subaccountAddress,
            SUBACCOUNT_ORDER_ACTION
          ) as `0x${string}`,
        ],
      },
      {
        address: getContract(chainId, "DataStore") as `0x${string}`,
        abi: abis.DataStore,
        functionName: "getBytes32",
        args: [
          subaccountIntegrationIdKey(
            account,
            subaccountAddress
          ) as `0x${string}`,
        ],
      },
    ],
  });

  if (results.some((result) => result.status === "failure")) {
    throw new Error("Multicall failed for subaccount onchain data");
  }

  return {
    approvalNonce: results[0].result as bigint,
    multichainApprovalNonce: results[1].result as bigint,
    active: results[2].result as boolean,
    maxAllowedCount: results[3].result as bigint,
    currentActionsCount: results[4].result as bigint,
    expiresAt: results[5].result as bigint,
    integrationId:
      (results[6].result as `0x${string}`) === zeroHash
        ? undefined
        : (results[6].result as `0x${string}`),
  };
}
