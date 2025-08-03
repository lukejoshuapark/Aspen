import styles from "@/lib/components/Grid/Grid.module.css";
import type { UseQueryResult } from "@tanstack/react-query";
import type { ColumnDefinition } from "@/lib/components/Grid/ColumnDefinition";
import { GridRow } from "@/lib/components/Grid/GridRow";
import React, { useMemo, type Key } from "react";
import type { ClientQueryOptions } from "@/lib/querying/ClientQueryOptions";

export interface GridProps<T extends object> {
	forQuery: UseQueryResult<T[], Error>;
	keyPropertyName?: string;
	columnDefinitions?: ColumnDefinition[];
	height?: string;
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
	const onQueryOptionsChange = useMemo(() => props.onQueryOptionsChange || (() => {}), [props.onQueryOptionsChange]);
	const gridStyle: React.CSSProperties = useMemo(() => height ? { height } : { }, [height]);

	const rows = data as Record<string, unknown>[];

	return (
		<div className={styles.grid} style={gridStyle}>
			<table>
				<thead>
					<tr>
						{
							columnDefinitions.map(x => (
								<th key={x.column}>{x.header || x.column}</th>
							))
						}
					</tr>
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
