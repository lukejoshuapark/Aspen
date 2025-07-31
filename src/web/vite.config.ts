import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
// eslint-disable-next-line no-restricted-syntax
export default defineConfig({
	plugins: [react()],
	server: {
		port: 42071
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src")
		}
	}
});
