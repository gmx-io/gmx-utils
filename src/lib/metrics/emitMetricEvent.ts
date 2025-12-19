/* eslint-disable @typescript-eslint/no-unused-vars */
// Mock implementations for metrics - no-op functions for utils package

export function emitMetricEvent<
  T extends {
    event: string;
    data?: object;
    time?: number;
    isError?: boolean;
  } = any
>({ event, data, time, isError }: T) {
  // Mock implementation - no-op
}

export function emitMetricCounter<
  T extends { event: string; data?: object } = any
>({ event, data }: { event: T["event"]; data?: T["data"] }) {
  // Mock implementation - no-op
}

export function emitMetricTiming<
  T extends { event: string; data?: object; time: number } = any
>({
  event,
  time,
  data,
}: {
  event: T["event"];
  time: number;
  data?: T["data"];
}) {
  // Mock implementation - no-op
}
