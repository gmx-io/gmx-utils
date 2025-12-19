export type GelatoPollingTiming = {
    event: "express.pollGelatoTask.finalStatus";
    data?: {
        attempts?: number;
        taskState?: string;
    };
};
export type OrderMetricId = string;
export type GetFeeDataBlockError = {
    event: "error.getFeeData.value.hash";
};
