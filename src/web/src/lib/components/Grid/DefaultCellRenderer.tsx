import type React from "react";

export interface CellRendererProps<T = unknown> {
	value: T;
	onChange: (value: T) => void;
}

export type CellRenderer<T = unknown> = React.FC<CellRendererProps<T>>;

export const DefaultCellRenderer: CellRenderer = (props: CellRendererProps) => {
	if (typeof props.value === "string") {
		return <DefaultStringCellRenderer value={props.value} onChange={props.onChange} />;
	}

	if (typeof props.value === "number") {
		return <DefaultNumberCellRenderer value={props.value} onChange={props.onChange} />;
	}

	if (typeof props.value === "boolean") {
		return <DefaultBooleanCellRenderer value={props.value} onChange={props.onChange} />;
	}

	return <span>⚠️</span>;
};

const DefaultStringCellRenderer: CellRenderer<string> = (props: CellRendererProps<string>) => {
	return <span>{props.value}</span>;
};

const DefaultNumberCellRenderer: CellRenderer<number> = (props: CellRendererProps<number>) => {
	return <span>{props.value}</span>;
};

const DefaultBooleanCellRenderer: CellRenderer<boolean> = (props: CellRendererProps<boolean>) => {
	return <span>{props.value ? "✅" : "❌"}</span>;
};
