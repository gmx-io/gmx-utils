var TaskState = /* @__PURE__ */ ((TaskState2) => {
  TaskState2["CheckPending"] = "CheckPending";
  TaskState2["ExecPending"] = "ExecPending";
  TaskState2["WaitingForConfirmation"] = "WaitingForConfirmation";
  TaskState2["ExecSuccess"] = "ExecSuccess";
  TaskState2["ExecReverted"] = "ExecReverted";
  TaskState2["Cancelled"] = "Cancelled";
  return TaskState2;
})(TaskState || {});
var TxnEventName = /* @__PURE__ */ ((TxnEventName2) => {
  TxnEventName2["Submitted"] = "Submitted";
  TxnEventName2["Simulated"] = "Simulated";
  TxnEventName2["Sending"] = "Sending";
  TxnEventName2["Sent"] = "Sent";
  TxnEventName2["Error"] = "Error";
  return TxnEventName2;
})(TxnEventName || {});
class TxnEventBuilder {
  constructor(ctx) {
    this.ctx = ctx;
  }
  _build(name, eventData) {
    return {
      event: name,
      data: {
        ...this.ctx,
        ...eventData
      }
    };
  }
  extend(event) {
    return {
      event: event.event,
      data: {
        ...this.ctx,
        ...event.data
      }
    };
  }
  Error(error) {
    return this._build("Error" /* Error */, { error });
  }
  Submitted() {
    return this._build("Submitted" /* Submitted */, {});
  }
  Simulated() {
    return this._build("Simulated" /* Simulated */, {});
  }
  Sending() {
    return this._build("Sending" /* Sending */, {});
  }
  Sent(params) {
    return this._build("Sent" /* Sent */, params);
  }
}

export { TaskState, TxnEventBuilder, TxnEventName };
//# sourceMappingURL=types.js.map
//# sourceMappingURL=types.js.map