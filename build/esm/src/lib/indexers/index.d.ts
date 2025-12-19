export type GraphQlFilters = {
    /**
     * `or` must be a single key-value pair in the object.
     */
    or?: GraphQlFilters[];
    /**
     * `and` must be a single key-value pair in the object.
     */
    and?: GraphQlFilters[];
    /**
     * Key must not start with an `_`. If you want to use nested filtering add `_` to the parent key itself if possible.
     * Otherwise, if for some reason the field name itself starts with an `_`, change these types.
     */
    [key: `_${string}`]: never;
    [key: string]: string | number | boolean | undefined | GraphQlFilters | string[] | number[] | GraphQlFilters[] | null;
};
export declare function buildFiltersBody(filters: GraphQlFilters, options?: {
    enums?: Record<string, string>;
}): string;
