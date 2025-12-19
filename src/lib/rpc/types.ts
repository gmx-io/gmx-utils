export type iRpc = {
  estimateGas: (params: {
    to: string;
    from: string;
    data: string;
    value?: bigint;
  }) => Promise<bigint>;
  estimateFeesPerGas: (params: { chainId: number }) => Promise<{
    gasPrice: bigint;
    maxPriorityFeePerGas: bigint;
  }>;
  ethCall: (params: {
    to: string;
    from: string;
    data: string;
    value?: bigint;
  }) => Promise<string>;
  getBlock: (params: { blockTag: string }) => Promise<{
    baseFeePerGas: bigint;
    gasPrice: bigint;
    maxPriorityFeePerGas: bigint;
    maxFeePerGas: bigint;
    gasUsed: bigint;
    gasLimit: bigint;
    timestamp: bigint;
    number: bigint;
    hash: string;
  }>;
};
