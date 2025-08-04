import styles from "@/lib/components/Grid/GridSkeletonRow.module.css";

export interface GridSkeletonRowProps {
	columnCount: number;
}

export const GridSkeletonRow = ({ columnCount }: GridSkeletonRowProps): React.JSX.Element => {
	return (
		<tr className={styles.gridSkeletonRow}>
			{
				Array.from({ length: columnCount }).map((_, i) => (
					<td key={i}>
						<div></div>
					</td>
				))
			}
		</tr>
	);
};
