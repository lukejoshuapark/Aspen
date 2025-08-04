import { usePosts } from "@/api/usePosts";
import type { ColumnDefinition } from "@/lib/components/Grid/ColumnDefinition";
import { Grid } from "@/lib/components/Grid/Grid";
import type { ClientQueryOptions } from "@/lib/querying/ClientQueryOptions";
import type React from "react";
import { useState } from "react";

const columnDefinitions: ColumnDefinition[] = [
	{ column: "title", header: "Title" },
	{ column: "description", header: "Description", canSort: false },
	{ column: "likes", header: "Likes" }
];

export const PageHome = (): React.JSX.Element => {
	const [queryOptions, setQueryOptions] = useState<ClientQueryOptions>({ pagination: { cursor: 0, pageSize: 100 } });
	const posts = usePosts("E31C78BB-4328-40D2-B460-570CF223580E", queryOptions);

	return (
		<>
			<Grid
				forQuery={posts}
				keyPropertyName="id"
				columnDefinitions={columnDefinitions}
				height="400px"
				queryOptions={queryOptions}
				onQueryOptionsChange={setQueryOptions} />

			{JSON.stringify(queryOptions, null, 2)}
		</>
	);
};
