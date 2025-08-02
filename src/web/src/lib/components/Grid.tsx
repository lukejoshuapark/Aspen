import type { UseQueryResult } from "@tanstack/react-query";
import { FilterOperator, type ClientQueryOptions } from "@/lib/querying/ClientQueryOptions";
import { useCallback, useMemo } from "react";

export interface GridProps<T> {
	forQuery: UseQueryResult<T[], Error>;
	onQueryOptionsChange?: (options: ClientQueryOptions) => void;
}

export const Grid = <T,>(props: GridProps<T>): React.JSX.Element => {
	const {
		forQuery,
		onQueryOptionsChange
	} = props;

	const columns = useMemo(() => forQuery.data?.length ? Object.keys(forQuery.data[0]) : [], [forQuery.data]);

	const onFilter = useCallback(() => {
		if (!onQueryOptionsChange) {
			return;
		}

		onQueryOptionsChange({ filter: [ { column: "Likes", operator: FilterOperator.EqualTo, operand: 997 } ] });
	}, [onQueryOptionsChange]);

	if (forQuery.error) {
		return (
			<div>
				{forQuery.error.message}
			</div>
		);
	}

	if (!forQuery.data) {
		return (
			<div>
				Loading...
			</div>
		);
	}

	return (
		<>
			{onQueryOptionsChange && <button onClick={onFilter}>Filter</button>}
			<div>
				{forQuery.data.map((x, i) => (
					<div key={i}>
						{JSON.stringify(x)}
					</div>
				))}
			</div>
		</>
	);
};
