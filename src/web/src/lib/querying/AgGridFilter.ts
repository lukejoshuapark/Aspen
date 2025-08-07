import { FilterOperator, type ClientQueryFilterOption } from "@/lib/querying/ClientQueryOptions";

export type AgGridFilterType = "text" | "number";
export type AgGridComparisonType = "equals" | "notEqual" | "greaterThan" | "greaterThanOrEqual" | "lessThan" | "lessThanOrEqual";
export type AgGridLogicalType = "AND" | "OR";

export type AgGridFilter = AgGridComparisonFilter | AgGridLogicalFilter;

export interface AgGridComparisonFilter {
	filterType: AgGridFilterType;
	type: AgGridComparisonType;
	filter: string | number | boolean;
}

export interface AgGridLogicalFilter {
	filterType: AgGridFilterType;
	operator: AgGridLogicalType;
	conditions: AgGridComparisonFilter[];
}

export const deriveClientQueryFiltersFromAgGridFilters = (agGridFilter: Record<string, AgGridFilter>): ClientQueryFilterOption[] | undefined => {
	const columns = Object.keys(agGridFilter);
	if (columns.length < 1) {
		return undefined;
	}

	return columns.map(x => deriveClientQueryFilterFromAgGridFilter(x, agGridFilter[x]));
};

const deriveClientQueryFilterFromAgGridFilter = (column: string, agGridFilter: AgGridFilter): ClientQueryFilterOption => {
	if ("conditions" in agGridFilter) {
		return deriveClientQueryLogicalFilterFromAgGridLogicalFilter(column, agGridFilter);
	}

	return deriveClientQueryComparisonFilterFromAgGridComparisonFilter(column, agGridFilter);
};

const deriveClientQueryComparisonFilterFromAgGridComparisonFilter = (column: string, agGridComparisonFilter: AgGridComparisonFilter): ClientQueryFilterOption => {
	return {
		column: column.substring(0, 1).toUpperCase() + column.substring(1),
		operator: deriveClientQueryOperatorFromAgGridComparisonType(agGridComparisonFilter.type),
		operand: agGridComparisonFilter.filter
	};
};

const deriveClientQueryLogicalFilterFromAgGridLogicalFilter = (column: string, agGridLogicalFilter: AgGridLogicalFilter): ClientQueryFilterOption => {
	return {
		operator: deriveClientQueryOperatorFromAgGridLogicalType(agGridLogicalFilter.operator),
		filters: agGridLogicalFilter.conditions.map(x => deriveClientQueryComparisonFilterFromAgGridComparisonFilter(column, x))
	};
};

const deriveClientQueryOperatorFromAgGridComparisonType = (agGridComparisonType: AgGridComparisonType): FilterOperator => {
	switch (agGridComparisonType) {
	case "equals":
		return FilterOperator.EqualTo;
	case "notEqual":
		return FilterOperator.NotEqualTo;
	case "greaterThan":
		return FilterOperator.GreaterThan;
	case "greaterThanOrEqual":
		return FilterOperator.GreaterThanOrEqualTo;
	case "lessThan":
		return FilterOperator.LessThan;
	case "lessThanOrEqual":
		return FilterOperator.LessThanOrEqualTo;
	default:
		throw new Error(`Unknown comparison type: ${agGridComparisonType}`);
	}
};

const deriveClientQueryOperatorFromAgGridLogicalType = (agGridLogicalType: AgGridLogicalType): FilterOperator => {
	switch (agGridLogicalType) {
	case "AND":
		return FilterOperator.And;
	case "OR":
		return FilterOperator.Or;
	default:
		throw new Error(`Unknown logical type: ${agGridLogicalType}`);
	}
};
