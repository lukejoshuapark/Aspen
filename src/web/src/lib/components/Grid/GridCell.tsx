// import styles from "@/lib/components/Grid/GridCell.module.css";
import type { ColumnDefinition } from "@/lib/components/Grid/ColumnDefinition";
import { DefaultCellRenderer } from "@/lib/components/Grid/DefaultCellRenderer";

export interface GridCellProps {
	columnDefinition: ColumnDefinition;
	value: unknown;
}

export const GridCell = (props: GridCellProps): React.JSX.Element => {
	const {
		columnDefinition,
		value
	} = props;

	const Renderer = columnDefinition.renderer || DefaultCellRenderer;

	return (
		<td>
			<Renderer value={value} onChange={() => {}} />
		</td>
	);
};
