import styles from "@/lib/components/Grid/GridHeaderRow.module.css";
import type { ColumnDefinition } from "@/lib/components/Grid/ColumnDefinition";
import type { ClientQueryOptions } from "@/lib/querying/ClientQueryOptions";

export interface GridHeaderRowProps {
	columnDefinitions: ColumnDefinition[];
	queryOptions: ClientQueryOptions;
	onQueryOptionsChange: (options: ClientQueryOptions) => void;
}

export const GridHeaderRow = (props: GridHeaderRowProps): React.JSX.Element => {
	const {
		columnDefinitions
	} = props;

	return (
		<tr className={styles.gridHeaderRow}>
			{
				columnDefinitions.map(x => (
					<th key={x.column} className={x.canSort !== false ? styles.sortable : undefined}>{x.header || x.column}</th>
				))
			}
		</tr>
	);
};
