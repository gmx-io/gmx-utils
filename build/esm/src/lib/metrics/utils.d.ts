import type { ErrorLike } from "../errors/index.js";
import type { OrderMetricId } from "./types.js";
export declare function sendOrderSimulatedMetric(_metricId: OrderMetricId, _error?: ErrorLike): void;
export declare function sendTxnErrorMetric(_error: ErrorLike, _errorSource: string): void;
