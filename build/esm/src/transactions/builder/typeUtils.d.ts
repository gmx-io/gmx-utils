import { ExpressTxnParams, GlobalExpressParams } from "../express/types";
export type BaseCapabilities = {
    canSendWallet: boolean;
    canSendExpress: boolean;
    canSendOneClick: boolean;
    hasExpressParams: boolean;
    hasEstimatedExpress: boolean;
    hasSignature: boolean;
};
export type BaseInitialCapabilities = {
    canSendWallet: true;
    canSendExpress: false;
    canSendOneClick: false;
    hasExpressParams: false;
    hasEstimatedExpress: false;
    hasSignature: false;
};
export type HasCapability<TCaps extends BaseCapabilities, TKey extends keyof TCaps, TValue = true> = TCaps[TKey] extends TValue ? true : false;
export type RequireCapabilities<TCaps extends BaseCapabilities, TRequired extends Partial<BaseCapabilities>> = {
    [K in keyof TRequired]: K extends keyof TCaps ? TRequired[K] extends TCaps[K] ? true : false : false;
}[keyof TRequired] extends true ? true : false;
export type WithCapabilities<TCaps extends BaseCapabilities, TUpdates extends Partial<BaseCapabilities>> = Omit<TCaps, keyof TUpdates> & TUpdates;
export type BaseBuilderState<TCaps extends BaseCapabilities> = {
    capabilities: TCaps;
    expressGlobParams?: GlobalExpressParams;
    estimatedExpressParams?: ExpressTxnParams;
    signature?: string;
};
export type ExpressMethods<TCaps extends BaseCapabilities, TBuilder> = {
    setExpressParams: (params: GlobalExpressParams) => TBuilder & {
        capabilities: WithCapabilities<TCaps, {
            hasExpressParams: true;
        }>;
    };
    estimate: HasCapability<TCaps, "hasExpressParams"> extends true ? () => Promise<TBuilder & {
        capabilities: WithCapabilities<TCaps, {
            hasEstimatedExpress: true;
        }>;
    }> : never;
    sign: HasCapability<TCaps, "hasEstimatedExpress"> extends true ? () => Promise<TBuilder & {
        capabilities: WithCapabilities<TCaps, {
            hasSignature: true;
            canSendExpress: true;
            canSendOneClick: true;
        }>;
    }> : never;
    sendExpressTransaction: HasCapability<TCaps, "canSendExpress"> extends true ? () => Promise<void> : never;
    sendOneClickTransaction: HasCapability<TCaps, "canSendOneClick"> extends true ? () => Promise<void> : never;
};
export type SendMethods<TCaps extends BaseCapabilities> = {
    sendWalletTransaction: HasCapability<TCaps, "canSendWallet"> extends true ? () => Promise<void> : never;
};
export declare function withBaseState<TNewCaps extends BaseCapabilities, TCaps extends BaseCapabilities>(state: BaseBuilderState<TCaps>, updates: Partial<BaseBuilderState<TNewCaps>>): BaseBuilderState<TNewCaps>;
export declare function withBaseCapabilities<TNewCaps extends BaseCapabilities, TCaps extends BaseCapabilities>(state: BaseBuilderState<TCaps>, capabilityUpdates: Partial<BaseCapabilities>): BaseBuilderState<TNewCaps>;
