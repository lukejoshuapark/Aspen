import { usePosts } from "@/api/usePosts";
import { LegacyGrid } from "@/lib/components/LegacyGrid";
import type { ClientQueryOptions } from "@/lib/querying/ClientQueryOptions";
import type React from "react";
import { useState } from "react";

export const PageHome = (): React.JSX.Element => {
	const [queryOptions, setQueryOptions] = useState<ClientQueryOptions>({ pagination: { cursor: 0, pageSize: 1000 } });
	const posts = usePosts("E31C78BB-4328-40D2-B460-570CF223580E", queryOptions);

	return (
		<LegacyGrid forQuery={posts} keyPropertyName="id" onQueryOptionsChange={setQueryOptions} />
	);
};
