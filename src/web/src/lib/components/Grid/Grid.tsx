import styles from "@/lib/components/Grid/Grid.module.css";
import type { UseQueryResult } from "@tanstack/react-query";
import type { ColumnDefinition } from "@/lib/components/Grid/ColumnDefinition";
import { GridRow } from "@/lib/components/Grid/GridRow";
import React, { useMemo, type Key } from "react";
import type { ClientQueryOptions } from "@/lib/querying/ClientQueryOptions";
import { GridSkeletonRow } from "@/lib/components/Grid/GridSkeletonRow";
import { GridHeaderRow } from "@/lib/components/Grid/GridHeaderRow";

export interface GridProps<T extends object> {
	forQuery: UseQueryResult<T[], Error>;
	keyPropertyName?: string;
	columnDefinitions?: ColumnDefinition[];
	height?: string;
	multiSort?: boolean;
	queryOptions?: ClientQueryOptions;
	onQueryOptionsChange?: (options: ClientQueryOptions) => void;
}

export const Grid = <T extends object>(props: GridProps<T>): React.JSX.Element => {
	const {
		forQuery,
		height
	} = props;

	const data = useMemo(() => forQuery.data || [], [forQuery.data]);
	const keyPropertyName = useMemo(() => props.keyPropertyName || "id", [props.keyPropertyName]);
	const columnDefinitions = useMemo(() => props.columnDefinitions || deriveColumnDefinitions(data, keyPropertyName), [props.columnDefinitions, data]);
	const multiSort = useMemo(() => props.multiSort || true, [props.multiSort]);
	const queryOptions = useMemo(() => props.queryOptions || { }, [props.queryOptions]);
	const onQueryOptionsChange = useMemo(() => props.onQueryOptionsChange || (() => { }), [props.onQueryOptionsChange]);
	const gridStyle: React.CSSProperties = useMemo(() => height ? { height } : { }, [height]);

	const rows = data as Record<string, unknown>[];

	return (
		<div className={styles.grid} style={gridStyle}>
			<table>
				<thead>
					<GridHeaderRow
						columnDefinitions={columnDefinitions}
						multiSort={multiSort}
						queryOptions={queryOptions}
						onQueryOptionsChange={onQueryOptionsChange} />
				</thead>
				<tbody>
					{
						rows.map(x => (
							<GridRow
								key={x[keyPropertyName] as Key}
								row={x}
								columnDefinitions={columnDefinitions}
								onQueryOptionsChange={onQueryOptionsChange} />
						))
					}

					{
						forQuery.isLoading && (Array.from({ length: 10 }).map((_, i) => (
							<GridSkeletonRow key={`skeleton-${i}`} columnCount={columnDefinitions.length || 5} />
						)))
					}
				</tbody>
			</table>
		</div>
	);
};

const deriveColumnDefinitions = <T extends object>(data: T[], keyPropertyName: string): ColumnDefinition[] => {
	if (data.length === 0) {
		return [];
	}

	const row = data[0];

	return Object.keys(row).filter(x => x !== keyPropertyName).map(key => ({
		column: key,
		header: key.charAt(0).toUpperCase() + key.slice(1)
	}));
};
