import styles from "@/lib/components/Grid/Grid.module.css";
import type { UseQueryResult } from "@tanstack/react-query";
import type { ColumnDefinition } from "@/lib/components/Grid/ColumnDefinition";
import { GridRow } from "@/lib/components/Grid/GridRow";
import React, { useEffect, useMemo, useRef, useState, type Key } from "react";
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

	const [headerWidths, setHeaderWidths] = useState<number[]>([]);

	const data = useMemo(() => forQuery.data || [], [forQuery.data]);
	const keyPropertyName = useMemo(() => props.keyPropertyName || "id", [props.keyPropertyName]);
	const columnDefinitions = useMemo(() => props.columnDefinitions || deriveColumnDefinitions(data, keyPropertyName), [props.columnDefinitions, data]);
	const onQueryOptionsChange = useMemo(() => props.onQueryOptionsChange || (() => {}), [props.onQueryOptionsChange]);
	const bodyStyle: React.CSSProperties = useMemo(() => height ? { height } : { }, [height]);

	const bodyRef = useRef<HTMLDivElement>(null);

	useEffect(() => calculateHeaderWidths(bodyRef.current, setHeaderWidths), [data]);

	const rows = data as Record<string, unknown>[];

	return (
		<div className={styles.grid}>
			<div className={styles.gridHeader}>
				<table>
					<thead>
						<tr>
							{
								columnDefinitions.map((x, i) => {
									const width = headerWidths[i] ? `${headerWidths[i]}%` : "auto";
									return <th key={x.column} style={{ width }}>{x.header || x.column}</th>;
								})
							}
						</tr>
					</thead>
				</table>
			</div>
			<div ref={bodyRef} className={styles.gridBody} style={bodyStyle}>
				<table>
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

const calculateHeaderWidths = (body: HTMLDivElement | null, setHeaderWidths: (value: number[]) => void): void => {
	setTimeout(() => {
		if (!body) {
			return;
		}

		const fullWidth = body.getBoundingClientRect().width;
		const tableBody = body.querySelector("table > tbody");
		if (!tableBody) {
			return;
		}

		const tableWidth = tableBody.getBoundingClientRect().width;
		const scrollWidth = fullWidth - tableWidth;

		const firstRow = body.querySelector("table > tbody > tr");
		if (!firstRow) {
			return;
		}

		const cells = Array.from(firstRow.querySelectorAll("td"));
		const widths = cells.map((x, i) => {
			let width = x.getBoundingClientRect().width;
			if (i === cells.length - 1) {
				width += scrollWidth;
			}

			return Math.round((width / fullWidth) * 100);
		});

		setHeaderWidths(widths);

		console.log("####", "Full Width", fullWidth, "Table Width", tableWidth, "Scroll Width", scrollWidth, "Widths", widths);
	});
};
