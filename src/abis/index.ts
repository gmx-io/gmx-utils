import { erc20Abi } from "viem";

export const ERC20 = erc20Abi;
export { default as ArbitrumNodeInterface } from "./ArbitrumNodeInterface";
export { default as ClaimHandler } from "./ClaimHandler";
export { default as CustomErrors } from "./CustomErrors";
export { default as DataStore } from "./DataStore";
export { default as ERC20PermitInterface } from "./ERC20PermitInterface";
export { default as ERC721 } from "./ERC721";
export { default as EventEmitter } from "./EventEmitter";
export { default as ExchangeRouter } from "./ExchangeRouter";
export { default as GelatoRelayRouter } from "./GelatoRelayRouter";
export { default as GlpManager } from "./GlpManager";
export { default as GlvReader } from "./GlvReader";
export { default as GlvRouter } from "./GlvRouter";
export { default as GmxMigrator } from "./GmxMigrator";
export { default as GovToken } from "./GovToken";
export { default as LayerZeroProvider } from "./LayerZeroProvider";
export { default as MintableBaseToken } from "./MintableBaseToken";
export { default as Multicall } from "./Multicall";
export { default as MultichainClaimsRouter } from "./MultichainClaimsRouter";
export { default as MultichainGlvRouter } from "./MultichainGlvRouter";
export { default as MultichainGmRouter } from "./MultichainGmRouter";
export { default as MultichainOrderRouter } from "./MultichainOrderRouter";
export { default as MultichainSubaccountRouter } from "./MultichainSubaccountRouter";
export { default as MultichainTransferRouter } from "./MultichainTransferRouter";
export { default as MultichainUtils } from "./MultichainUtils";
export { default as MultichainVault } from "./MultichainVault";
export { default as Reader } from "./Reader";
export { default as ReaderV2 } from "./ReaderV2";
export { default as ReferralStorage } from "./ReferralStorage";
export { default as RelayParams } from "./RelayParams";
export { default as RewardReader } from "./RewardReader";
export { default as RewardRouter } from "./RewardRouter";
export { default as RewardTracker } from "./RewardTracker";
export { default as SmartAccount } from "./SmartAccount";
export { default as StBTC } from "./StBTC";
export { default as SubaccountGelatoRelayRouter } from "./SubaccountGelatoRelayRouter";
export { default as SubaccountRouter } from "./SubaccountRouter";
export { default as SyntheticsReader } from "./SyntheticsReader";
export { default as SyntheticsRouter } from "./SyntheticsRouter";
export { default as Timelock } from "./Timelock";
export { default as Token } from "./Token";
export { default as Treasury } from "./Treasury";
export { default as UniPool } from "./UniPool";
export { default as UniswapV2 } from "./UniswapV2";
export { default as UniswapV3Factory } from "./UniswapV3Factory";
export { default as UniswapV3Pool } from "./UniswapV3Pool";
export { default as UniswapV3PositionManager } from "./UniswapV3PositionManager";
export { default as Vault } from "./Vault";
export { default as VaultReader } from "./VaultReader";
export { default as VaultV2 } from "./VaultV2";
export { default as VaultV2b } from "./VaultV2b";
export { default as VenusVToken } from "./VenusVToken";
export { default as Vester } from "./Vester";
export { default as WETH } from "./WETH";
export { default as AbstractSubaccountApprovalNonceable } from "./AbstractSubaccountApprovalNonceable";

