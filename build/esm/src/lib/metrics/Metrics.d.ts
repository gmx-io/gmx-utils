import type { ErrorLike } from "../errors/index.js";
export declare class Metrics {
    private timers;
    startTimer: (label: string) => void;
    getTime: (label: string, clear?: boolean) => number | undefined;
    pushTiming<T extends {
        event: string;
        data?: object;
    } = never>(event: T["event"], time: number, data?: T["data"]): void;
    pushError: (error: ErrorLike | string, errorSource: string) => void;
    pushEvent: <T extends {
        event: string;
        data?: object | undefined;
        time?: number | undefined;
        isError?: boolean | undefined;
    } = never>(params: T) => void;
    pushCounter: <T extends {
        event: string;
        data?: object | undefined;
    } = never>(event: T["event"], data?: T["data"]) => void;
}
export declare const metrics: Metrics;
