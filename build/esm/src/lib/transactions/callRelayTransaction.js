import { encodePacked } from 'viem';
import { getContract } from '../../configs/contracts.js';
import { GMX_SIMULATION_ORIGIN } from '../../configs/dataStore.js';

async function callRelayTransaction({
  chainId,
  calldata,
  gelatoRelayFeeToken,
  gelatoRelayFeeAmount,
  rpc,
  relayRouterAddress
}) {
  try {
    return await rpc.ethCall({
      to: relayRouterAddress,
      from: GMX_SIMULATION_ORIGIN,
      data: encodePacked(
        ["bytes", "address", "address", "uint256"],
        [
          calldata,
          getContract(chainId, "GelatoRelayAddress"),
          gelatoRelayFeeToken,
          gelatoRelayFeeAmount
        ]
      )
    });
  } catch (ex) {
    if (ex.error) {
      throw ex.error;
    }
    throw ex;
  }
}

export { callRelayTransaction };
//# sourceMappingURL=callRelayTransaction.js.map
//# sourceMappingURL=callRelayTransaction.js.map