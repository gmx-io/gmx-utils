import { Hex, encodePacked, type Address } from "viem";

import { ContractsChainId } from "configs/chains";
import { getContract } from "configs/contracts";
import { GMX_SIMULATION_ORIGIN } from "configs/dataStore";
import { iRpc } from "lib/rpc/types";

export async function callRelayTransaction({
  chainId,
  calldata,
  gelatoRelayFeeToken,
  gelatoRelayFeeAmount,
  rpc,
  relayRouterAddress,
}: {
  chainId: ContractsChainId;
  calldata: string;
  gelatoRelayFeeToken: string;
  gelatoRelayFeeAmount: bigint;
  rpc: iRpc;
  relayRouterAddress: string;
}) {
  try {
    return await rpc.ethCall({
      to: relayRouterAddress,
      from: GMX_SIMULATION_ORIGIN,
      data: encodePacked(
        ["bytes", "address", "address", "uint256"],
        [
          calldata as Hex,
          getContract(chainId, "GelatoRelayAddress"),
          gelatoRelayFeeToken as Address,
          gelatoRelayFeeAmount,
        ]
      ),
    });
  } catch (ex: any) {
    if (ex.error) {
      // this gives much more readable error in the console with a stacktrace
      throw ex.error;
    }
    throw ex;
  }
}
