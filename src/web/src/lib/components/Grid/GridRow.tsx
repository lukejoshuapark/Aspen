// import styles from "@/lib/components/Grid/GridRow.module.css";
import type { ColumnDefinition } from "@/lib/components/Grid/ColumnDefinition";
import { GridCell } from "@/lib/components/Grid/GridCell";
import type { ClientQueryOptions } from "@/lib/querying/ClientQueryOptions";

export interface GridRowProps {
	row: Record<string, unknown>;
	columnDefinitions: ColumnDefinition[];
	onQueryOptionsChange: (options: ClientQueryOptions) => void;
}

export const GridRow = (props: GridRowProps): React.JSX.Element => {
	const {
		columnDefinitions,
		row
	} = props;

	return (
		<tr>
			{
				columnDefinitions.map(x => (
					<GridCell key={x.column} columnDefinition={x} value={row[x.column]} />
				))
			}
		</tr>
	);
};
