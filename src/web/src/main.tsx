import "@/base.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PageHome } from "@/pages/PageHome";
import { ModuleRegistry, InfiniteRowModelModule, NumberFilterModule, TextFilterModule, PaginationModule, ColumnAutoSizeModule, ValidationModule } from "ag-grid-community";

ModuleRegistry.registerModules([
	InfiniteRowModelModule,
	NumberFilterModule,
	TextFilterModule,
	PaginationModule,
	ColumnAutoSizeModule,
	ValidationModule
]);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60
		}
	}
});

const root = document.getElementById("root");
if (root) {
	createRoot(root).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<PageHome />
			</QueryClientProvider>
		</StrictMode>
	);
}