import AbstractSubaccountApprovalNonceableAbi from "./AbstractSubaccountApprovalNonceable";
import ArbitrumNodeInterfaceAbi from "./ArbitrumNodeInterface";
import ClaimHandlerAbi from "./ClaimHandler";
import CustomErrorsAbi from "./CustomErrors";
import DataStoreAbi from "./DataStore";
import ERC20PermitInterfaceAbi from "./ERC20PermitInterface";
import ERC721Abi from "./ERC721";
import EventEmitterAbi from "./EventEmitter";
import ExchangeRouterAbi from "./ExchangeRouter";
import GelatoRelayRouterAbi from "./GelatoRelayRouter";
import GlpManagerAbi from "./GlpManager";
import GlvReaderAbi from "./GlvReader";
import GlvRouterAbi from "./GlvRouter";
import GmxMigratorAbi from "./GmxMigrator";
import GovTokenAbi from "./GovToken";
import LayerZeroProviderAbi from "./LayerZeroProvider";
import MintableBaseTokenAbi from "./MintableBaseToken";
import MulticallAbi from "./Multicall";
import MultichainClaimsRouterAbi from "./MultichainClaimsRouter";
import MultichainGlvRouterAbi from "./MultichainGlvRouter";
import MultichainGmRouterAbi from "./MultichainGmRouter";
import MultichainOrderRouterAbi from "./MultichainOrderRouter";
import MultichainSubaccountRouterAbi from "./MultichainSubaccountRouter";
import MultichainTransferRouterAbi from "./MultichainTransferRouter";
import MultichainUtilsAbi from "./MultichainUtils";
import MultichainVaultAbi from "./MultichainVault";
import ReaderAbi from "./Reader";
import ReaderV2Abi from "./ReaderV2";
import ReferralStorageAbi from "./ReferralStorage";
import RelayParamsAbi from "./RelayParams";
import RewardReaderAbi from "./RewardReader";
import RewardRouterAbi from "./RewardRouter";
import RewardTrackerAbi from "./RewardTracker";
import SmartAccountAbi from "./SmartAccount";
import StBTCAbi from "./StBTC";
import SubaccountGelatoRelayRouterAbi from "./SubaccountGelatoRelayRouter";
import SubaccountRouterAbi from "./SubaccountRouter";
import SyntheticsReaderAbi from "./SyntheticsReader";
import SyntheticsRouterAbi from "./SyntheticsRouter";
import TimelockAbi from "./Timelock";
import TokenAbi from "./Token";
import TreasuryAbi from "./Treasury";
import UniPoolAbi from "./UniPool";
import UniswapV2Abi from "./UniswapV2";
import UniswapV3FactoryAbi from "./UniswapV3Factory";
import UniswapV3PoolAbi from "./UniswapV3Pool";
import UniswapV3PositionManagerAbi from "./UniswapV3PositionManager";
import VaultAbi from "./Vault";
import VaultReaderAbi from "./VaultReader";
import VaultV2Abi from "./VaultV2";
import VaultV2bAbi from "./VaultV2b";
import VenusVTokenAbi from "./VenusVToken";
import VesterAbi from "./Vester";
import WETHAbi from "./WETH";

export const abis = {
  ArbitrumNodeInterface: ArbitrumNodeInterfaceAbi,
  ClaimHandler: ClaimHandlerAbi,
  CustomErrors: CustomErrorsAbi,
  DataStore: DataStoreAbi,
  ERC20PermitInterface: ERC20PermitInterfaceAbi,
  ERC721: ERC721Abi,
  EventEmitter: EventEmitterAbi,
  ExchangeRouter: ExchangeRouterAbi,
  GelatoRelayRouter: GelatoRelayRouterAbi,
  GlpManager: GlpManagerAbi,
  GlvReader: GlvReaderAbi,
  GlvRouter: GlvRouterAbi,
  GmxMigrator: GmxMigratorAbi,
  GovToken: GovTokenAbi,
  LayerZeroProvider: LayerZeroProviderAbi,
  MintableBaseToken: MintableBaseTokenAbi,
  Multicall: MulticallAbi,
  MultichainClaimsRouter: MultichainClaimsRouterAbi,
  MultichainGlvRouter: MultichainGlvRouterAbi,
  MultichainGmRouter: MultichainGmRouterAbi,
  MultichainOrderRouter: MultichainOrderRouterAbi,
  MultichainSubaccountRouter: MultichainSubaccountRouterAbi,
  MultichainTransferRouter: MultichainTransferRouterAbi,
  MultichainUtils: MultichainUtilsAbi,
  MultichainVault: MultichainVaultAbi,
  Reader: ReaderAbi,
  ReaderV2: ReaderV2Abi,
  ReferralStorage: ReferralStorageAbi,
  RelayParams: RelayParamsAbi,
  RewardReader: RewardReaderAbi,
  RewardRouter: RewardRouterAbi,
  RewardTracker: RewardTrackerAbi,
  SmartAccount: SmartAccountAbi,
  StBTC: StBTCAbi,
  SubaccountGelatoRelayRouter: SubaccountGelatoRelayRouterAbi,
  SubaccountRouter: SubaccountRouterAbi,
  SyntheticsReader: SyntheticsReaderAbi,
  SyntheticsRouter: SyntheticsRouterAbi,
  Timelock: TimelockAbi,
  Token: TokenAbi,
  Treasury: TreasuryAbi,
  UniPool: UniPoolAbi,
  UniswapV2: UniswapV2Abi,
  UniswapV3Factory: UniswapV3FactoryAbi,
  UniswapV3Pool: UniswapV3PoolAbi,
  UniswapV3PositionManager: UniswapV3PositionManagerAbi,
  Vault: VaultAbi,
  VaultReader: VaultReaderAbi,
  VaultV2: VaultV2Abi,
  VaultV2b: VaultV2bAbi,
  VenusVToken: VenusVTokenAbi,
  Vester: VesterAbi,
  WETH: WETHAbi,
  AbstractSubaccountApprovalNonceable: AbstractSubaccountApprovalNonceableAbi,
} as const;
