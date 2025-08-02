import { usePosts } from "@/api/usePosts";
import { Grid } from "@/lib/components/Grid";
import type { ClientQueryOptions } from "@/lib/querying/ClientQueryOptions";
import type React from "react";
import { useState } from "react";

export const PageHome = (): React.JSX.Element => {
	const [queryOptions, setQueryOptions] = useState<ClientQueryOptions>({ });
	const posts = usePosts("E31C78BB-4328-40D2-B460-570CF223580E", queryOptions);

	return (
		<Grid forQuery={posts} onQueryOptionsChange={setQueryOptions} />
	);
};
