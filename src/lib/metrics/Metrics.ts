/* eslint-disable @typescript-eslint/no-unused-vars */
// Mock Metrics class for utils package

import type { ErrorLike } from "lib/errors";

type Timers = { [key: string]: number };

export class Metrics {
  private timers: Timers = {};

  startTimer = (label: string) => {
    this.timers[label] = Date.now();
  };

  getTime = (label: string, clear?: boolean): number | undefined => {
    const startTime = this.timers[label];

    if (startTime === undefined) {
      return undefined;
    }

    const elapsed = Date.now() - startTime;

    if (clear) {
      delete this.timers[label];
    }

    return elapsed;
  };

  pushTiming<T extends { event: string; data?: object } = never>(
    event: T["event"],
    time: number,
    data?: T["data"]
  ) {
    // Mock implementation - no-op
  }

  pushError = (error: ErrorLike | string, errorSource: string) => {
    // Mock implementation - no-op
  };

  pushEvent = <
    T extends {
      event: string;
      data?: object;
      time?: number;
      isError?: boolean;
    } = never
  >(
    params: T
  ) => {
    // Mock implementation - no-op
  };

  pushCounter = <T extends { event: string; data?: object } = never>(
    event: T["event"],
    data?: T["data"]
  ) => {
    // Mock implementation - no-op
  };
}

export const metrics = new Metrics();
