import { Token } from "domain/tokens/types";
export type ExecutionFee = {
    feeUsd: bigint;
    feeTokenAmount: bigint;
    feeToken: Token;
    gasLimit: bigint;
    isFeeHigh: boolean;
    isFeeVeryHigh: boolean;
};
export type GasLimitsConfig = {
    depositToken: bigint;
    withdrawalMultiToken: bigint;
    shift: bigint;
    singleSwap: bigint;
    swapOrder: bigint;
    increaseOrder: bigint;
    decreaseOrder: bigint;
    estimatedGasFeeBaseAmount: bigint;
    estimatedGasFeePerOraclePrice: bigint;
    estimatedFeeMultiplierFactor: bigint;
    gelatoRelayFeeMultiplierFactor: bigint;
    glvDepositGasLimit: bigint;
    glvWithdrawalGasLimit: bigint;
    glvPerMarketGasLimit: bigint;
    createOrderGasLimit: bigint;
    updateOrderGasLimit: bigint;
    cancelOrderGasLimit: bigint;
    tokenPermitGasLimit: bigint;
    gmxAccountCollateralGasLimit: bigint;
};
export type L1ExpressOrderGasReference = {
    gasLimit: bigint;
    sizeOfData: bigint;
};
