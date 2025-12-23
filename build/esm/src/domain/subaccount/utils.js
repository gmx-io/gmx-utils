import { zeroAddress, zeroHash, maxUint256, encodeAbiParameters, keccak256 } from 'viem';
import { abis } from '../../abis/index.js';
import { getContract } from '../../configs/contracts.js';
import { SUBACCOUNT_ORDER_ACTION, subaccountListKey, maxAllowedSubaccountActionCountKey, subaccountActionCountKey, subaccountExpiresAtKey, subaccountIntegrationIdKey } from '../../configs/dataStore.js';
import { isSourceChain } from '../../configs/multichain.js';
import { bigMath } from '../../lib/bigmath/index.js';
import { ZERO_DATA } from '../../lib/hash/index.js';
import { nowInSeconds } from '../../lib/time.js';

function getSubaccountValidations({
  requiredActions,
  subaccount,
  subaccountRouterAddress
}) {
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
      subaccountRouterAddress
    }),
    isValid: !getIsInvalidSubaccount({
      subaccount,
      requiredActions,
      subaccountRouterAddress
    })
  };
}
function getMaxSubaccountActions(subaccount) {
  if (subaccount.signedApproval && !getIsEmptySubaccountApproval(subaccount.signedApproval)) {
    return BigInt(subaccount.signedApproval.maxAllowedCount);
  }
  return subaccount.onchainData.maxAllowedCount;
}
function getSubaccountExpiresAt(subaccount) {
  if (subaccount.signedApproval && !getIsEmptySubaccountApproval(subaccount.signedApproval)) {
    return BigInt(subaccount.signedApproval.expiresAt);
  }
  return subaccount.onchainData.expiresAt;
}
function getRemainingSubaccountActions(subaccount) {
  const maxAllowedCount = getMaxSubaccountActions(subaccount);
  const currentActionCount = subaccount.onchainData.currentActionsCount;
  return maxAllowedCount - currentActionCount;
}
function getIsApprovalDeadlineExpired(approval) {
  const now = BigInt(nowInSeconds());
  const deadline = approval.deadline;
  return now >= deadline;
}
function getIsSubaccountActionsExceeded(subaccount, requiredActions) {
  return getRemainingSubaccountActions(subaccount) < bigMath.max(1n, BigInt(requiredActions));
}
function getRemainingSubaccountSeconds(subaccount) {
  const expiresAt = getSubaccountExpiresAt(subaccount);
  const now = BigInt(nowInSeconds());
  return bigMath.max(0n, expiresAt - now);
}
function getIsApprovalExpired(subaccount) {
  const { signedApproval } = subaccount;
  if (getIsEmptySubaccountApproval(signedApproval)) {
    return false;
  }
  const now = BigInt(nowInSeconds());
  const expiresAt = signedApproval.expiresAt;
  const deadline = signedApproval.deadline;
  return now >= expiresAt || now >= deadline;
}
function getIsSubaccountNonceExpired({
  chainId,
  onchainData,
  signedApproval
}) {
  if (getIsEmptySubaccountApproval(signedApproval)) {
    return false;
  }
  if (chainId !== signedApproval.signatureChainId) {
    return false;
  }
  let onChainNonce;
  if (signedApproval.subaccountRouterAddress === getContract(chainId, "SubaccountGelatoRelayRouter")) {
    onChainNonce = onchainData.approvalNonce;
  } else if (signedApproval.subaccountRouterAddress === getContract(chainId, "MultichainSubaccountRouter")) {
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
function getIsSubaccountApprovalInvalid({
  chainId,
  signerChainId,
  signedApproval,
  onchainData,
  subaccountRouterAddress
}) {
  if (getIsEmptySubaccountApproval(signedApproval)) {
    return false;
  }
  const isSignedSubaccountFresh = !onchainData.active;
  let relatedOnchainNonce;
  if (signedApproval.subaccountRouterAddress === getContract(chainId, "MultichainSubaccountRouter")) {
    relatedOnchainNonce = onchainData.multichainApprovalNonce;
  } else if (signedApproval.subaccountRouterAddress === getContract(chainId, "SubaccountGelatoRelayRouter") || !signedApproval.subaccountRouterAddress) {
    relatedOnchainNonce = onchainData.approvalNonce;
  } else {
    return true;
  }
  const isSignedSubaccountPossibleUpdate = signedApproval.nonce === relatedOnchainNonce;
  const result = (isSignedSubaccountFresh || isSignedSubaccountPossibleUpdate) && (signedApproval.signatureChainId !== signerChainId || signedApproval.subaccountRouterAddress !== subaccountRouterAddress);
  return result;
}
function getIsSubaccountExpired(subaccount) {
  const now = BigInt(nowInSeconds());
  const isApprovalExpired = getIsApprovalExpired(subaccount);
  if (isApprovalExpired) {
    return true;
  }
  const expiresAt = getSubaccountExpiresAt(subaccount);
  const isExpired = now >= expiresAt;
  return isExpired;
}
function getIsInvalidSubaccount({
  subaccount,
  requiredActions,
  subaccountRouterAddress
}) {
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
    onchainData: subaccount.onchainData
  });
  return isExpired || isNonceExpired || actionsExceeded || isApprovalInvalid;
}
function getEmptySubaccountApproval(chainId, subaccountAddress) {
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
    signatureChainId: chainId
  };
}
function getIsEmptySubaccountApproval(subaccountApproval) {
  return subaccountApproval.signature === ZERO_DATA && subaccountApproval.nonce === 0n && subaccountApproval.expiresAt === 0n && subaccountApproval.maxAllowedCount === 0n && subaccountApproval.shouldAdd === false && subaccountApproval.integrationId === zeroHash;
}
function hashSubaccountApproval(subaccountApproval) {
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
          { name: "signature", type: "bytes" }
        ]
      }
    ],
    [subaccountApproval]
  );
  return keccak256(encodedData);
}
function getIsSubaccountApprovalSynced(params) {
  const { signedApproval, onchainData } = params;
  if (getIsSubaccountNonceExpired(params)) {
    return true;
  }
  return onchainData.maxAllowedCount === signedApproval.maxAllowedCount && onchainData.expiresAt === signedApproval.expiresAt && onchainData.active === true;
}
async function getSubaccountOnchainData({
  chainId,
  signer,
  publicClient,
  subaccountAddress
}) {
  const account = signer.address;
  const results = await publicClient.multicall({
    contracts: [
      {
        address: getContract(
          chainId,
          "SubaccountGelatoRelayRouter"
        ),
        abi: abis.AbstractSubaccountApprovalNonceable,
        functionName: "subaccountApprovalNonces",
        args: [account]
      },
      {
        address: getContract(
          chainId,
          "MultichainSubaccountRouter"
        ),
        abi: abis.AbstractSubaccountApprovalNonceable,
        functionName: "subaccountApprovalNonces",
        args: [account]
      },
      {
        address: getContract(chainId, "DataStore"),
        abi: abis.DataStore,
        functionName: "containsAddress",
        args: [
          subaccountListKey(account),
          subaccountAddress
        ]
      },
      {
        address: getContract(chainId, "DataStore"),
        abi: abis.DataStore,
        functionName: "getUint",
        args: [
          maxAllowedSubaccountActionCountKey(
            account,
            subaccountAddress,
            SUBACCOUNT_ORDER_ACTION
          )
        ]
      },
      {
        address: getContract(chainId, "DataStore"),
        abi: abis.DataStore,
        functionName: "getUint",
        args: [
          subaccountActionCountKey(
            account,
            subaccountAddress,
            SUBACCOUNT_ORDER_ACTION
          )
        ]
      },
      {
        address: getContract(chainId, "DataStore"),
        abi: abis.DataStore,
        functionName: "getUint",
        args: [
          subaccountExpiresAtKey(
            account,
            subaccountAddress,
            SUBACCOUNT_ORDER_ACTION
          )
        ]
      },
      {
        address: getContract(chainId, "DataStore"),
        abi: abis.DataStore,
        functionName: "getBytes32",
        args: [
          subaccountIntegrationIdKey(
            account,
            subaccountAddress
          )
        ]
      }
    ]
  });
  if (results.some((result) => result.status === "failure")) {
    throw new Error("Multicall failed for subaccount onchain data");
  }
  return {
    approvalNonce: results[0].result,
    multichainApprovalNonce: results[1].result,
    active: results[2].result,
    maxAllowedCount: results[3].result,
    currentActionsCount: results[4].result,
    expiresAt: results[5].result,
    integrationId: results[6].result === zeroHash ? void 0 : results[6].result
  };
}

export { getEmptySubaccountApproval, getIsApprovalDeadlineExpired, getIsApprovalExpired, getIsEmptySubaccountApproval, getIsInvalidSubaccount, getIsSubaccountActionsExceeded, getIsSubaccountApprovalInvalid, getIsSubaccountApprovalSynced, getIsSubaccountExpired, getIsSubaccountNonceExpired, getMaxSubaccountActions, getRemainingSubaccountActions, getRemainingSubaccountSeconds, getSubaccountExpiresAt, getSubaccountOnchainData, getSubaccountValidations, hashSubaccountApproval };
//# sourceMappingURL=utils.js.map
//# sourceMappingURL=utils.js.map