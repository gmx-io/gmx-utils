import { zeroAddress, formatUnits, parseUnits } from 'viem';
import { AVALANCHE, ARBITRUM, AVALANCHE_FUJI, BOTANIX, ARBITRUM_SEPOLIA } from './chains.js';
import { getContract as getContract$1 } from './contracts.js';
import queryString from 'query-string';
import { bigMath } from '../bigmath/index.js';

// src/configs/contracts.ts
var CONTRACTS = {
  [ARBITRUM]: {
    // V1
    Vault: "0x489ee077994B6658eAfA855C308275EAd8097C4A",
    VaultReader: "0xfebB9f4CAC4cD523598fE1C5771181440143F24A",
    Reader: "0x2b43c90D1B727cEe1Df34925bcd5Ace52Ec37694",
    GlpManager: "0x3963FfC9dff443c2A94f21b129D429891E32ec18",
    RewardRouter: "0x5E4766F932ce00aA4a1A82d3Da85adf15C5694A1",
    GlpRewardRouter: "0xB95DB5B167D75e6d04227CfFFA61069348d271F5",
    RewardReader: "0x8BFb8e82Ee4569aee78D03235ff465Bd436D40E0",
    GovToken: "0x2A29D3a792000750807cc401806d6fd539928481",
    NATIVE_TOKEN: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    GLP: "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258",
    GMX: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    ES_GMX: "0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA",
    BN_GMX: "0x35247165119B69A40edD5304969560D0ef486921",
    USDG: "0x45096e7aA921f27590f8F19e457794EB09678141",
    ES_GMX_IOU: "0x6260101218eC4cCfFF1b778936C6f2400f95A954",
    StakedGmxTracker: "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
    BonusGmxTracker: "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
    FeeGmxTracker: "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
    StakedGlpTracker: "0x1aDDD80E6039594eE970E5872D247bf0414C8903",
    FeeGlpTracker: "0x4e971a87900b931fF39d1Aad67697F49835400b6",
    ExtendedGmxTracker: "0x0755D33e45eD2B874c9ebF5B279023c8Bd1e5E93",
    StakedGmxDistributor: "0x23208B91A98c7C1CD9FE63085BFf68311494F193",
    StakedGlpDistributor: "0x60519b48ec4183a61ca2B8e37869E675FD203b34",
    GmxVester: "0x199070DDfd1CFb69173aa2F7e20906F26B363004",
    GlpVester: "0xA75287d2f8b217273E7FCD7E86eF07D33972042E",
    AffiliateVester: "0x7c100c0F55A15221A4c1C5a25Db8C98A81df49B2",
    PositionRouter: "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868",
    UniswapGmxEthPool: "0x80A9ae39310abf666A87C743d6ebBD0E8C42158E",
    ReferralStorage: "0xe6fab3f0c7199b0d34d7fbe83394fc0e0d06e99d",
    Timelock: "0xaa50bD556CE0Fe61D4A57718BA43177a3aB6A597",
    // Synthetics
    DataStore: "0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8",
    EventEmitter: "0xC8ee91A54287DB53897056e12D9819156D3822Fb",
    SubaccountRouter: "0xdD00F639725E19a209880A44962Bc93b51B1B161",
    ExchangeRouter: "0x1C3fa76e6E1088bCE750f23a5BFcffa1efEF6A41",
    DepositVault: "0xF89e77e8Dc11691C9e8757e84aaFbCD8A67d7A55",
    WithdrawalVault: "0x0628D46b5D145f183AdB6Ef1f2c97eD1C4701C55",
    OrderVault: "0x31eF83a530Fde1B38EE9A18093A333D8Bbbc40D5",
    ShiftVault: "0xfe99609C4AA83ff6816b64563Bdffd7fa68753Ab",
    SyntheticsReader: "0x470fbC46bcC0f16532691Df360A07d8Bf5ee0789",
    SyntheticsRouter: "0x7452c558d45f8afC8c83dAe62C3f8A5BE19c71f6",
    GlvReader: "0x2C670A23f1E798184647288072e84054938B5497",
    GlvRouter: "0x7EAdEE2ca1b4D06a0d82fDF03D715550c26AA12F",
    GlvVault: "0x393053B58f9678C9c28c2cE941fF6cac49C3F8f9",
    GelatoRelayRouter: "0xa9090E2fd6cD8Ee397cF3106189A7E1CFAE6C59C",
    SubaccountGelatoRelayRouter: "0x517602BaC704B72993997820981603f5E4901273",
    MultichainClaimsRouter: "0x277B4c0e8A76Fa927C9881967a4475Fd6E234e95",
    MultichainGlvRouter: "0xabcBbe23BD8E0dDD344Ff5fd1439b785B828cD2d",
    MultichainGmRouter: "0xC6782854A8639cC3b40f9497797d6B33797CA592",
    MultichainOrderRouter: "0xD38111f8aF1A7Cd809457C8A2303e15aE2170724",
    MultichainSubaccountRouter: "0x70AaAd50d53732b2D5534bb57332D00aE20cAd36",
    MultichainTransferRouter: "0xfaBEb65bB877600be3A2C2a03aA56a95F9f845B9",
    MultichainVault: "0xCeaadFAf6A8C489B250e407987877c5fDfcDBE6E",
    LayerZeroProvider: "0x7129Ea01F0826c705d6F7ab01Cf3C06bb83E9397",
    ChainlinkPriceFeedProvider: "0x38B8dB61b724b51e42A88Cb8eC564CD685a0f53B",
    ClaimHandler: "0x8a83F2a71A53d3860a60C9F2E68AB2C46Ff9624e",
    // External
    ExternalHandler: "0x389CEf541397e872dC04421f166B5Bc2E0b374a5",
    OpenOceanRouter: "0x6352a56caadC4F1E25CD6c75970Fa768A3304e64",
    Multicall: "0xe79118d6D92a4b23369ba356C90b9A7ABf1CB961",
    ArbitrumNodeInterface: "0x00000000000000000000000000000000000000C8",
    LayerZeroEndpoint: "0x1a44076050125825900e736c501f859c50fE728c",
    GelatoRelayAddress: "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
  },
  [AVALANCHE]: {
    // V1
    Vault: "0x9ab2De34A33fB459b538c43f251eB825645e8595",
    VaultReader: "0x66eC8fc33A26feAEAe156afA3Cb46923651F6f0D",
    Reader: "0x2eFEE1950ededC65De687b40Fd30a7B5f4544aBd",
    GlpManager: "0xD152c7F25db7F4B95b7658323c5F33d176818EE4",
    RewardRouter: "0x091eD806490Cc58Fd514441499e58984cCce0630",
    GlpRewardRouter: "0xB70B91CE0771d3f4c81D87660f71Da31d48eB3B3",
    RewardReader: "0x04Fc11Bd28763872d143637a7c768bD96E44c1b6",
    GovToken: "0x0ff183E29f1924ad10475506D7722169010CecCb",
    NATIVE_TOKEN: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    GLP: "0x01234181085565ed162a948b6a5e88758CD7c7b8",
    GMX: "0x62edc0692BD897D2295872a9FFCac5425011c661",
    ES_GMX: "0xFf1489227BbAAC61a9209A08929E4c2a526DdD17",
    BN_GMX: "0x8087a341D32D445d9aC8aCc9c14F5781E04A26d2",
    USDG: "0xc0253c3cC6aa5Ab407b5795a04c28fB063273894",
    ES_GMX_IOU: "0x6260101218eC4cCfFF1b778936C6f2400f95A954",
    // placeholder address
    StakedGmxTracker: "0x2bD10f8E93B3669b6d42E74eEedC65dd1B0a1342",
    BonusGmxTracker: "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
    FeeGmxTracker: "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
    StakedGlpTracker: "0x9e295B5B976a184B14aD8cd72413aD846C299660",
    FeeGlpTracker: "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
    ExtendedGmxTracker: "0xB0D12Bf95CC1341d6C845C978daaf36F70b5910d",
    StakedGmxDistributor: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    StakedGlpDistributor: "0xDd593Cf40734199afc9207eBe9ffF23dA4Bf7720",
    GmxVester: "0x472361d3cA5F49c8E633FB50385BfaD1e018b445",
    GlpVester: "0x62331A7Bd1dfB3A7642B7db50B5509E57CA3154A",
    AffiliateVester: "0x754eC029EF9926184b4CFDeA7756FbBAE7f326f7",
    PositionRouter: "0xffF6D276Bc37c61A23f06410Dce4A400f66420f8",
    TraderJoeGmxAvaxPool: "0x0c91a070f862666bbcce281346be45766d874d98",
    ReferralStorage: "0x827ed045002ecdabeb6e2b0d1604cf5fc3d322f8",
    Timelock: "0x8A68a039D555599Fd745f9343e8dE20C9eaFca75",
    // Synthetics
    DataStore: "0x2F0b22339414ADeD7D5F06f9D604c7fF5b2fe3f6",
    EventEmitter: "0xDb17B211c34240B014ab6d61d4A31FA0C0e20c26",
    SubaccountRouter: "0xf43F559774d2cF7882e6E846fCb87BDe183a6Da7",
    ExchangeRouter: "0x8f550E53DFe96C055D5Bdb267c21F268fCAF63B2",
    DepositVault: "0x90c670825d0C62ede1c5ee9571d6d9a17A722DFF",
    WithdrawalVault: "0xf5F30B10141E1F63FC11eD772931A8294a591996",
    OrderVault: "0xD3D60D22d415aD43b7e64b510D86A30f19B1B12C",
    ShiftVault: "0x7fC46CCb386e9bbBFB49A2639002734C3Ec52b39",
    SyntheticsReader: "0x62Cb8740E6986B29dC671B2EB596676f60590A5B",
    SyntheticsRouter: "0x820F5FfC5b525cD4d88Cd91aCf2c28F16530Cc68",
    GlvReader: "0x5C6905A3002f989E1625910ba1793d40a031f947",
    GlvRouter: "0x7E425c47b2Ff0bE67228c842B9C792D0BCe58ae6",
    GlvVault: "0x527FB0bCfF63C47761039bB386cFE181A92a4701",
    GelatoRelayRouter: "0xEE2d3339CbcE7A42573C96ACc1298A79a5C996Df",
    SubaccountGelatoRelayRouter: "0xfaBEb65bB877600be3A2C2a03aA56a95F9f845B9",
    MultichainClaimsRouter: "0xd10B10b816030347ff4E6767d340371B40b9F03D",
    MultichainGlvRouter: "0xEEE61742bC4cf361c60Cd65826864560Bf2D0bB6",
    MultichainGmRouter: "0xA191Bc0B72332e4c2022dB50a9d619079cc6c4fD",
    MultichainOrderRouter: "0xd099565957046a2d2CF41B0CC9F95e14a8afD13b",
    MultichainSubaccountRouter: "0x5872E84e5ea23292b40183BE86D25fb428621fC1",
    MultichainTransferRouter: "0x5A44a3b026d50EC039582fDb3aFDD88e2092E211",
    MultichainVault: "0x6D5F3c723002847B009D07Fe8e17d6958F153E4e",
    LayerZeroProvider: "0xF85Fd576bBe22Bce785B68922C1c9849d62737c0",
    ChainlinkPriceFeedProvider: "0x05d97cee050bfb81FB3EaD4A9368584F8e72C88e",
    ClaimHandler: "0xefCAdA759241D10B45d9Cb6265B19ADec97ceced",
    // External
    ExternalHandler: "0xD149573a098223a9185433290a5A5CDbFa54a8A9",
    OpenOceanRouter: "0x6352a56caadC4F1E25CD6c75970Fa768A3304e64",
    Multicall: "0x50474CAe810B316c294111807F94F9f48527e7F8",
    ArbitrumNodeInterface: zeroAddress,
    LayerZeroEndpoint: "0x1a44076050125825900e736c501f859c50fE728c",
    GelatoRelayAddress: "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
  },
  [BOTANIX]: {
    // Synthetics
    DataStore: "0xA23B81a89Ab9D7D89fF8fc1b5d8508fB75Cc094d",
    EventEmitter: "0xAf2E131d483cedE068e21a9228aD91E623a989C2",
    SubaccountRouter: "0xa1793126B6Dc2f7F254a6c0E2F8013D2180C0D10",
    ExchangeRouter: "0xBCB5eA3a84886Ce45FBBf09eBF0e883071cB2Dc8",
    DepositVault: "0x4D12C3D3e750e051e87a2F3f7750fBd94767742c",
    WithdrawalVault: "0x46BAeAEdbF90Ce46310173A04942e2B3B781Bf0e",
    OrderVault: "0xe52B3700D17B45dE9de7205DEe4685B4B9EC612D",
    ShiftVault: "0xa7EE2737249e0099906cB079BCEe85f0bbd837d4",
    SyntheticsReader: "0x922766ca6234cD49A483b5ee8D86cA3590D0Fb0E",
    SyntheticsRouter: "0x3d472afcd66F954Fe4909EEcDd5c940e9a99290c",
    GlvReader: "0x955Aa50d2ecCeffa59084BE5e875eb676FfAFa98",
    GlvRouter: "0xC92741F0a0D20A95529873cBB3480b1f8c228d9F",
    GlvVault: "0xd336087512BeF8Df32AF605b492f452Fd6436CD8",
    GelatoRelayRouter: "0x98e86155abf8bCbA566b4a909be8cF4e3F227FAf",
    SubaccountGelatoRelayRouter: "0xd6b16f5ceE328310B1cf6d8C0401C23dCd3c40d4",
    MultichainClaimsRouter: "0x421eB756B8f887f036e7332801288BC2bbA600aC",
    MultichainGlvRouter: "0x9C11DFa4DAFA9227Ef172cc1d87D4D5008804C47",
    MultichainGmRouter: "0x6a960F397eB8F2300F9FfA746F11375A613C5027",
    MultichainOrderRouter: "0xbC074fF8b85f9b66884E1EdDcE3410fde96bd798",
    MultichainSubaccountRouter: "0x8138Ce254Bc0AfE40369FDC2D1e46cE90944406d",
    MultichainTransferRouter: "0x844D38f2c3875b8351feB4764718E1c64bD55c46",
    MultichainVault: "0x9a535f9343434D96c4a39fF1d90cC685A4F6Fb20",
    LayerZeroProvider: "0x9E721ef9b908B4814Aa18502692E4c5666d1942e",
    ChainlinkPriceFeedProvider: "0xDc613305e9267f0770072dEaB8c03162e0554b2d",
    ClaimHandler: "0x162e3a5B47C9a45ff762E5b4b23D048D6780C14e",
    // External
    ExternalHandler: "0x36b906eA6AE7c74aeEE8cDE66D01B3f1f8843872",
    OpenOceanRouter: zeroAddress,
    Multicall: "0x4BaA24f93a657f0c1b4A0Ffc72B91011E35cA46b",
    LayerZeroEndpoint: "0x6F475642a6e85809B1c36Fa62763669b1b48DD5B",
    ArbitrumNodeInterface: zeroAddress,
    GelatoRelayAddress: "0x61aCe8fBA7B80AEf8ED67f37CB60bE00180872aD",
    Vault: zeroAddress,
    Reader: zeroAddress,
    PositionRouter: zeroAddress,
    ReferralStorage: zeroAddress,
    VaultReader: zeroAddress,
    GlpManager: zeroAddress,
    RewardRouter: zeroAddress,
    RewardReader: zeroAddress,
    GlpRewardRouter: zeroAddress,
    StakedGmxTracker: zeroAddress,
    FeeGmxTracker: zeroAddress,
    GLP: zeroAddress,
    GMX: zeroAddress,
    ES_GMX: zeroAddress,
    BN_GMX: zeroAddress,
    USDG: zeroAddress,
    BonusGmxTracker: zeroAddress,
    StakedGlpTracker: zeroAddress,
    FeeGlpTracker: zeroAddress,
    ExtendedGmxTracker: zeroAddress,
    StakedGmxDistributor: zeroAddress,
    StakedGlpDistributor: zeroAddress,
    GmxVester: zeroAddress,
    GlpVester: zeroAddress,
    AffiliateVester: zeroAddress,
    Router: zeroAddress,
    GovToken: zeroAddress,
    ES_GMX_IOU: zeroAddress,
    OrderBook: zeroAddress,
    UniswapGmxEthPool: zeroAddress,
    // botanix specific
    NATIVE_TOKEN: "0x0D2437F93Fed6EA64Ef01cCde385FB1263910C56",
    StBTC: "0xF4586028FFdA7Eca636864F80f8a3f2589E33795",
    PBTC: "0x0D2437F93Fed6EA64Ef01cCde385FB1263910C56"
  },
  [AVALANCHE_FUJI]: {
    // V1
    Vault: zeroAddress,
    Router: zeroAddress,
    VaultReader: zeroAddress,
    Reader: zeroAddress,
    GlpManager: zeroAddress,
    RewardRouter: zeroAddress,
    RewardReader: zeroAddress,
    GlpRewardRouter: zeroAddress,
    NATIVE_TOKEN: "0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3",
    GLP: zeroAddress,
    GMX: zeroAddress,
    ES_GMX: zeroAddress,
    BN_GMX: zeroAddress,
    USDG: zeroAddress,
    ES_GMX_IOU: zeroAddress,
    StakedGmxTracker: zeroAddress,
    BonusGmxTracker: zeroAddress,
    FeeGmxTracker: zeroAddress,
    StakedGlpTracker: zeroAddress,
    FeeGlpTracker: zeroAddress,
    ExtendedGmxTracker: zeroAddress,
    StakedGmxDistributor: zeroAddress,
    StakedGlpDistributor: zeroAddress,
    GmxVester: zeroAddress,
    GlpVester: zeroAddress,
    AffiliateVester: zeroAddress,
    PositionRouter: zeroAddress,
    TraderJoeGmxAvaxPool: zeroAddress,
    ReferralStorage: "0x192e82A18a4ab446dD9968f055431b60640B155D",
    // Synthetics
    DataStore: "0xEA1BFb4Ea9A412dCCd63454AbC127431eBB0F0d4",
    EventEmitter: "0xc67D98AC5803aFD776958622CeEE332A0B2CabB9",
    ExchangeRouter: "0x0a458C96Ac0B2a130DA4BdF1aAdD4cb7Be036d11",
    SubaccountRouter: "0xD5EE3ECAF5754CE5Ff74847d0caf094EBB12ed5e",
    DepositVault: "0x2964d242233036C8BDC1ADC795bB4DeA6fb929f2",
    WithdrawalVault: "0x74d49B6A630Bf519bDb6E4efc4354C420418A6A2",
    OrderVault: "0x25D23e8E655727F2687CC808BB9589525A6F599B",
    ShiftVault: "0x257D0EA0B040E2Cd1D456fB4C66d7814102aD346",
    SyntheticsReader: "0xf82Cc6EB57F8FF86bc5c5e90B8BA83DbBFB517eE",
    SyntheticsRouter: "0x5e7d61e4C52123ADF651961e4833aCc349b61491",
    Timelock: zeroAddress,
    GlvReader: "0xdeaC9ea3c72C102f2a9654b8E1A14Ef86Cdd3146",
    GlvRouter: "0x6B6595389A0196F882C0f66CB1F401f1D24afEdC",
    GlvVault: "0x76f93b5240DF811a3fc32bEDd58daA5784e46C96",
    GelatoRelayRouter: "0xC2917611f422b1624D7316375690B532c149F54b",
    SubaccountGelatoRelayRouter: "0x9022ADce7c964852475aB0de801932BaDEB0C765",
    MultichainClaimsRouter: "0xa080c3E026467E1fa6E76D29A057Bf1261a4ec86",
    MultichainGlvRouter: "0x5060A75868ca21A54C650a70E96fa92405831b15",
    MultichainGmRouter: "0xe32632F65198eF3080ccDe22A6d23819203dBc42",
    MultichainOrderRouter: "0x6169DD9Bc75B1d4B7138109Abe58f5645BA6B8fE",
    MultichainSubaccountRouter: "0xa51181CC37D23d3a4b4B263D2B54e1F34B834432",
    MultichainTransferRouter: "0x0bD6966B894D9704Ce540babcd425C93d2BD549C",
    MultichainVault: "0xFd86A5d9D6dF6f0cB6B0e6A18Bea7CB07Ada4F79",
    LayerZeroProvider: "0xdaa9194bFD143Af71A8d2cFc8F2c0643094a77C5",
    ChainlinkPriceFeedProvider: "0x2e149AbC99cDC98FB0207d6F184DC323CEBB955B",
    ClaimHandler: "0x01D68cf13B8f67b041b8D565931e1370774cCeBd",
    // External
    OpenOceanRouter: zeroAddress,
    ExternalHandler: "0x0d9F90c66C392c4d0e70EE0d399c43729B942512",
    Multicall: "0x966D1F5c54a714C6443205F0Ec49eEF81F10fdfD",
    ArbitrumNodeInterface: zeroAddress,
    LayerZeroEndpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f"
  },
  [ARBITRUM_SEPOLIA]: {
    // Synthetics
    DataStore: "0xCF4c2C4c53157BcC01A596e3788fFF69cBBCD201",
    EventEmitter: "0xa973c2692C1556E1a3d478e745e9a75624AEDc73",
    ExchangeRouter: "0xEd50B2A1eF0C35DAaF08Da6486971180237909c3",
    SubaccountRouter: "0xCF45A7E8bB46738f454eC6766631E5612DA90836",
    DepositVault: "0x809Ea82C394beB993c2b6B0d73b8FD07ab92DE5A",
    WithdrawalVault: "0x7601c9dBbDCf1f5ED1E7Adba4EFd9f2cADa037A5",
    OrderVault: "0x1b8AC606de71686fd2a1AEDEcb6E0EFba28909a2",
    ShiftVault: "0x6b6F9B7B9a6b69942DAE74FB95E694ec277117af",
    SyntheticsReader: "0x4750376b9378294138Cf7B7D69a2d243f4940f71",
    SyntheticsRouter: "0x72F13a44C8ba16a678CAD549F17bc9e06d2B8bD2",
    GlvReader: "0x9B7D08AB020D9c180E4bAc370fB545317124Cf22",
    GlvRouter: "0x21b044Bb4a2Ba667723aA3d15ba7b4bCc628084D",
    GlvVault: "0x40bD50de0977c68ecB958ED4A065E14E1091ce64",
    GelatoRelayRouter: "0xD2f52a70224d3453ea17944ABC12772793987FA6",
    SubaccountGelatoRelayRouter: "0x43947140EEE26b82155baA18FDB746A05C700DCE",
    MultichainClaimsRouter: "0x0896f77B7dcE6923c58Ab1a1A91fFF617606E30b",
    MultichainGlvRouter: "0x10f3D7c30cabe91Cdd2785E5af37374842a1089C",
    MultichainGmRouter: "0x94dB1F9CAa86E86cD90F231411D31E5a3815bced",
    MultichainOrderRouter: "0xc9670CCD86d150C91f1f154813786f1Ec809Ae08",
    MultichainSubaccountRouter: "0x2E883D945AB36DC8491693c8870648a232b540a1",
    MultichainTransferRouter: "0xEaba39494d17e722f2Ef49929656b82d561b4460",
    MultichainVault: "0xCd46EF5ed7d08B345c47b5a193A719861Aa2CD91",
    LayerZeroProvider: "0x2E3d6B4c471C50983F21b54d3Ed8e3dAC7dAFF2e",
    ChainlinkPriceFeedProvider: "0xa76BF7f977E80ac0bff49BDC98a27b7b070a937d",
    ReferralStorage: "0xBbCdA58c228Bb29B5769778181c81Ac8aC546c11",
    ClaimHandler: "0xdB980712cCB142A11296c1b9cf70C24E1e90002A",
    // External
    Multicall: "0xD84793ae65842fFac5C20Ab8eaBD699ea1FC79F3",
    NATIVE_TOKEN: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
    LayerZeroEndpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f",
    ArbitrumNodeInterface: "0x00000000000000000000000000000000000000C8",
    GelatoRelayAddress: "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92",
    ExternalHandler: zeroAddress,
    GLP: zeroAddress,
    GMX: zeroAddress,
    ES_GMX: zeroAddress,
    BN_GMX: zeroAddress,
    USDG: zeroAddress,
    ES_GMX_IOU: zeroAddress,
    OpenOceanRouter: zeroAddress,
    Vault: zeroAddress,
    PositionRouter: zeroAddress,
    RewardRouter: zeroAddress,
    StakedGmxTracker: zeroAddress,
    BonusGmxTracker: zeroAddress,
    FeeGmxTracker: zeroAddress,
    StakedGlpTracker: zeroAddress,
    FeeGlpTracker: zeroAddress,
    ExtendedGmxTracker: zeroAddress,
    StakedGmxDistributor: zeroAddress,
    StakedGlpDistributor: zeroAddress,
    GmxVester: zeroAddress,
    GlpVester: zeroAddress,
    AffiliateVester: zeroAddress,
    Router: zeroAddress,
    VaultReader: zeroAddress,
    Reader: zeroAddress,
    GlpManager: zeroAddress,
    RewardReader: zeroAddress,
    GlpRewardRouter: zeroAddress,
    Timelock: zeroAddress
  }
};
function getContract(chainId, name) {
  if (!CONTRACTS[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  if (!CONTRACTS[chainId][name]) {
    throw new Error(`Unknown contract "${name}" for chainId ${chainId}`);
  }
  return CONTRACTS[chainId][name];
}
var NATIVE_TOKEN_ADDRESS = zeroAddress;
var TOKENS = {
  [ARBITRUM]: [
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: zeroAddress,
      isNative: true,
      isShortable: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
      isV1Available: true
    },
    {
      name: "Wrapped Ethereum",
      symbol: "WETH",
      decimals: 18,
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      isWrapped: true,
      baseSymbol: "ETH",
      imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
      isV1Available: true,
      isPermitSupported: true,
      contractVersion: "1"
    },
    {
      name: "Wrapped Bitcoin",
      symbol: "BTC",
      assetSymbol: "WBTC",
      baseSymbol: "BTC",
      decimals: 8,
      address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
      isShortable: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
      coingeckoUrl: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      explorerUrl: "https://arbiscan.io/address/0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
      isV1Available: true,
      isPermitSupported: true,
      contractVersion: "1"
    },
    {
      name: "Arbitrum",
      symbol: "ARB",
      decimals: 18,
      priceDecimals: 5,
      address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
      categories: ["layer2", "defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg?1680097630",
      coingeckoUrl: "https://www.coingecko.com/en/coins/arbitrum",
      explorerUrl: "https://arbiscan.io/token/0x912ce59144191c1204e64559fe8253a0e49e6548",
      isPermitSupported: true,
      contractVersion: "1"
    },
    {
      name: "Wrapped SOL (Wormhole)",
      symbol: "SOL",
      assetSymbol: "WSOL (Wormhole)",
      priceDecimals: 3,
      decimals: 9,
      address: "0x2bcC6D6CdBbDC0a4071e48bb3B969b06B3330c07",
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422",
      coingeckoUrl: "https://www.coingecko.com/en/coins/solana",
      coingeckoSymbol: "SOL",
      explorerUrl: "https://arbiscan.io/token/0x2bCc6D6CdBbDC0a4071e48bb3B969b06B3330c07",
      explorerSymbol: "SOL",
      isPermitSupported: true,
      isPermitDisabled: true,
      contractVersion: "1"
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      decimals: 18,
      priceDecimals: 4,
      address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
      isStable: false,
      isShortable: true,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700",
      coingeckoUrl: "https://www.coingecko.com/en/coins/chainlink",
      explorerUrl: "https://arbiscan.io/token/0xf97f4df75117a78c1a5a0dbb814af92458539fb4",
      isV1Available: true,
      isPermitSupported: true,
      contractVersion: "1"
    },
    {
      name: "Uniswap",
      symbol: "UNI",
      decimals: 18,
      priceDecimals: 4,
      address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
      isStable: false,
      isShortable: true,
      categories: ["layer2", "defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png?1600306604",
      coingeckoUrl: "https://www.coingecko.com/en/coins/uniswap",
      explorerUrl: "https://arbiscan.io/token/0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0",
      isV1Available: true,
      isPermitSupported: true,
      contractVersion: "1"
    },
    {
      name: "Bridged USDC (USDC.e)",
      symbol: "USDC.E",
      decimals: 6,
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bridged-usdc-arbitrum",
      explorerUrl: "https://arbiscan.io/token/0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      isV1Available: true,
      isPermitSupported: true,
      contractVersion: "1"
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      isStable: true,
      isV1Available: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
      explorerUrl: "https://arbiscan.io/address/0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      isPermitSupported: true
    },
    {
      name: "Tether",
      symbol: "USDT",
      decimals: 6,
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707",
      explorerUrl: "https://arbiscan.io/address/0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      coingeckoUrl: "https://www.coingecko.com/en/coins/tether",
      isV1Available: true,
      isPermitSupported: true,
      contractVersion: "1"
    },
    {
      name: "Dai",
      symbol: "DAI",
      decimals: 18,
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dai",
      explorerUrl: "https://arbiscan.io/token/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      isV1Available: true,
      isPermitSupported: true
    },
    {
      name: "Frax",
      symbol: "FRAX",
      decimals: 18,
      address: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/13422/small/frax_logo.png?1608476506",
      coingeckoUrl: "https://www.coingecko.com/en/coins/frax",
      explorerUrl: "https://arbiscan.io/token/0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
      isV1Available: true,
      isPermitSupported: true,
      contractVersion: "1"
    },
    {
      name: "Magic Internet Money",
      symbol: "MIM",
      decimals: 18,
      address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      isStable: true,
      isTempHidden: true,
      imageUrl: "https://assets.coingecko.com/coins/images/16786/small/mimlogopng.png",
      isV1Available: true,
      isPermitSupported: true
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      address: "0x47904963fc8b2340414262125aF798B9655E58Cd",
      isSynthetic: true,
      decimals: 8,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bitcoin",
      isPermitSupported: false,
      isPermitDisabled: true
    },
    {
      name: "Dogecoin",
      symbol: "DOGE",
      decimals: 8,
      priceDecimals: 5,
      address: "0xC4da4c24fd591125c3F47b340b6f4f76111883d8",
      isSynthetic: true,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png?1547792256",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dogecoin"
    },
    {
      name: "Litecoin",
      symbol: "LTC",
      decimals: 8,
      priceDecimals: 3,
      address: "0xB46A094Bc4B0adBD801E14b9DB95e05E28962764",
      isSynthetic: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/2/small/litecoin.png?1547033580",
      coingeckoUrl: "https://www.coingecko.com/en/coins/litecoin"
    },
    {
      name: "XRP",
      symbol: "XRP",
      decimals: 6,
      priceDecimals: 4,
      address: "0xc14e065b0067dE91534e032868f5Ac6ecf2c6868",
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png?1605778731",
      coingeckoUrl: "https://www.coingecko.com/en/coins/xrp",
      isSynthetic: true
    },
    {
      name: "GMX",
      symbol: "GMX",
      address: getContract$1(ARBITRUM, "GMX"),
      decimals: 18,
      isPlatformToken: true,
      isPlatformTradingToken: true,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
      coingeckoUrl: "https://www.coingecko.com/en/coins/gmx",
      explorerUrl: "https://arbiscan.io/address/0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a"
    },
    {
      name: "Escrowed GMX",
      symbol: "ESGMX",
      address: getContract$1(ARBITRUM, "ES_GMX"),
      decimals: 18,
      isPlatformToken: true
    },
    {
      name: "Wrapped BNB (LayerZero)",
      symbol: "BNB",
      assetSymbol: "WBNB (LayerZero)",
      address: "0xa9004A5421372E1D83fB1f85b0fc986c912f91f3",
      decimals: 18,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bnb",
      coingeckoSymbol: "BNB",
      metamaskSymbol: "WBNB",
      explorerUrl: "https://arbiscan.io/token/0xa9004A5421372E1D83fB1f85b0fc986c912f91f3",
      explorerSymbol: "WBNB"
    },
    {
      name: "Cosmos",
      symbol: "ATOM",
      assetSymbol: "ATOM",
      priceDecimals: 4,
      address: "0x7D7F1765aCbaF847b9A1f7137FE8Ed4931FbfEbA",
      decimals: 6,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/1481/standard/cosmos_hub.png?1696502525",
      coingeckoUrl: "https://www.coingecko.com/en/coins/cosmos-hub",
      coingeckoSymbol: "ATOM",
      isSynthetic: true
    },
    {
      name: "Near",
      symbol: "NEAR",
      assetSymbol: "NEAR",
      priceDecimals: 4,
      address: "0x1FF7F3EFBb9481Cbd7db4F932cBCD4467144237C",
      decimals: 24,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/10365/standard/near.jpg?1696510367",
      coingeckoUrl: "https://www.coingecko.com/en/coins/near",
      coingeckoSymbol: "NEAR",
      isSynthetic: true
    },
    {
      name: "Aave",
      symbol: "AAVE",
      assetSymbol: "AAVE",
      priceDecimals: 3,
      address: "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
      decimals: 18,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/12645/standard/AAVE.png?1696512452",
      coingeckoUrl: "https://www.coingecko.com/en/coins/aave",
      coingeckoSymbol: "AAVE",
      isPermitSupported: true,
      contractVersion: "1"
    },
    {
      name: "Wrapped AVAX (Wormhole)",
      symbol: "AVAX",
      assetSymbol: "WAVAX (Wormhole)",
      priceDecimals: 4,
      address: "0x565609fAF65B92F7be02468acF86f8979423e514",
      decimals: 18,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
      coingeckoUrl: "https://www.coingecko.com/en/coins/avalanche",
      coingeckoSymbol: "AVAX",
      explorerSymbol: "WAVAX",
      isPermitSupported: true,
      isPermitDisabled: true,
      contractVersion: "1"
    },
    {
      name: "Optimism",
      symbol: "OP",
      priceDecimals: 4,
      address: "0xaC800FD6159c2a2CB8fC31EF74621eB430287a5A",
      decimals: 18,
      categories: ["layer2"],
      imageUrl: "https://assets.coingecko.com/coins/images/25244/standard/Optimism.png?1696524385",
      coingeckoUrl: "https://www.coingecko.com/en/coins/optimism"
    },
    {
      name: "Pepe",
      symbol: "PEPE",
      address: "0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00",
      decimals: 18,
      priceDecimals: 8,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/29850/standard/pepe-token.jpeg?1696528776",
      coingeckoUrl: "https://www.coingecko.com/en/coins/pepe",
      visualMultiplier: 1e3,
      visualPrefix: "k"
    },
    {
      name: "dogwifhat",
      symbol: "WIF",
      address: "0xA1b91fe9FD52141Ff8cac388Ce3F10BFDc1dE79d",
      decimals: 6,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/33566/standard/dogwifhat.jpg?1702499428",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dogwifhat",
      isPermitSupported: true,
      isPermitDisabled: true,
      contractVersion: "1"
    },
    {
      name: "ORDI",
      symbol: "ORDI",
      address: "0x1E15d08f3CA46853B692EE28AE9C7a0b88a9c994",
      decimals: 18,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/30162/standard/ordi.png?1696529082",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ordi",
      isSynthetic: true
    },
    {
      name: "Stacks",
      symbol: "STX",
      address: "0xBaf07cF91D413C0aCB2b7444B9Bf13b4e03c9D71",
      decimals: 6,
      categories: ["layer2"],
      imageUrl: "https://assets.coingecko.com/coins/images/2069/standard/Stacks_Logo_png.png?1709979332",
      coingeckoUrl: "https://www.coingecko.com/en/coins/stacks",
      isSynthetic: true
    },
    {
      name: "Ethena USDe",
      symbol: "USDE",
      address: "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
      decimals: 18,
      imageUrl: "https://assets.coingecko.com/coins/images/33613/standard/USDE.png?1716355685",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ethena-usde",
      isStable: true
    },
    {
      name: "Wrapped stETH",
      symbol: "WSTETH",
      address: "0x5979D7b546E38E414F7E9822514be443A4800529",
      decimals: 18,
      imageUrl: "https://assets.coingecko.com/coins/images/18834/standard/wstETH.png?1696518295",
      coingeckoUrl: "https://www.coingecko.com/en/coins/wrapped-steth"
    },
    {
      name: "Shiba Inu",
      symbol: "SHIB",
      assetSymbol: "SHIB",
      address: "0x3E57D02f9d196873e55727382974b02EdebE6bfd",
      decimals: 18,
      priceDecimals: 9,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/11939/standard/shiba.png?1696511800",
      coingeckoUrl: "https://www.coingecko.com/en/coins/shiba-inu",
      isSynthetic: true,
      visualMultiplier: 1e3,
      visualPrefix: "k"
    },
    {
      name: "tBTC",
      symbol: "TBTC",
      address: "0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40",
      decimals: 18,
      imageUrl: "https://assets.coingecko.com/coins/images/11224/standard/0x18084fba666a33d37592fa2633fd49a74dd93a88.png?1696511155",
      coingeckoUrl: "https://www.coingecko.com/en/coins/tbtc",
      isPermitSupported: false,
      contractVersion: "1"
    },
    {
      name: "Eigen",
      symbol: "EIGEN",
      address: "0x606C3e5075e5555e79Aa15F1E9FACB776F96C248",
      decimals: 18,
      categories: ["layer2"],
      imageUrl: "https://assets.coingecko.com/coins/images/37441/standard/eigen.jpg?1728023974",
      coingeckoUrl: "https://www.coingecko.com/en/coins/eigenlayer",
      isPermitSupported: false,
      contractVersion: "1"
    },
    {
      name: "Sats",
      symbol: "SATS",
      address: "0x2cD2eB61D17b78239Fcd19aafF72981B5D5eF319",
      decimals: 6,
      priceDecimals: 11,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/30666/standard/_dD8qr3M_400x400.png?1702913020",
      coingeckoUrl: "https://www.coingecko.com/en/coins/sats-ordinals",
      isSynthetic: true,
      visualMultiplier: 1e6,
      visualPrefix: "m"
    },
    {
      name: "Polygon",
      symbol: "POL",
      decimals: 18,
      priceDecimals: 5,
      address: "0x9c74772b713a1B032aEB173E28683D937E51921c",
      categories: ["layer1", "layer2"],
      imageUrl: "https://assets.coingecko.com/coins/images/32440/standard/polygon.png?1698233684",
      coingeckoUrl: "https://www.coingecko.com/en/coins/polygon",
      isSynthetic: true
    },
    {
      name: "APE",
      symbol: "APE",
      address: "0x7f9FBf9bDd3F4105C478b996B648FE6e828a1e98",
      decimals: 18,
      priceDecimals: 4,
      imageUrl: "https://assets.coingecko.com/coins/images/24383/standard/apecoin.jpg?1696523566",
      coingeckoUrl: "https://www.coingecko.com/en/coins/apecoin"
    },
    {
      name: "SUI",
      symbol: "SUI",
      address: "0x197aa2DE1313c7AD50184234490E12409B2a1f95",
      decimals: 9,
      priceDecimals: 4,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/26375/standard/sui-ocean-square.png?1727791290",
      coingeckoUrl: "https://www.coingecko.com/en/coins/sui",
      isSynthetic: true
    },
    {
      name: "SEI",
      symbol: "SEI",
      address: "0x55e85A147a1029b985384822c0B2262dF8023452",
      decimals: 18,
      priceDecimals: 5,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/28205/standard/Sei_Logo_-_Transparent.png?1696527207",
      coingeckoUrl: "https://www.coingecko.com/en/coins/sei",
      isSynthetic: true
    },
    {
      name: "APT",
      symbol: "APT",
      address: "0x3f8f0dCE4dCE4d0D1d0871941e79CDA82cA50d0B",
      decimals: 8,
      priceDecimals: 4,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/26455/standard/aptos_round.png?1696525528",
      coingeckoUrl: "https://www.coingecko.com/en/coins/aptos",
      isSynthetic: true
    },
    {
      name: "TIA",
      symbol: "TIA",
      address: "0x38676f62d166f5CE7De8433F51c6B3D6D9d66C19",
      decimals: 6,
      priceDecimals: 4,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/31967/standard/tia.jpg?1696530772",
      coingeckoUrl: "https://www.coingecko.com/en/coins/celestia",
      isSynthetic: true
    },
    {
      name: "TRON",
      symbol: "TRX",
      address: "0xb06aa7E4af937C130dDade66f6ed7642716fe07A",
      decimals: 6,
      priceDecimals: 5,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png?1696502193",
      coingeckoUrl: "https://www.coingecko.com/en/coins/tron",
      isSynthetic: true
    },
    {
      name: "TON",
      symbol: "TON",
      address: "0xB2f7cefaeEb08Aa347705ac829a7b8bE2FB560f3",
      decimals: 9,
      priceDecimals: 4,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/17980/standard/photo_2024-09-10_17.09.00.jpeg?1725963446",
      coingeckoUrl: "https://www.coingecko.com/en/coins/toncoin",
      isSynthetic: true
    },
    {
      name: "WLD",
      symbol: "WLD",
      address: "0x75B9AdD873641b253718810E6c65dB6d72311FD0",
      decimals: 18,
      priceDecimals: 4,
      imageUrl: "https://assets.coingecko.com/coins/images/31069/standard/worldcoin.jpeg?1696529903",
      coingeckoUrl: "https://www.coingecko.com/en/coins/worldcoin",
      isSynthetic: true
    },
    {
      name: "BONK",
      symbol: "BONK",
      address: "0x1FD10E767187A92f0AB2ABDEEF4505e319cA06B2",
      decimals: 5,
      priceDecimals: 9,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/28600/standard/bonk.jpg?1696527587",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bonk",
      isSynthetic: true,
      visualMultiplier: 1e3,
      visualPrefix: "k"
    },
    {
      name: "TAO",
      symbol: "TAO",
      address: "0x938aef36CAaFbcB37815251B602168087eC14648",
      decimals: 9,
      priceDecimals: 3,
      imageUrl: "https://assets.coingecko.com/coins/images/28452/standard/ARUsPeNQ_400x400.jpeg?1696527447",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bittensor",
      isSynthetic: true
    },
    {
      name: "BOME",
      symbol: "BOME",
      address: "0x3Eea56A1ccCdbfB70A26aD381C71Ee17E4c8A15F",
      decimals: 6,
      priceDecimals: 6,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/36071/standard/bome.png?1710407255",
      coingeckoUrl: "https://www.coingecko.com/en/coins/book-of-meme",
      isSynthetic: true
    },
    {
      name: "FLOKI",
      symbol: "FLOKI",
      address: "0x6792c5B8962ffbDD020c6b6FD0Be7b182e0e33a3",
      decimals: 9,
      priceDecimals: 8,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/16746/standard/PNG_image.png?1696516318",
      coingeckoUrl: "https://www.coingecko.com/en/coins/floki",
      isSynthetic: true,
      visualMultiplier: 1e3,
      visualPrefix: "k"
    },
    {
      name: "MEME",
      symbol: "MEME",
      address: "0xaF770F03518686a365300ab35AD860e99967B2f0",
      decimals: 18,
      priceDecimals: 6,
      imageUrl: "https://assets.coingecko.com/coins/images/32528/standard/memecoin_%282%29.png?1698912168",
      coingeckoUrl: "https://www.coingecko.com/en/coins/meme",
      isSynthetic: true
    },
    {
      name: "MEW",
      symbol: "MEW",
      address: "0x5503CF72f54b6d692d36BBCD391516A7dE068687",
      decimals: 5,
      priceDecimals: 7,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/36440/standard/MEW.png?1711442286",
      coingeckoUrl: "https://www.coingecko.com/en/coins/mew",
      isSynthetic: true
    },
    {
      name: "PENDLE",
      symbol: "PENDLE",
      address: "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8",
      decimals: 18,
      priceDecimals: 4,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/15069/standard/Pendle_Logo_Normal-03.png?1696514728",
      coingeckoUrl: "https://www.coingecko.com/en/coins/pendle",
      isPermitSupported: true,
      isPermitDisabled: true,
      contractVersion: "1"
    },
    {
      name: "ADA",
      symbol: "ADA",
      address: "0x53186c8419BEB83fE4Da74F7875041a1287337ED",
      decimals: 6,
      priceDecimals: 4,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/975/standard/cardano.png?1696502090",
      coingeckoUrl: "https://www.coingecko.com/en/coins/cardano",
      isSynthetic: true
    },
    {
      name: "BCH",
      symbol: "BCH",
      address: "0xc33D9C096e74aa4f571E9417b69a19C4A1e72ef2",
      decimals: 8,
      priceDecimals: 3,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/780/standard/bitcoin-cash-circle.png?1696501932",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bitcoin-cash",
      isSynthetic: true
    },
    {
      name: "DOT",
      symbol: "DOT",
      address: "0xE958f107b467d5172573F761d26931D658C1b436",
      decimals: 10,
      priceDecimals: 4,
      categories: ["layer1"],
      imageUrl: "https://static.coingecko.com/s/polkadot-73b0c058cae10a2f076a82dcade5cbe38601fad05d5e6211188f09eb96fa4617.gif",
      coingeckoUrl: "https://www.coingecko.com/en/coins/polkadot",
      isSynthetic: true
    },
    {
      name: "ICP",
      symbol: "ICP",
      address: "0xdaf0A71608938F762e37eC5F72F670Cc44703454",
      decimals: 8,
      priceDecimals: 4,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/14495/standard/Internet_Computer_logo.png?1696514180",
      coingeckoUrl: "https://www.coingecko.com/en/coins/internet-computer",
      isSynthetic: true
    },
    {
      name: "XLM",
      symbol: "XLM",
      address: "0xc5dbD52Ae5a927Cf585B884011d0C7631C9974c6",
      decimals: 7,
      priceDecimals: 5,
      imageUrl: "https://assets.coingecko.com/coins/images/100/standard/Stellar_symbol_black_RGB.png?1696501482",
      coingeckoUrl: "https://www.coingecko.com/en/coins/stellar",
      isSynthetic: true
    },
    {
      name: "RENDER",
      symbol: "RENDER",
      address: "0x82BB89fcc64c5d4016C5Ed1AB016bB0D1C20D6C3",
      decimals: 18,
      priceDecimals: 4,
      imageUrl: "https://assets.coingecko.com/coins/images/11636/standard/rndr.png?1696511529",
      coingeckoUrl: "https://www.coingecko.com/en/coins/render",
      isSynthetic: true
    },
    {
      name: "Filecoin",
      symbol: "FIL",
      address: "0x3AeBb98f57081DcBEb0B8EA823Cf84900A31e5D8",
      decimals: 18,
      categories: ["layer1"],
      priceDecimals: 4,
      imageUrl: "https://assets.coingecko.com/coins/images/12817/standard/filecoin.png?1696512609",
      coingeckoUrl: "https://www.coingecko.com/en/coins/filecoin",
      isSynthetic: true
    },
    {
      name: "dYdX",
      symbol: "DYDX",
      address: "0x0739Ad7AeA69aD36EdEb91b0e55cAC140427c632",
      decimals: 18,
      priceDecimals: 4,
      categories: ["layer1", "defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/32594/standard/dydx.png?1698673495",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dydx-chain",
      isSynthetic: true
    },
    {
      name: "Injective",
      symbol: "INJ",
      address: "0xfdE73EddbE6c5712A12B72c470F8FE5c77A7fF17",
      decimals: 18,
      priceDecimals: 4,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/12882/standard/Secondary_Symbol.png?1696512670",
      coingeckoUrl: "https://www.coingecko.com/en/coins/injective",
      isSynthetic: true
    },
    {
      name: "Official Trump",
      symbol: "TRUMP",
      address: "0x30021aFA4767Ad66aA52A06dF8a5AB3acA9371fD",
      decimals: 6,
      priceDecimals: 4,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/53746/standard/trump.png?1737171561",
      coingeckoUrl: "https://www.coingecko.com/en/coins/official-trump",
      isSynthetic: true
    },
    {
      name: "Melania Meme",
      symbol: "MELANIA",
      address: "0xfa4F8E582214eBCe1A08eB2a65e08082053E441F",
      decimals: 6,
      priceDecimals: 4,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/53775/standard/melania-meme.png?1737329885",
      coingeckoUrl: "https://www.coingecko.com/en/coins/melania-meme",
      isSynthetic: true
    },
    {
      name: "Ethena Governance Token",
      symbol: "ENA",
      address: "0xfe1Aac2CD9C5cC77b58EeCfE75981866ed0c8b7a",
      decimals: 18,
      priceDecimals: 4,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/36530/standard/ethena.png?1711701436",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ethena",
      isSynthetic: true
    },
    {
      name: "ai16z",
      symbol: "AI16Z",
      address: "0xBb69bd9dc152C2c0F083507641a46193d2B61EBb",
      decimals: 9,
      priceDecimals: 5,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/51090/standard/AI16Z.jpg?1730027175",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ai16z",
      isSynthetic: true
    },
    {
      name: "Animecoin",
      symbol: "ANIME",
      address: "0x37a645648dF29205C6261289983FB04ECD70b4B3",
      decimals: 18,
      priceDecimals: 6,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/53575/standard/anime.jpg?1736748703",
      coingeckoUrl: "https://www.coingecko.com/en/coins/anime",
      isSynthetic: false
    },
    {
      name: "Fartcoin",
      symbol: "FARTCOIN",
      address: "0xaca341E61aB6177B0b0Df46a612e4311F8a7605f",
      decimals: 6,
      priceDecimals: 4,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/50891/standard/fart.jpg?1729503972",
      coingeckoUrl: "https://www.coingecko.com/en/coins/fartcoin",
      isSynthetic: true
    },
    {
      name: "Berachain",
      symbol: "BERA",
      address: "0x67ADABbAd211eA9b3B4E2fd0FD165E593De1e983",
      decimals: 18,
      priceDecimals: 4,
      categories: ["layer1", "defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/25235/standard/BERA.png?1738822008",
      coingeckoUrl: "https://www.coingecko.com/en/coins/berachain",
      isSynthetic: true
    },
    {
      name: "Lido DAO",
      symbol: "LDO",
      address: "0x9D678B4Dd38a6E01df8090aEB7974aD71142b05f",
      decimals: 18,
      priceDecimals: 4,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/13573/standard/Lido_DAO.png?1696513326",
      coingeckoUrl: "https://www.coingecko.com/en/coins/lido-dao",
      isSynthetic: true
    },
    {
      name: "Virtuals Protocol",
      symbol: "VIRTUAL",
      address: "0xB6672496214C90134A9223894e709F26A5eED362",
      decimals: 18,
      priceDecimals: 4,
      imageUrl: "https://assets.coingecko.com/coins/images/34057/standard/LOGOMARK.png?1708356054",
      coingeckoUrl: "https://www.coingecko.com/en/coins/virtual-protocol",
      isSynthetic: true
    },
    {
      name: "Pudgy Penguins",
      symbol: "PENGU",
      address: "0x4C1dac9b6eAf122Fe3DE824c1C2220413F3aC197",
      decimals: 6,
      priceDecimals: 7,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/52622/standard/PUDGY_PENGUINS_PENGU_PFP.png?1733809110",
      coingeckoUrl: "https://www.coingecko.com/en/coins/pudgy-penguins",
      isSynthetic: true
    },
    {
      name: "Artificial Superintelligence Alliance",
      symbol: "FET",
      address: "0x83D5944E7f5EF1d8432002d3cb062e1012f6F8e6",
      decimals: 18,
      priceDecimals: 5,
      imageUrl: "https://assets.coingecko.com/coins/images/5681/standard/ASI.png?1719827289",
      coingeckoUrl: "https://www.coingecko.com/en/coins/artificial-superintelligence-alliance",
      isSynthetic: true
    },
    {
      name: "Ondo",
      symbol: "ONDO",
      address: "0xEcFB4718aD19b626A77491895a2f99ea0cedEd08",
      decimals: 18,
      priceDecimals: 4,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/26580/standard/ONDO.png?1696525656",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ondo",
      isSynthetic: true
    },
    {
      name: "AIXBT",
      symbol: "AIXBT",
      address: "0xcA543Cb8bCC76e4E0A034F56EB40a1029bDFd70E",
      decimals: 18,
      priceDecimals: 4,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/51784/standard/3.png?1731981138",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ondo",
      isSynthetic: true
    },
    {
      name: "Sonic",
      symbol: "S",
      address: "0x8F6cCb99d4Fd0B4095915147b5ae3bbDb8075394",
      decimals: 18,
      priceDecimals: 5,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/38108/standard/200x200_Sonic_Logo.png?1734679256",
      coingeckoUrl: "https://www.coingecko.com/en/coins/sonic",
      isSynthetic: true
    },
    {
      name: "pancakeswap",
      symbol: "CAKE",
      address: "0x580b373Ac16803BB0133356F470f3c7EEF54151B",
      decimals: 18,
      priceDecimals: 5,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/12632/standard/pancakeswap-cake-logo_%281%29.png?1696512440",
      coingeckoUrl: "https://www.coingecko.com/en/coins/pancakeswap",
      isSynthetic: true
    },
    {
      name: "Hyperliquid",
      symbol: "HYPE",
      address: "0xfDFA0A749dA3bCcee20aE0B4AD50E39B26F58f7C",
      decimals: 8,
      priceDecimals: 4,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/50882/standard/hyperliquid.jpg?1729431300",
      coingeckoUrl: "https://www.coingecko.com/en/coins/hyperliquid",
      isSynthetic: true
    },
    {
      name: "Jupiter",
      symbol: "JUP",
      address: "0xfEd500Df379427Fbc48BDaf3b511b519c7eCCD26",
      decimals: 6,
      priceDecimals: 5,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/34188/standard/jup.png?1704266489",
      coingeckoUrl: "https://www.coingecko.com/en/coins/jupiter",
      isSynthetic: true
    },
    {
      name: "Maker",
      symbol: "MKR",
      address: "0x8904De84c3bB3B7D2383F934Af40FcB3Ef82F28b",
      decimals: 18,
      priceDecimals: 2,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/1364/standard/Mark_Maker.png?1696502423",
      coingeckoUrl: "https://www.coingecko.com/en/coins/maker",
      isSynthetic: true
    },
    {
      name: "MANTRA",
      symbol: "OM",
      address: "0x1f3407Ea067DfBDF6dEb6bBFdA4869215fB0ab77",
      decimals: 18,
      priceDecimals: 4,
      categories: ["layer1", "defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/12151/standard/OM_Token.png?1696511991",
      coingeckoUrl: "https://www.coingecko.com/en/coins/mantra",
      isSynthetic: true
    },
    {
      name: "Dolomite",
      symbol: "DOLO",
      address: "0x97Ce1F309B949f7FBC4f58c5cb6aa417A5ff8964",
      decimals: 18,
      priceDecimals: 6,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/54710/standard/DOLO-small.png?1745398535",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dolomite",
      isSynthetic: true
    },
    {
      name: "LayerZero",
      symbol: "ZRO",
      address: "0xa8193C55C34Ed22e1Dbe73FD5Adc668E51578a67",
      decimals: 18,
      priceDecimals: 4,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/28206/standard/ftxG9_TJ_400x400.jpeg?1696527208",
      coingeckoUrl: "https://www.coingecko.com/en/coins/layerzero",
      isSynthetic: true
    },
    {
      name: "Moodeng",
      symbol: "MOODENG",
      address: "0xd3898c6570974AEca38a8ACf22fd60739e528A99",
      decimals: 6,
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/moo-deng",
      imageUrl: "https://assets.coingecko.com/coins/images/50264/standard/MOODENG.jpg?1726726975",
      categories: ["meme"]
    },
    {
      name: "Monero",
      symbol: "XMR",
      address: "0x13674172E6E44D31d4bE489d5184f3457c40153A",
      decimals: 12,
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/monero",
      imageUrl: "https://assets.coingecko.com/coins/images/69/standard/monero_logo.png?1696501460",
      categories: ["layer1", "defi"]
    },
    {
      name: "Pi Network",
      symbol: "PI",
      address: "0xd1738d37401a0A71f7E382d2cFeCD3ab69687017",
      decimals: 18,
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/pi-network",
      imageUrl: "https://assets.coingecko.com/coins/images/54342/standard/pi_network.jpg?1739347576",
      categories: ["layer1"]
    },
    {
      name: "Curve DAO Token",
      symbol: "CRV",
      address: "0xe5f01aeAcc8288E9838A60016AB00d7b6675900b",
      decimals: 18,
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/curve-dao-token",
      imageUrl: "https://assets.coingecko.com/coins/images/12124/standard/Curve.png?1696511967",
      categories: ["defi"]
    },
    {
      name: "Pump",
      symbol: "PUMP",
      address: "0x9c060B2fA953b5f69879a8B7B81f62BFfEF360be",
      decimals: 18,
      priceDecimals: 6,
      imageUrl: "https://assets.coingecko.com/coins/images/67164/standard/pump.jpg?1751949376",
      coingeckoUrl: "https://www.coingecko.com/en/coins/pump-fun",
      isSynthetic: true,
      categories: ["meme"]
    },
    {
      name: "SPX6900",
      symbol: "SPX6900",
      address: "0xb736be525A65326513351058427d1f47B0CfB045",
      decimals: 8,
      priceDecimals: 4,
      imageUrl: "https://assets.coingecko.com/coins/images/31401/standard/centeredcoin_%281%29.png?1737048493",
      coingeckoUrl: "https://www.coingecko.com/en/coins/spx6900",
      isSynthetic: true,
      categories: ["meme"]
    },
    {
      name: "Mantle",
      symbol: "MNT",
      address: "0x955cd91eEaE618F5a7b49E1e3c7482833B10DAb4",
      decimals: 18,
      priceDecimals: 5,
      imageUrl: "https://assets.coingecko.com/coins/images/30980/standard/token-logo.png?1696529819",
      coingeckoUrl: "https://www.coingecko.com/en/coins/mantle",
      isSynthetic: true,
      categories: ["layer2", "defi"]
    },
    {
      name: "GMX LP",
      symbol: "GLP",
      address: getContract$1(ARBITRUM, "GLP"),
      decimals: 18,
      imageUrl: "https://github.com/gmx-io/gmx-assets/blob/main/GMX-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
      reservesUrl: "https://portfolio.nansen.ai/dashboard/gmx?chain=ARBITRUM",
      isPlatformToken: true
    },
    /** Placeholder tokens */
    {
      name: "GMX Market tokens",
      symbol: "GM",
      address: "<market-token-address>",
      decimals: 18,
      imageUrl: "https://raw.githubusercontent.com/gmx-io/gmx-assets/main/GMX-Assets/PNG/GM_LOGO.png",
      isPlatformToken: true
    },
    {
      name: "GLV Market tokens",
      symbol: "GLV",
      address: "<market-token-address>",
      decimals: 18,
      imageUrl: "https://raw.githubusercontent.com/gmx-io/gmx-assets/main/GMX-Assets/PNG/GLV_LOGO.png",
      isPlatformToken: true
    },
    {
      name: "Algorand",
      symbol: "ALGO",
      address: "0x72Cd3a21aA7A898028d9501868Fbe6dED0020434",
      decimals: 6,
      priceDecimals: 5,
      isSynthetic: true,
      categories: ["layer1", "defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/4380/standard/download.png?1696504978",
      coingeckoUrl: "https://www.coingecko.com/en/coins/algorand"
    },
    {
      name: "Cronos",
      symbol: "CRO",
      address: "0xB7EfE7c7f059E84Ab87A83A169c583Fb4A54fAc3",
      decimals: 8,
      priceDecimals: 5,
      isSynthetic: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/7310/standard/cro_token_logo.png?1696507599",
      coingeckoUrl: "https://www.coingecko.com/en/coins/cronos"
    },
    {
      name: "Hedera",
      symbol: "HBAR",
      address: "0xEb2A83b973f4dbB9511D92dd40d2ba4C683f0971",
      decimals: 8,
      priceDecimals: 5,
      isSynthetic: true,
      categories: ["layer1", "defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/3688/standard/hbar.png?1696504364",
      coingeckoUrl: "https://www.coingecko.com/en/coins/hedera-hashgraph"
    },
    {
      name: "Convex Finance",
      symbol: "CVX",
      address: "0x3B6f801C0052Dfe0Ac80287D611F31B7c47B9A6b",
      decimals: 18,
      priceDecimals: 4,
      isSynthetic: true,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/15585/standard/convex.png?1696515221",
      coingeckoUrl: "https://www.coingecko.com/nl/coins/convex-finance"
    },
    {
      name: "Kaspa",
      symbol: "KAS",
      address: "0x91c6a8F6aFAC036F4ABf1bA55f4E76892E865E4a",
      decimals: 8,
      priceDecimals: 6,
      isSynthetic: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/25751/standard/kaspa-icon-exchanges.png?1696524837",
      coingeckoUrl: "https://www.coingecko.com/nl/coins/kaspa"
    },
    {
      name: "Aero",
      symbol: "AERO",
      address: "0xEcc5eb985Ddbb8335b175b0A2A1144E4c978F1f6",
      decimals: 18,
      priceDecimals: 4,
      isSynthetic: true,
      categories: ["defi"],
      coingeckoUrl: "https://www.coingecko.com/en/coins/aerodrome-finance",
      imageUrl: "https://assets.coingecko.com/coins/images/31745/standard/token.png?1696530564"
    },
    {
      name: "Brett",
      symbol: "BRETT",
      address: "0x4249F6e0808bEfF7368AaAD3F7A3Fd511F61Ee60",
      decimals: 18,
      priceDecimals: 4,
      isSynthetic: true,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/54317/standard/AERO.png?1728309870",
      coingeckoUrl: "https://www.coingecko.com/en/coins/brett-2"
    },
    {
      name: "World Liberty Financial",
      symbol: "WLFI",
      address: "0xC5799ab6E2818fD8d0788dB8D156B0c5db1Bf97b",
      decimals: 18,
      priceDecimals: 5,
      isSynthetic: true,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/50767/standard/wlfi.png?1756438915",
      coingeckoUrl: "https://www.coingecko.com/en/coins/world-liberty-financial"
    },
    {
      name: "OKB",
      symbol: "OKB",
      address: "0xd37F01A3379f052FEF70F63c0Be27931891aa2B9",
      decimals: 18,
      priceDecimals: 3,
      isSynthetic: true,
      categories: ["layer2"],
      imageUrl: "https://assets.coingecko.com/coins/images/4463/standard/WeChat_Image_20220118095654.png?1696505053",
      coingeckoUrl: "https://www.coingecko.com/nl/coins/okb"
    },
    {
      name: "Morpho",
      symbol: "MORPHO",
      address: "0xF67b2a901D674B443Fa9f6DB2A689B37c07fD4fE",
      decimals: 18,
      priceDecimals: 4,
      isSynthetic: true,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/29837/standard/Morpho-token-icon.png?1726771230",
      coingeckoUrl: "https://www.coingecko.com/nl/coins/morpho"
    },
    {
      name: "Venice Token",
      symbol: "VVV",
      address: "0xB79Eb5BA64A167676694bB41bc1640F95d309a2F",
      decimals: 18,
      priceDecimals: 4,
      isSynthetic: true,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/54023/standard/VVV_Token_Transparent.png?1741856877",
      coingeckoUrl: "https://www.coingecko.com/en/coins/venice-token"
    },
    {
      name: "Moonwell",
      symbol: "WELL",
      address: "0x465A31E5bA29b8EAcC860d499D714a6f07e56E85",
      decimals: 18,
      priceDecimals: 4,
      isSynthetic: true,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/26133/standard/WELL.png?1696525221",
      coingeckoUrl: "https://www.coingecko.com/en/coins/moonwell"
    },
    {
      name: "KTA",
      symbol: "KTA",
      decimals: 18,
      address: "0x96Ee343E36E8642627FAEa235D57a9FEC8a6e34f",
      isSynthetic: true,
      priceDecimals: 5,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/54693/standard/zora.jpg?1741094751",
      coingeckoUrl: "https://www.coingecko.com/en/coins/zora"
    },
    {
      name: "Zora",
      symbol: "ZORA",
      decimals: 18,
      address: "0xc5ff0eB026dB972F95DF3dfF04e697d8b660092a",
      isSynthetic: true,
      priceDecimals: 6,
      categories: ["layer2"],
      imageUrl: "https://assets.coingecko.com/coins/images/54723/standard/2025-03-05_22.53.06.jpg?1741234207",
      coingeckoUrl: "https://www.coingecko.com/en/coins/keeta"
    },
    {
      name: "Plasma",
      symbol: "XPL",
      address: "0x2e73bDBee83D91623736D514b0BB41f2afd9C7Fd",
      decimals: 18,
      priceDecimals: 4,
      categories: ["layer1", "defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/66489/standard/Plasma-symbol-green-1.png?1755142558",
      coingeckoUrl: "https://www.coingecko.com/en/coins/plasma",
      isSynthetic: true
    },
    {
      name: "Aster",
      symbol: "ASTER",
      address: "0x2aAB60E62f05d17e58dEc982870bfAdc7F4e7ADF",
      decimals: 18,
      priceDecimals: 4,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/69040/standard/_ASTER.png?1757326782",
      coingeckoUrl: "https://www.coingecko.com/en/coins/aster-2",
      isSynthetic: true
    },
    {
      name: "0G",
      symbol: "0G",
      address: "0x95c317066CF214b2E6588B2685D949384504F51e",
      decimals: 18,
      priceDecimals: 4,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/69096/standard/0G_1024x1024_Circular_Outlined.png?1758637574",
      coingeckoUrl: "https://www.coingecko.com/en/coins/0g",
      isSynthetic: true
    },
    {
      name: "Avantis",
      symbol: "AVNT",
      address: "0xdB58EB7f408EbA2176eCb44A4696292605cCEB39",
      decimals: 18,
      priceDecimals: 5,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/68972/standard/avnt-token.png?1757134448",
      coingeckoUrl: "https://www.coingecko.com/en/coins/avantis",
      isSynthetic: true
    },
    {
      name: "Linea",
      symbol: "LINEA",
      address: "0xc4017CFe7D7eaBDE63d3252caBF26A286fE2B1E0",
      decimals: 18,
      priceDecimals: 6,
      categories: ["layer2"],
      imageUrl: "https://assets.coingecko.com/coins/images/68507/standard/linea-logo.jpeg?1756025484",
      coingeckoUrl: "https://www.coingecko.com/en/coins/linea",
      isSynthetic: true
    }
  ],
  [AVALANCHE]: [
    {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
      address: zeroAddress,
      isNative: true,
      isShortable: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
      coingeckoUrl: "https://www.coingecko.com/en/coins/avalanche",
      isV1Available: true
    },
    {
      name: "Wrapped AVAX",
      symbol: "WAVAX",
      decimals: 18,
      address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      isWrapped: true,
      baseSymbol: "AVAX",
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
      coingeckoUrl: "https://www.coingecko.com/en/coins/avalanche",
      explorerUrl: "https://snowtrace.io/address/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      isV1Available: true
    },
    {
      name: "Ethereum (WETH.e)",
      symbol: "ETH",
      assetSymbol: "WETH.e",
      address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
      decimals: 18,
      isShortable: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      coingeckoUrl: "https://www.coingecko.com/en/coins/weth",
      coingeckoSymbol: "WETH",
      explorerUrl: "https://snowtrace.io/address/0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
      isV1Available: true
    },
    {
      name: "Bitcoin (BTC.b)",
      symbol: "BTC",
      assetSymbol: "BTC.b",
      address: "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
      decimals: 8,
      isShortable: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bitcoin-avalanche-bridged-btc-b",
      explorerUrl: "https://snowtrace.io/address/0x152b9d0FdC40C096757F570A51E494bd4b943E50",
      isV1Available: true
    },
    {
      name: "Bitcoin (WBTC.e)",
      symbol: "WBTC",
      assetSymbol: "WBTC.e",
      address: "0x50b7545627a5162F82A992c33b87aDc75187B218",
      decimals: 8,
      isShortable: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
      coingeckoUrl: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      coingeckoSymbol: "WBTC",
      explorerUrl: "https://snowtrace.io/address/0x50b7545627a5162F82A992c33b87aDc75187B218",
      isV1Available: true
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
      explorerUrl: "https://snowtrace.io/address/0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      isV1Available: true,
      isPermitSupported: true
    },
    {
      name: "Bridged USDC (USDC.e)",
      symbol: "USDC.E",
      address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bridged-usdc-avalanche-bridge",
      explorerUrl: "https://snowtrace.io/address/0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
      isV1Available: true
    },
    {
      name: "Tether",
      symbol: "USDT",
      decimals: 6,
      address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
      coingeckoUrl: "https://www.coingecko.com/en/coins/tether",
      explorerUrl: "https://snowtrace.io/address/0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
      isPermitSupported: true,
      contractVersion: "1"
    },
    {
      name: "Tether",
      symbol: "USDT.E",
      decimals: 6,
      address: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
      coingeckoUrl: "https://www.coingecko.com/en/coins/tether",
      explorerUrl: "https://snowtrace.io/address/0xc7198437980c041c805A1EDcbA50c1Ce5db95118"
    },
    {
      name: "Dai",
      symbol: "DAI.E",
      address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
      decimals: 18,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dai",
      explorerUrl: "https://snowtrace.io/address/0xd586E7F844cEa2F87f50152665BCbc2C279D8d70"
    },
    {
      name: "Magic Internet Money",
      symbol: "MIM",
      address: "0x130966628846BFd36ff31a822705796e8cb8C18D",
      decimals: 18,
      isStable: true,
      isTempHidden: true,
      imageUrl: "https://assets.coingecko.com/coins/images/16786/small/mimlogopng.png",
      coingeckoUrl: "https://www.coingecko.com/en/coins/magic-internet-money",
      explorerUrl: "https://snowtrace.io/address/0x130966628846BFd36ff31a822705796e8cb8C18D",
      isV1Available: true,
      isPermitSupported: true
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      decimals: 18,
      priceDecimals: 4,
      address: "0x5947BB275c521040051D82396192181b413227A3",
      isStable: false,
      isShortable: true,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700",
      coingeckoUrl: "https://www.coingecko.com/en/coins/chainlink",
      explorerUrl: "https://snowtrace.io/address/0x5947BB275c521040051D82396192181b413227A3"
    },
    {
      name: "Dogecoin",
      symbol: "DOGE",
      decimals: 8,
      priceDecimals: 5,
      address: "0xC301E6fe31062C557aEE806cc6A841aE989A3ac6",
      isSynthetic: true,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png?1547792256",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dogecoin"
    },
    {
      name: "Litecoin",
      symbol: "LTC",
      decimals: 8,
      priceDecimals: 3,
      address: "0x8E9C35235C38C44b5a53B56A41eaf6dB9a430cD6",
      isSynthetic: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/2/small/litecoin.png?1547033580",
      coingeckoUrl: "https://www.coingecko.com/en/coins/litecoin"
    },
    {
      name: "Wrapped SOL (Wormhole)",
      symbol: "SOL",
      assetSymbol: "WSOL (Wormhole)",
      priceDecimals: 3,
      decimals: 9,
      address: "0xFE6B19286885a4F7F55AdAD09C3Cd1f906D2478F",
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422",
      coingeckoUrl: "https://www.coingecko.com/en/coins/solana",
      coingeckoSymbol: "SOL",
      explorerUrl: "https://snowtrace.io/address/0xFE6B19286885a4F7F55AdAD09C3Cd1f906D2478F",
      isPermitSupported: true,
      isPermitDisabled: true,
      contractVersion: "1"
    },
    {
      name: "XRP",
      symbol: "XRP",
      decimals: 6,
      priceDecimals: 5,
      address: "0x34B2885D617cE2ddeD4F60cCB49809fc17bb58Af",
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png?1605778731",
      coingeckoUrl: "https://www.coingecko.com/en/coins/xrp",
      isSynthetic: true
    },
    {
      name: "Tether Gold",
      symbol: "XAUt0",
      address: "0x2775d5105276781B4b85bA6eA6a6653bEeD1dd32",
      decimals: 6,
      priceDecimals: 2,
      imageUrl: "https://assets.coingecko.com/coins/images/10481/standard/Tether_Gold.png?1696510471",
      coingeckoUrl: "https://www.coingecko.com/nl/coins/tether-gold",
      explorerUrl: "https://snowtrace.io/address/0x2775d5105276781B4b85bA6eA6a6653bEeD1dd32",
      isPermitSupported: true,
      isPermitDisabled: true,
      contractVersion: "1"
    },
    {
      name: "GMX",
      symbol: "GMX",
      address: getContract$1(AVALANCHE, "GMX"),
      decimals: 18,
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
      isPlatformToken: true,
      categories: ["defi"],
      coingeckoUrl: "https://www.coingecko.com/en/coins/gmx",
      explorerUrl: "https://snowtrace.io/address/0x62edc0692bd897d2295872a9ffcac5425011c661"
    },
    {
      name: "Official Trump",
      symbol: "TRUMP",
      address: "0x2f6d7be53fab5538065a226BA091015d422a7528",
      decimals: 6,
      priceDecimals: 4,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/53746/standard/trump.png?1737171561",
      coingeckoUrl: "https://www.coingecko.com/en/coins/official-trump",
      isSynthetic: true
    },
    {
      name: "Melania Meme",
      symbol: "MELANIA",
      address: "0xd42C991a4FAb293C57a7bf25C2E2ec5aE1dB1714",
      decimals: 6,
      priceDecimals: 4,
      categories: ["meme"],
      imageUrl: "https://assets.coingecko.com/coins/images/53775/standard/melania-meme.png?1737329885",
      coingeckoUrl: "https://www.coingecko.com/en/coins/melania-meme",
      isSynthetic: true
    },
    {
      name: "Pump",
      symbol: "PUMP",
      address: "0xdA598795DfE56388ca3D35e2ccFA96EFf83eC306",
      decimals: 18,
      priceDecimals: 6,
      imageUrl: "https://assets.coingecko.com/coins/images/67164/standard/pump.jpg?1751949376",
      coingeckoUrl: "https://www.coingecko.com/en/coins/pump-fun",
      isSynthetic: true,
      categories: ["meme"]
    },
    {
      name: "World Liberty Financial",
      symbol: "WLFI",
      address: "0xbDF8a77ACB7A54597E7760b34D3E632912bB59b7",
      decimals: 18,
      priceDecimals: 5,
      isSynthetic: true,
      categories: ["defi"],
      imageUrl: "https://assets.coingecko.com/coins/images/50767/standard/wlfi.png?1756438915",
      coingeckoUrl: "https://www.coingecko.com/en/coins/world-liberty-financial"
    },
    {
      name: "Escrowed GMX",
      symbol: "ESGMX",
      address: getContract$1(AVALANCHE, "ES_GMX"),
      decimals: 18,
      isPlatformToken: true
    },
    {
      name: "GMX LP",
      symbol: "GLP",
      address: getContract$1(AVALANCHE, "GLP"),
      decimals: 18,
      isPlatformToken: true,
      imageUrl: "https://github.com/gmx-io/gmx-assets/blob/main/GMX-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
      explorerUrl: "https://snowtrace.io/address/0x9e295B5B976a184B14aD8cd72413aD846C299660",
      reservesUrl: "https://portfolio.nansen.ai/dashboard/gmx?chain=AVAX"
    },
    /** Placeholder tokens */
    {
      name: "GMX Market tokens",
      symbol: "GM",
      address: "<market-token-address>",
      decimals: 18,
      imageUrl: "https://raw.githubusercontent.com/gmx-io/gmx-assets/main/GMX-Assets/PNG/GM_LOGO.png",
      isPlatformToken: true
    },
    {
      name: "GLV Market tokens",
      symbol: "GLV",
      address: "<market-token-address>",
      decimals: 18,
      imageUrl: "https://raw.githubusercontent.com/gmx-io/gmx-assets/main/GMX-Assets/PNG/GLV_LOGO.png",
      isPlatformToken: true
    }
  ],
  [AVALANCHE_FUJI]: [
    {
      name: "Avalanche",
      symbol: "AVAX",
      priceDecimals: 3,
      decimals: 18,
      address: zeroAddress,
      isNative: true,
      isShortable: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818"
    },
    {
      name: "Wrapped AVAX",
      symbol: "WAVAX",
      priceDecimals: 3,
      decimals: 18,
      address: "0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3",
      isWrapped: true,
      baseSymbol: "AVAX",
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
      coingeckoUrl: "https://www.coingecko.com/en/coins/avalanche",
      explorerUrl: "https://testnet.snowtrace.io/address/0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3",
      isPermitSupported: true
    },
    {
      name: "Ethereum (WETH.e)",
      symbol: "ETH",
      assetSymbol: "WETH.e",
      address: "0x82F0b3695Ed2324e55bbD9A9554cB4192EC3a514",
      decimals: 18,
      isShortable: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      coingeckoUrl: "https://www.coingecko.com/en/coins/weth",
      coingeckoSymbol: "WETH",
      explorerUrl: "https://testnet.snowtrace.io/address/0x82F0b3695Ed2324e55bbD9A9554cB4192EC3a514"
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0x3eBDeaA0DB3FfDe96E7a0DBBAFEC961FC50F725F",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
      explorerUrl: "https://testnet.snowtrace.io/address/0x3eBDeaA0DB3FfDe96E7a0DBBAFEC961FC50F725F"
    },
    {
      name: "Tether",
      symbol: "USDT",
      decimals: 6,
      address: "0x50df4892Bd13f01E4e1Cd077ff394A8fa1A3fD7c",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dai",
      explorerUrl: "https://testnet.snowtrace.io/address/0x50df4892Bd13f01E4e1Cd077ff394A8fa1A3fD7c"
    },
    {
      name: "Dai",
      symbol: "DAI",
      address: "0x51290cb93bE5062A6497f16D9cd3376Adf54F920",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dai",
      explorerUrl: "https://testnet.snowtrace.io/address/0x51290cb93bE5062A6497f16D9cd3376Adf54F920"
    },
    {
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      decimals: 8,
      address: "0x3Bd8e00c25B12E6E60fc8B6f1E1E2236102073Ca",
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
      coingeckoUrl: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      explorerUrl: "https://testnet.snowtrace.io/address/0x3Bd8e00c25B12E6E60fc8B6f1E1E2236102073Ca"
    },
    {
      name: "Solana",
      symbol: "SOL",
      decimals: 18,
      priceDecimals: 3,
      address: "0x137f4a7336df4f3f11894718528516edaaD0B082",
      categories: ["layer1"],
      isSynthetic: true,
      imageUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422",
      coingeckoUrl: "https://www.coingecko.com/en/coins/solana"
    },
    {
      name: "Test token",
      symbol: "TEST",
      decimals: 18,
      address: "0x42DD131E1086FFCc59bAE9498D71E20E0C889B14",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/tether"
    },
    {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
      priceDecimals: 3,
      address: "0x110892Dd5fa73bE430c0ade694febD9a4CAc68Be",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/binancecoin"
    },
    {
      name: "Cardano",
      symbol: "ADA",
      decimals: 18,
      priceDecimals: 5,
      address: "0xE64dfFF37Fa6Fe969b792B4146cEe2774Ef6e1a1",
      categories: ["layer1"],
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/cardano"
    },
    {
      name: "TRON",
      symbol: "TRX",
      decimals: 18,
      priceDecimals: 5,
      address: "0x0D1495527C255068F2f6feE31C85d326D0A76FE8",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/tron"
    },
    {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
      priceDecimals: 4,
      address: "0xadc4698B257F78187Fd675FBf591a09f4c975240",
      categories: ["layer1"],
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/polygon"
    },
    {
      name: "Polkadot",
      symbol: "DOT",
      address: "0x65FFb5664a7B3377A5a27D9e59C72Fb1A5E94962",
      decimals: 18,
      priceDecimals: 4,
      isSynthetic: true,
      categories: ["layer1"],
      coingeckoUrl: "https://www.coingecko.com/en/coins/polkadot"
    },
    {
      name: "Uniswap",
      symbol: "UNI",
      decimals: 18,
      priceDecimals: 4,
      address: "0xF62dC1d2452d0893735D22945Af53C290b158eAF",
      isSynthetic: true,
      categories: ["layer2", "defi"],
      coingeckoUrl: "https://www.coingecko.com/en/coins/uniswap"
    },
    {
      name: "Dogecoin",
      symbol: "DOGE",
      decimals: 8,
      priceDecimals: 5,
      address: "0x2265F317eA5f47A684E5B26c50948617c945d986",
      isSynthetic: true,
      isShortable: true,
      categories: ["meme"],
      coingeckoUrl: "https://www.coingecko.com/en/coins/dogecoin"
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      decimals: 18,
      priceDecimals: 3,
      address: "0x6BD09E8D65AD5cc761DF62454452d4EC1545e647",
      isSynthetic: true,
      isShortable: true,
      categories: ["defi"],
      coingeckoUrl: "https://www.coingecko.com/en/coins/chainlink"
    },
    {
      name: "XRP",
      symbol: "XRP",
      decimals: 6,
      priceDecimals: 4,
      address: "0xF1C2093383453831e8c90ecf809691123116dAaC",
      isSynthetic: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png?1605778731",
      coingeckoUrl: "https://www.coingecko.com/en/coins/xrp"
    },
    {
      name: "GMX",
      symbol: "GMX",
      address: "",
      decimals: 18,
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
      isPlatformToken: true
    },
    {
      name: "Escrowed GMX",
      symbol: "ESGMX",
      address: "",
      decimals: 18,
      isPlatformToken: true
    },
    {
      name: "GMX LP",
      symbol: "GLP",
      address: "",
      decimals: 18,
      imageUrl: "https://github.com/gmx-io/gmx-assets/blob/main/GMX-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
      isPlatformToken: true
    },
    /** Placeholder tokens */
    {
      name: "GMX Market tokens",
      symbol: "GM",
      address: "<market-token-address>",
      decimals: 18,
      imageUrl: "https://raw.githubusercontent.com/gmx-io/gmx-assets/main/GMX-Assets/PNG/GM_LOGO.png",
      isPlatformToken: true
    },
    {
      name: "GLV Market tokens",
      symbol: "GLV",
      address: "<market-token-address>",
      decimals: 18,
      imageUrl: "https://raw.githubusercontent.com/gmx-io/gmx-assets/main/GMX-Assets/PNG/GLV_LOGO.png",
      isPlatformToken: true
    }
  ],
  [ARBITRUM_SEPOLIA]: [
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: zeroAddress,
      wrappedAddress: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
      isNative: true,
      isShortable: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum"
    },
    {
      name: "Wrapped ETH",
      symbol: "WETH",
      address: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
      decimals: 18,
      isWrapped: true,
      baseSymbol: "ETH",
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum"
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      address: "0xF79cE1Cf38A09D572b021B4C5548b75A14082F12",
      decimals: 8,
      imageUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1746042828",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bitcoin"
    },
    {
      name: "USD Coin GMX",
      symbol: "USDC",
      address: "0x3321Fd36aEaB0d5CdfD26f4A3A93E2D2aAcCB99f",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin"
    },
    {
      name: "USD Coin Stargate",
      symbol: "USDC.SG",
      address: "0x3253a335E7bFfB4790Aa4C25C4250d206E9b9773",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin"
    },
    {
      name: "CRV",
      symbol: "CRV",
      address: "0xD5DdAED48B09fa1D7944bd662CB05265FCD7077C",
      decimals: 18,
      priceDecimals: 5,
      imageUrl: "https://assets.coingecko.com/coins/images/12134/small/curve.png?1596358786",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/curve-dao-token"
    },
    {
      name: "USDT",
      symbol: "USDT",
      address: "0x095f40616FA98Ff75D1a7D0c68685c5ef806f110",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
      coingeckoUrl: "https://www.coingecko.com/en/coins/tether"
    }
  ],
  [BOTANIX]: [
    {
      name: "Bitcoin",
      symbol: "BTC",
      assetSymbol: "BTC",
      address: NATIVE_TOKEN_ADDRESS,
      decimals: 18,
      isNative: true,
      isShortable: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bitcoin",
      baseSymbol: "BTC"
    },
    {
      name: "Pegged BTC",
      symbol: "PBTC",
      assetSymbol: "pBTC",
      address: "0x0D2437F93Fed6EA64Ef01cCde385FB1263910C56",
      decimals: 18,
      isShortable: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bitcoin",
      baseSymbol: "BTC",
      isWrapped: true
    },
    {
      name: "Staked BTC",
      symbol: "STBTC",
      assetSymbol: "stBTC",
      address: "0xF4586028FFdA7Eca636864F80f8a3f2589E33795",
      decimals: 18,
      isShortable: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bitcoin",
      baseSymbol: "BTC",
      isStaking: true
    },
    {
      name: "BTC",
      symbol: "BTC",
      address: "0x1B9e25f54225bcdCf347569E38C41Ade9BB686e5",
      decimals: 8,
      isShortable: true,
      categories: ["layer1"],
      imageUrl: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bitcoin",
      isSynthetic: true
    },
    {
      name: "USDC.E",
      symbol: "USDC.E",
      assetSymbol: "USDC.e",
      address: "0x29eE6138DD4C9815f46D34a4A1ed48F46758A402",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bridged-usdc-arbitrum",
      isPermitSupported: true
    }
  ]
};
var TOKENS_MAP = {};
var V1_TOKENS = {};
var V2_TOKENS = {};
var SYNTHETIC_TOKENS = {};
var TOKENS_BY_SYMBOL_MAP = {};
var WRAPPED_TOKENS_MAP = {};
var NATIVE_TOKENS_MAP = {};
var CHAIN_IDS = [ARBITRUM, AVALANCHE, AVALANCHE_FUJI, BOTANIX, ARBITRUM_SEPOLIA];
for (let j = 0; j < CHAIN_IDS.length; j++) {
  const chainId = CHAIN_IDS[j];
  TOKENS_MAP[chainId] = {};
  TOKENS_BY_SYMBOL_MAP[chainId] = {};
  SYNTHETIC_TOKENS[chainId] = [];
  V1_TOKENS[chainId] = [];
  V2_TOKENS[chainId] = [];
  let tokens = TOKENS[chainId];
  let wrappedTokenAddress;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    TOKENS_MAP[chainId][token.address] = token;
    TOKENS_BY_SYMBOL_MAP[chainId][token.symbol] = token;
    if (token.isWrapped) {
      WRAPPED_TOKENS_MAP[chainId] = token;
      wrappedTokenAddress = token.address;
    }
    if (token.isNative) {
      NATIVE_TOKENS_MAP[chainId] = token;
    }
    if (token.isV1Available && !token.isTempHidden) {
      V1_TOKENS[chainId].push(token);
    }
    if ((!token.isPlatformToken || token.isPlatformToken && token.isPlatformTradingToken) && !token.isTempHidden) {
      V2_TOKENS[chainId].push(token);
    }
    if (token.isSynthetic) {
      SYNTHETIC_TOKENS[chainId].push(token);
    }
  }
  NATIVE_TOKENS_MAP[chainId].wrappedAddress = wrappedTokenAddress;
}
function getWrappedToken(chainId) {
  return WRAPPED_TOKENS_MAP[chainId];
}
function getV1Tokens(chainId) {
  return V1_TOKENS[chainId];
}
function getV2Tokens(chainId) {
  return V2_TOKENS[chainId];
}
function getToken(chainId, address) {
  if (chainId === ARBITRUM && address === "0x74885b4D524d497261259B38900f54e6dbAd2210") {
    return getTokenBySymbol(chainId, "APE");
  }
  if (!TOKENS_MAP[chainId]) {
    throw new Error(`Incorrect chainId ${chainId}`);
  }
  if (!TOKENS_MAP[chainId][address]) {
    throw new Error(`Incorrect address "${address}" for chainId ${chainId}`);
  }
  return TOKENS_MAP[chainId][address];
}
function getTokenBySymbol(chainId, symbol, {
  isSynthetic,
  version,
  symbolType = "symbol"
} = {}) {
  let tokens = Object.values(TOKENS_MAP[chainId]);
  if (version) {
    tokens = version === "v1" ? getV1Tokens(chainId) : getV2Tokens(chainId);
  }
  let token;
  if (isSynthetic !== void 0) {
    token = tokens.find((token2) => {
      return token2[symbolType]?.toLowerCase() === symbol.toLowerCase() && Boolean(token2.isSynthetic) === isSynthetic;
    });
  } else {
    if (symbolType === "symbol" && TOKENS_BY_SYMBOL_MAP[chainId][symbol]) {
      token = TOKENS_BY_SYMBOL_MAP[chainId][symbol];
    } else {
      token = tokens.find((token2) => token2[symbolType]?.toLowerCase() === symbol.toLowerCase());
    }
  }
  if (!token) {
    throw new Error(`Incorrect symbol "${symbol}" for chainId ${chainId}`);
  }
  return token;
}
function convertTokenAddress(chainId, address, convertTo) {
  const wrappedToken = getWrappedToken(chainId);
  if (address === NATIVE_TOKEN_ADDRESS) {
    return wrappedToken.address;
  }
  return address;
}
function buildUrl(baseUrl, path, query) {
  const qs = query ? `?${queryString.stringify(query)}` : "";
  baseUrl = baseUrl.replace(/\/$/, "");
  return `${baseUrl}${path}${qs}`;
}
var USD_DECIMALS = 30;
var PRECISION_DECIMALS = 30;
expandDecimals(1, PRECISION_DECIMALS);
BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
var MAX_EXCEEDING_THRESHOLD = "1000000000";
var MIN_EXCEEDING_THRESHOLD = "0.01";
var TRIGGER_PREFIX_ABOVE = ">";
var TRIGGER_PREFIX_BELOW = "<";
function expandDecimals(n, decimals) {
  return BigInt(n) * 10n ** BigInt(decimals);
}
function numberToBigint(value, decimals) {
  const negative = value < 0;
  if (negative) value *= -1;
  const int = Math.trunc(value);
  let frac = value - int;
  let res = BigInt(int);
  for (let i = 0; i < decimals; i++) {
    res *= 10n;
    if (frac !== 0) {
      frac *= 10;
      const fracInt = Math.trunc(frac);
      res += BigInt(fracInt);
      frac -= fracInt;
    }
  }
  return negative ? -res : res;
}
var trimZeroDecimals = (amount) => {
  if (parseFloat(amount) === parseInt(amount)) {
    return parseInt(amount).toString();
  }
  return amount;
};
function formatTokenAmount(amount, tokenDecimals, symbol, opts = {}) {
  const {
    showAllSignificant = false,
    fallbackToZero = false,
    useCommas = false,
    minThreshold = "0",
    maxThreshold
  } = opts;
  const displayDecimals = opts.displayDecimals ?? (opts.isStable ? 2 : 4);
  const symbolStr = "";
  if (typeof amount !== "bigint" || !tokenDecimals) {
    if (fallbackToZero) {
      amount = 0n;
      tokenDecimals = displayDecimals;
    } else {
      return void 0;
    }
  }
  let amountStr;
  const maybePlus = opts.displayPlus ? "+" : "";
  const sign = amount < 0n ? "-" : maybePlus;
  if (showAllSignificant) {
    amountStr = formatAmountFree(amount, tokenDecimals, tokenDecimals);
  } else {
    const exceedingInfo = getLimitedDisplay(amount, tokenDecimals, {
      maxThreshold,
      minThreshold
    });
    const symbol2 = exceedingInfo.symbol ? `${exceedingInfo.symbol} ` : "";
    amountStr = `${symbol2}${sign}${formatAmount(
      exceedingInfo.value,
      tokenDecimals,
      displayDecimals,
      useCommas,
      void 0
    )}`;
  }
  return `${amountStr}${symbolStr}`;
}
function numberWithCommas(x, { showDollar = false } = {}) {
  if (x === void 0 || x === null) {
    return "...";
  }
  const parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${showDollar ? "$\u200A" : ""}${parts.join(".")}`;
}
var formatAmount = (amount, tokenDecimals, displayDecimals, useCommas, defaultValue, visualMultiplier) => {
  if (defaultValue === void 0 || defaultValue === null) {
    defaultValue = "...";
  }
  if (amount === void 0 || amount === null || amount === "") {
    return defaultValue;
  }
  if (displayDecimals === void 0) {
    displayDecimals = 4;
  }
  const amountBigInt = roundWithDecimals(
    BigInt(amount) * BigInt(1),
    {
      displayDecimals,
      decimals: tokenDecimals
    }
  );
  let amountStr = formatUnits(amountBigInt, tokenDecimals);
  amountStr = limitDecimals(amountStr, displayDecimals);
  if (displayDecimals !== 0) {
    amountStr = padDecimals(amountStr, displayDecimals);
  }
  if (useCommas) {
    return numberWithCommas(amountStr);
  }
  return amountStr;
};
var formatAmountFree = (amount, tokenDecimals, displayDecimals) => {
  if (amount === void 0 || amount === null) {
    return "...";
  }
  amount = BigInt(amount);
  let amountStr = formatUnits(amount, tokenDecimals);
  amountStr = limitDecimals(amountStr, displayDecimals);
  return trimZeroDecimals(amountStr);
};
function getLimitedDisplay(amount, tokenDecimals, opts = {}) {
  const {
    maxThreshold = MAX_EXCEEDING_THRESHOLD,
    minThreshold = MIN_EXCEEDING_THRESHOLD
  } = opts;
  const max = maxThreshold === null ? null : expandDecimals(BigInt(maxThreshold), tokenDecimals);
  const min = parseUnits(minThreshold.toString(), tokenDecimals);
  const absAmount = bigMath.abs(amount);
  if (absAmount == 0n) {
    return {
      symbol: "",
      value: absAmount
    };
  }
  const symbol = max !== null && absAmount > max ? TRIGGER_PREFIX_ABOVE : absAmount < min ? TRIGGER_PREFIX_BELOW : "";
  const value = max !== null && absAmount > max ? max : absAmount < min ? min : absAmount;
  return {
    symbol,
    value
  };
}
var limitDecimals = (amount, maxDecimals) => {
  let amountStr = amount.toString();
  if (maxDecimals === void 0) {
    return amountStr;
  }
  if (maxDecimals === 0) {
    return amountStr.split(".")[0];
  }
  const dotIndex = amountStr.indexOf(".");
  if (dotIndex !== -1) {
    let decimals = amountStr.length - dotIndex - 1;
    if (decimals > maxDecimals) {
      amountStr = amountStr.substr(
        0,
        amountStr.length - (decimals - maxDecimals)
      );
    }
  }
  return amountStr;
};
var padDecimals = (amount, minDecimals) => {
  let amountStr = amount.toString();
  const dotIndex = amountStr.indexOf(".");
  if (dotIndex !== -1) {
    const decimals = amountStr.length - dotIndex - 1;
    if (decimals < minDecimals) {
      amountStr = amountStr.padEnd(
        amountStr.length + (minDecimals - decimals),
        "0"
      );
    }
  } else {
    amountStr = amountStr + "." + "0".repeat(minDecimals);
  }
  return amountStr;
};
function roundWithDecimals(value, opts) {
  if (opts.displayDecimals === opts.decimals) {
    return BigInt(value);
  }
  let valueString = value.toString();
  let isNegative = false;
  if (valueString[0] === "-") {
    valueString = valueString.slice(1);
    isNegative = true;
  }
  if (valueString.length < opts.decimals) {
    valueString = valueString.padStart(opts.decimals, "0");
  }
  const mainPart = valueString.slice(
    0,
    valueString.length - opts.decimals + opts.displayDecimals
  );
  const partToRound = valueString.slice(
    valueString.length - opts.decimals + opts.displayDecimals
  );
  let mainPartBigInt = BigInt(mainPart);
  let returnValue = mainPartBigInt;
  if (partToRound.length !== 0) {
    if (Number(partToRound[0]) >= 5) {
      mainPartBigInt += 1n;
    }
    returnValue = BigInt(
      mainPartBigInt.toString() + new Array(partToRound.length).fill("0").join("")
    );
  }
  return isNegative ? returnValue * -1n : returnValue;
}

// src/domain/externalSwap/openOcean.ts
async function getOpenOceanTxnData({
  chainId,
  tokenInAddress,
  tokenOutAddress,
  amountIn,
  senderAddress,
  receiverAddress,
  gasPrice,
  slippage,
  openOceanUrl,
  openOceanReferrer,
  disabledDexIds = [],
  onError
}) {
  const tokenIn = getToken(chainId, tokenInAddress);
  const gweiGasPrice = formatTokenAmount(gasPrice, 18 - 9, void 0, {
    displayDecimals: 8
  });
  const url = buildUrl(openOceanUrl, "/swap_quote", {
    inTokenAddress: convertTokenAddress(chainId, tokenInAddress),
    outTokenAddress: convertTokenAddress(chainId, tokenOutAddress),
    amount: formatTokenAmount(amountIn, tokenIn.decimals, void 0, {
      showAllSignificant: true,
      isStable: tokenIn.isStable
    }),
    gasPrice: gweiGasPrice,
    slippage: (slippage / 100).toString(),
    sender: senderAddress,
    account: receiverAddress,
    referrer: openOceanReferrer,
    disabledDexIds: disabledDexIds.join(","),
    disableRfq: true
  });
  try {
    const res = await fetch(url);
    if (res.status === 403) {
      throw new Error(`IP is banned ${await res.text()}`);
    }
    const parsed = await res.json();
    if (!parsed.data || parsed.code !== 200) {
      throw new Error(
        `Failed to build transaction: ${parsed.code} ${parsed.error}`
      );
    }
    if (parsed.data.to !== getContract(chainId, "OpenOceanRouter")) {
      throw new Error(`Invalid OpenOceanRouter address: ${parsed.data.to}`);
    }
    return {
      to: parsed.data.to,
      data: parsed.data.data,
      value: BigInt(parsed.data.value),
      estimatedGas: BigInt(parsed.data.estimatedGas),
      usdIn: numberToBigint(
        parseFloat(parsed.data.inToken.volume),
        USD_DECIMALS
      ),
      usdOut: numberToBigint(
        parseFloat(parsed.data.outToken.volume),
        USD_DECIMALS
      ),
      priceIn: numberToBigint(
        parseFloat(parsed.data.inToken.usd),
        USD_DECIMALS
      ),
      priceOut: numberToBigint(
        parseFloat(parsed.data.outToken.usd),
        USD_DECIMALS
      ),
      gasPrice: BigInt(parsed.data.gasPrice),
      amountIn,
      outputAmount: BigInt(parsed.data.minOutAmount)
    };
  } catch (e) {
    const error = e;
    error.message += ` URL: ${url.replace(receiverAddress, "...")}`;
    if (onError) {
      onError(error, url);
    }
    return void 0;
  }
}

export { getOpenOceanTxnData };
//# sourceMappingURL=openOcean.js.map
//# sourceMappingURL=openOcean.js.map