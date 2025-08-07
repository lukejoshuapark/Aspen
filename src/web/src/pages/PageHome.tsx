import { listPosts, usePosts } from "@/api/usePosts";
import type { ColumnDefinition } from "@/lib/components/Grid/ColumnDefinition";
import { Grid } from "@/lib/components/Grid/Grid";
import { SortDirection, type ClientQueryOptions } from "@/lib/querying/ClientQueryOptions";
import type { IDatasource } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import type React from "react";
import { useState } from "react";

const columnDefinitions: ColumnDefinition[] = [
	{ column: "title", header: "Title" },
	{ column: "description", header: "Description", canSort: false },
	{ column: "likes", header: "Likes" },
	{ column: "published", header: "Published" }
];

export const PageHome = (): React.JSX.Element => {
	return (
		<>
			<PrebuiltGrid />
			<hr />
			<CustomGrid />
		</>
	);
};

const PrebuiltGrid = () => {
	return (
		<>
			<div style={{ height: "512px" }}>
				<AgGridReact
					rowModelType="infinite"
					datasource={datasource}
					columnDefs={[
						{ field: "title", filter: "agTextColumnFilter" },
						{ field: "description", filter: true },
						{ field: "likes", filter: "agNumberColumnFilter" },
						{ field: "published", filter: true }
					]} />
			</div>
		</>
	);
};

const CustomGrid = () => {
	const [queryOptions, setQueryOptions] = useState<ClientQueryOptions>({ pagination: { cursor: 0, pageSize: 10 } });
	const posts = usePosts("E31C78BB-4328-40D2-B460-570CF223580E", queryOptions);

	return (
		<>
			<Grid
				forQuery={posts}
				keyPropertyName="id"
				columnDefinitions={columnDefinitions}
				height="512px"
				queryOptions={queryOptions}
				onQueryOptionsChange={setQueryOptions} />

			{JSON.stringify(queryOptions, null, 2)}
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

		console.log("Filter", filterModel);

		listPosts("E31C78BB-4328-40D2-B460-570CF223580E", {
			pagination: {
				cursor: startRow,
				pageSize: endRow - startRow
			},
			sort: sortModel.map(x => ({ column: x.colId, direction: x.sort === "desc" ? SortDirection.Descending : SortDirection.Ascending }))
		})
			.then(data => successCallback(data, data.length < endRow - startRow ? endRow : -1))
			.catch(() => failCallback());
	}
};
