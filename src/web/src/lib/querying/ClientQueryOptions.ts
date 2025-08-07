import stableHash from "stable-hash";

export interface ClientQueryOptions {
	readonly filters?: ClientQueryFilterOption[];
	readonly sorts?: ClientQuerySortOption[];
	readonly pagination?: ClientQueryPaginationOption;
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

export interface ClientQueryPaginationOption {
	readonly cursor: number;
	readonly pageSize: number;
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

export const hashClientOptions = (options: ClientQueryOptions): string => {
	return stableHash(options);
};
