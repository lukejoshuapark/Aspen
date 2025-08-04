import styles from "@/lib/components/Grid/GridHeaderRow.module.css";
import type { ColumnDefinition } from "@/lib/components/Grid/ColumnDefinition";
import { SortDirection, type ClientQueryOptions } from "@/lib/querying/ClientQueryOptions";
import { useCallback } from "react";

export interface GridHeaderRowProps {
	columnDefinitions: ColumnDefinition[];
	multiSort: boolean;
	queryOptions: ClientQueryOptions;
	onQueryOptionsChange: (options: ClientQueryOptions) => void;
}

export const GridHeaderRow = (props: GridHeaderRowProps): React.JSX.Element => {
	const {
		columnDefinitions,
		multiSort,
		queryOptions,
		onQueryOptionsChange
	} = props;

	const onClick = useCallback((columnDefinition: ColumnDefinition, applyMultiSort: boolean) => {
		if (columnDefinition.canSort === false) {
			return;
		}

		const existingSort = (queryOptions.sort || []).find(x => x.column === columnDefinition.column);
		if (existingSort) {
			if (existingSort.direction === SortDirection.Descending) {
				const newSort = (queryOptions.sort || []).filter(x => x.column !== columnDefinition.column);
				onQueryOptionsChange({ ...queryOptions, sort: newSort });
				return;
			}

			const newSort = (queryOptions.sort || []).map(x => x.column === columnDefinition.column
				? { ...x, direction: SortDirection.Descending }
				: x);

			onQueryOptionsChange({ ...queryOptions, sort: newSort });
			return;
		}

		if (multiSort && applyMultiSort) {
			const newSort = [...(queryOptions.sort || []), { column: columnDefinition.column, direction: SortDirection.Ascending }];
			onQueryOptionsChange({ ...queryOptions, sort: newSort });
			return;
		}

		const newSort = [{ column: columnDefinition.column, direction: SortDirection.Ascending }];
		onQueryOptionsChange({ ...queryOptions, sort: newSort });
	}, [queryOptions, onQueryOptionsChange]);

	return (
		<tr className={styles.gridHeaderRow}>
			{
				columnDefinitions.map(x => (
					<th
						key={x.column}
						className={x.canSort !== false ? styles.sortable : undefined}
						onClick={e => onClick(x, e.ctrlKey || e.shiftKey)}>{x.header || x.column}</th>
				))
			}
		</tr>
	);
};

// Add sorting chips and multi-sort.
