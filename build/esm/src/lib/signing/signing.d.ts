export type SignatureDomain = {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
};
export type ISigner = {
    address: string;
    getNetwork: () => Promise<{
        chainId: number;
    }>;
    signTypedData: (domain: SignatureDomain, types: SignatureTypes, value: Record<string, any>) => Promise<string>;
    sendTransaction: (params: any) => Promise<any>;
};
export type SignatureTypes = Record<string, {
    name: string;
    type: string;
}[]>;
export type SignTypedDataParams = {
    signer: ISigner;
    types: SignatureTypes;
    typedData: Record<string, any>;
    domain: SignatureDomain;
    shouldUseSignerMethod?: boolean;
    minified?: boolean;
};
export declare function signTypedData({ signer, domain, types, typedData, shouldUseSignerMethod, minified, }: SignTypedDataParams): Promise<string>;
export declare function splitSignature(signature: string): {
    r: string;
    s: string;
    v: number;
};
