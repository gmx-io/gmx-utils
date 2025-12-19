import type { ErrorLike } from "lib/errors";
import type { OrderMetricId } from "./types";
export declare function sendOrderSimulatedMetric(_metricId: OrderMetricId, _error?: ErrorLike): void;
export declare function sendTxnErrorMetric(_error: ErrorLike, _errorSource: string): void;
