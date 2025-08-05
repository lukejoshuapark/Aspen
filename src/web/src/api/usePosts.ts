import { hashClientOptions, type ClientQueryOptions } from "@/lib/querying/ClientQueryOptions";
import { useQuery } from "@tanstack/react-query";

export interface PostResponseModel {
	readonly id: string;
	readonly title: string;
	readonly description: string;
	readonly likes: number;
	readonly published: boolean;
}

export const usePosts = (userId: string, queryOptions: ClientQueryOptions) => {
	return useQuery({
		queryKey: ["posts", userId, hashClientOptions(queryOptions)],
		queryFn: async () => listPosts(userId, queryOptions)
	});
};

export const listPosts = async (userId: string, queryOptions: ClientQueryOptions): Promise<PostResponseModel[]> => {
	const res = await fetch(`http://localhost:42070/post/${userId}`, {
		body: JSON.stringify(queryOptions),
		cache: "no-cache",
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (!res.ok) {
		throw new Error("Couldn't fetch posts");
	}

	const data: PostResponseModel[] = await res.json();
	return data;
};
