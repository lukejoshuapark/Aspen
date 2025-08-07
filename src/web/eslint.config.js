import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

// eslint-disable-next-line no-restricted-syntax
export default tseslint.config([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"indent": [
				"error",
				"tab"
			],
			"quotes": [
				"error",
				"double"
			],
			"semi": [
				"error",
				"always"
			],
			"no-trailing-spaces": [
				"error"
			],
			"react-hooks/rules-of-hooks": [
				"error"
			],
			"react-hooks/exhaustive-deps": [
				"off"
			],
			"comma-dangle": [
				"error",
				"never"
			],
			"react/react-in-jsx-scope": [
				"off"
			],
			"@typescript-eslint/no-non-null-assertion": [
				"error"
			],
			"no-restricted-syntax": [
				"error",
				{
					"selector": "ExportDefaultDeclaration",
					"message": "Don't use export default - use named exports instead."
				}
			],
			"no-multiple-empty-lines": [
				"error",
				{ max: 1 }
			],
			"no-restricted-imports": [
				"error",
				{
					"patterns": [
						{
							"group": ["../*"],
							"message": "Do not use relative parent imports ('../'). Use paths starting with @."
						},
						{
							"group": ["./*"],
							"message": "Do not use relative imports ('./'). Use paths starting with @."
						}
					]
				}
			]
		}
	}
]);
