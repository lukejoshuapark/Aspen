export interface ClientQueryOptions {
	readonly filter?: ClientQueryFilterOption[];
	readonly sort?: ClientQuerySortOption[];
}

export interface ClientQueryFilterOption {
	readonly column?: string;
	readonly operator: FilterOperator;
	readonly operand?: string | number | boolean;
	readonly filters?: ClientQueryFilterOption[];
}

export interface ClientQuerySortOption {
	readonly column: string;
	readonly direction: SortDirection;
}

export enum SortDirection {
	Ascending = "ASC",
	Descending = "DESC"
}

export enum FilterOperator {
	EqualTo = "==",
    NotEqualTo = "!=",
    GreaterThan = ">",
    GreaterThanOrEqualTo = ">=",
    LessThan = "<",
    LessThanOrEqualTo = "<=",
    And = "&&",
    Or = "||"
}
