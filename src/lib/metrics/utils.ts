// Mock utility functions for metrics - no-op implementations for utils package

import type { ErrorLike } from "lib/errors";

import type { OrderMetricId } from "./types";

export function sendOrderSimulatedMetric(
  _metricId: OrderMetricId,
  _error?: ErrorLike
) {
  // Mock implementation - no-op
}

export function sendTxnErrorMetric(_error: ErrorLike, _errorSource: string) {
  // Mock implementation - no-op
}
