import styles from "@/lib/components/LegacyGrid.module.css";
import filterIcon from "@/assets/filter.svg";
import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { type ClientQueryOptions } from "@/lib/querying/ClientQueryOptions";
import type { LimitPropertiesByType } from "@/lib/typing/LimitPropertiesByType";
import { toTitleCase } from "@/lib/text/toTitleCase";

export interface LegacyGridProps<T extends object> {
	forQuery: UseQueryResult<T[], Error>;
	keyPropertyName: keyof LimitPropertiesByType<T, string | number>;
	onQueryOptionsChange: (options: ClientQueryOptions) => void;
}

export const LegacyGrid = <T extends object>(props: LegacyGridProps<T>): React.JSX.Element => {
	const {
		forQuery,
		keyPropertyName
	} = props;

	const columns = useMemo(() => {
		if (!forQuery.data?.length) {
			return [];
		}

		return Object.keys(forQuery.data[0]).filter(x => x !== keyPropertyName);
	}, [keyPropertyName, forQuery.data]);

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
		<div className={styles.grid}>
			<table>
				<thead>
					<tr>
						{columns.map((column) => (
							<th key={column}>
								<div>
									<span>{toTitleCase(column)}</span>
									<img src={filterIcon} />
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{forQuery.data.map(x => (
						<tr key={x[keyPropertyName] as string | number}>
							{columns.map((column) => (
								<td key={column}>{String(x[column as keyof T])}</td>
							))}
						</tr>
					))}
				</tbody>
				<tfoot>
					<tr>
						<td colSpan={columns.length}>
							Hello!
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
};
