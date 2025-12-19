export declare function emitMetricEvent<T extends {
    event: string;
    data?: object;
    time?: number;
    isError?: boolean;
} = any>({ event, data, time, isError }: T): void;
export declare function emitMetricCounter<T extends {
    event: string;
    data?: object;
} = any>({ event, data }: {
    event: T["event"];
    data?: T["data"];
}): void;
export declare function emitMetricTiming<T extends {
    event: string;
    data?: object;
    time: number;
} = any>({ event, time, data, }: {
    event: T["event"];
    time: number;
    data?: T["data"];
}): void;
