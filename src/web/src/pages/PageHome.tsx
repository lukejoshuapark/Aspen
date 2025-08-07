import { listPosts } from "@/api/listPosts";
import { deriveClientQueryFiltersFromAgGridFilters } from "@/lib/querying/AgGridFilter";
import { SortDirection, type ClientQueryOptions } from "@/lib/querying/ClientQueryOptions";
import { iconSetQuartzBold, themeQuartz, type IDatasource } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import type React from "react";

export const PageHome = (): React.JSX.Element => {
	return (
		<PrebuiltGrid />
	);
};

const PrebuiltGrid = () => {
	return (
		<>
			<div style={{ height: "768px" }}>
				<AgGridReact
					theme={gridTheme}
					rowModelType="infinite"
					datasource={datasource}
					pagination={true}
					paginationAutoPageSize={true}
					autoSizeStrategy={{ type: "fitCellContents" }}
					columnDefs={[
						{ field: "title", filter: "agTextColumnFilter", flex: 1 },
						{ field: "description", filter: true, flex: 2 },
						{ field: "likes", filter: "agNumberColumnFilter" },
						{ field: "published", filter: true }
					]} />
			</div>
		</>
	);
};

const datasource: IDatasource = {
	getRows: params => {
		const {
			startRow,
			endRow,
			successCallback,
			failCallback,
			sortModel,
			filterModel
		} = params;

		const clientQueryOptions: ClientQueryOptions = {
			pagination: {
				cursor: startRow,
				pageSize: endRow - startRow
			},
			sorts: sortModel.map(x => ({ column: x.colId, direction: x.sort === "desc" ? SortDirection.Descending : SortDirection.Ascending })),
			filters: deriveClientQueryFiltersFromAgGridFilters(filterModel)
		};

		listPosts("E31C78BB-4328-40D2-B460-570CF223580E", clientQueryOptions)
			.then(data => successCallback(data, data.length < endRow - startRow ? endRow : -1))
			.catch(() => failCallback());
	}
};

const gridTheme = themeQuartz
	.withPart(iconSetQuartzBold)
	.withParams({
		browserColorScheme: "light",
		fontFamily: {
			googleFont: "Inter"
		},
		fontSize: 12,
		headerFontSize: 12,
		cellHorizontalPaddingScale: 0.8,
		rowVerticalPaddingScale: 0.8
	});
