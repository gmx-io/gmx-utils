import { BOTANIX } from '../../configs/chains.js';
import { getTokenBySymbol, NATIVE_TOKEN_ADDRESS } from '../../configs/tokens.js';
import { ExternalSwapAggregator } from './types.js';

const BBTC_ADDRESS = NATIVE_TOKEN_ADDRESS;
const PBTC_ADDRESS = getTokenBySymbol(BOTANIX, "PBTC").address;
const STBTC_ADDRESS = getTokenBySymbol(BOTANIX, "STBTC").address;
const AVAILABLE_BOTANIX_DEPOSIT_PAIRS = [
  {
    from: BBTC_ADDRESS,
    to: STBTC_ADDRESS
  },
  {
    from: PBTC_ADDRESS,
    to: STBTC_ADDRESS
  }
];
const AVAILABLE_BOTANIX_WITHDRAW_PAIRS = [
  {
    from: STBTC_ADDRESS,
    to: PBTC_ADDRESS
  }
];
const getBotanixStakingExternalSwapPaths = ({
  fromTokenAddress
}) => {
  return [
    ...AVAILABLE_BOTANIX_DEPOSIT_PAIRS,
    ...AVAILABLE_BOTANIX_WITHDRAW_PAIRS
  ].filter((pair) => pair.from === fromTokenAddress).map((pair) => ({
    aggregator: ExternalSwapAggregator.BotanixStaking,
    inTokenAddress: pair.from,
    outTokenAddress: pair.to
  }));
};
const getAvailableExternalSwapPaths = ({
  chainId,
  fromTokenAddress
}) => {
  if (chainId === BOTANIX) {
    return getBotanixStakingExternalSwapPaths({ fromTokenAddress });
  }
  return [];
};

export { AVAILABLE_BOTANIX_DEPOSIT_PAIRS, AVAILABLE_BOTANIX_WITHDRAW_PAIRS, getAvailableExternalSwapPaths };
//# sourceMappingURL=externalSwapPath.js.map
//# sourceMappingURL=externalSwapPath.js.map