import { Address, Hash } from "viem";
export type ERC20Address = string & {
    __brand: "ERC20Address";
};
export type NativeTokenSupportedAddress = string & {
    __brand: "NativeTokenSupportedAddress";
};
export type TokenAddressTypesMap = {
    wrapped: ERC20Address;
    native: NativeTokenSupportedAddress;
};
export type TokenCategory = "meme" | "layer1" | "layer2" | "defi";
export type Token = {
    name: string;
    symbol: string;
    assetSymbol?: string;
    baseSymbol?: string;
    decimals: number;
    address: string;
    priceDecimals?: number;
    visualMultiplier?: number;
    visualPrefix?: string;
    wrappedAddress?: string;
    coingeckoUrl?: string;
    coingeckoSymbol?: string;
    metamaskSymbol?: string;
    explorerSymbol?: string;
    explorerUrl?: string;
    reservesUrl?: string;
    imageUrl?: string;
    categories?: TokenCategory[];
    isPermitSupported?: boolean;
    isPermitDisabled?: boolean;
    contractVersion?: string;
    isUsdg?: boolean;
    isNative?: boolean;
    isWrapped?: boolean;
    isShortable?: boolean;
    isStable?: boolean;
    isSynthetic?: boolean;
    isTempHidden?: boolean;
    isChartDisabled?: boolean;
    isV1Available?: boolean;
    isPlatformToken?: boolean;
    isPlatformTradingToken?: boolean;
    isStaking?: boolean;
    shouldResetAllowance?: boolean;
};
export type TokenAsyncData = {
    prices: TokenPrices;
    isGmxAccount?: boolean;
    walletBalance?: bigint;
    gmxAccountBalance?: bigint;
    /**
     * If isGmxAccount is true, then this is the gmx account balance
     * If isGmxAccount is false, then this is the wallet balance
     */
    balance?: bigint;
    totalSupply?: bigint;
    hasPriceFeedProvider?: boolean;
};
export type TokenData = Token & TokenAsyncData;
export type TokensData = {
    [address: string]: TokenData;
};
export type ProgressiveTokenData = Token & Partial<TokenAsyncData>;
export type ProgressiveTokensData = {
    [address: string]: ProgressiveTokenData;
};
export type TokenPrices = {
    minPrice: bigint;
    maxPrice: bigint;
};
export type TokenPricesData = {
    [address: string]: TokenPrices;
};
export type SignedTokenPermit = {
    owner: Address;
    spender: Address;
    value: bigint;
    deadline: bigint;
    v: number;
    r: Hash;
    s: Hash;
    token: Address;
    onchainParams: {
        name: string;
        version: string;
        nonce: bigint;
    };
};
export type TokensAllowanceData = {
    [tokenAddress: string]: bigint;
};
export type TokenBalancesData = {
    [tokenAddress: string]: bigint;
};
