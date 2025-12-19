export type ContractPrice = bigint & { __brand: "contractPrice" };

export enum TriggerThresholdType {
  Above = ">",
  Below = "<",
}
