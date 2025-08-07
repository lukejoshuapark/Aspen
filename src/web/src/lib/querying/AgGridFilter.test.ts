import { expect, test } from "vitest";
import { deriveClientQueryFiltersFromAgGridFilters, type AgGridFilter } from "@/lib/querying/AgGridFilter";
import { FilterOperator } from "@/lib/querying/ClientQueryOptions";

test("Correctly derives real example", () => {
	const agGridFilter: Record<string, AgGridFilter> = {
		likes: {
			filterType: "number",
			operator: "AND",
			conditions: [
				{
					filterType: "number",
					type: "greaterThanOrEqual",
					filter: 500
				},
				{
					filterType: "number",
					type: "lessThanOrEqual",
					filter: 750
				}
			]
		},
		title: {
			filterType: "text",
			type: "notEqual",
			filter: "Testing"
		}
	};

	const clientQueryFilters = deriveClientQueryFiltersFromAgGridFilters(agGridFilter);

	expect(clientQueryFilters).toEqual([
		{
			operator: FilterOperator.And,
			filters: [
				{
					column: "Likes",
					operator: FilterOperator.GreaterThanOrEqualTo,
					operand: 500
				},
				{
					column: "Likes",
					operator: FilterOperator.LessThanOrEqualTo,
					operand: 750
				}
			]
		},
		{
			column: "Title",
			operator: FilterOperator.NotEqualTo,
			operand: "Testing"
		}
	]);
});

test("Correctly derives empty filter", () => {
	const agGridFilter: Record<string, AgGridFilter> = { };

	const clientQueryFilters = deriveClientQueryFiltersFromAgGridFilters(agGridFilter);

	expect(clientQueryFilters).toEqual(undefined);
});
