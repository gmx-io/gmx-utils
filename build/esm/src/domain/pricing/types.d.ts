export type ContractPrice = bigint & {
    __brand: "contractPrice";
};
export declare enum TriggerThresholdType {
    Above = ">",
    Below = "<"
}
