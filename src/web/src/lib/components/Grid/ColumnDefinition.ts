import type { CellRenderer } from "@/lib/components/Grid/DefaultCellRenderer";

export interface ColumnDefinition {
	column: string;
	header?: string;
	renderer?: CellRenderer<unknown>;
}
