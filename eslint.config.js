import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin";

export default [
	{
		files: ["**/*.{js,mjs,cjs,ts,vue}"],
		rules: {
			"no-console": "error",
			"@typescript-eslint/no-explicit-any": "error",
		},
	},
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs["flat/essential"],
	{
		files: ["**/*.vue"],
		rules: {
			"vue/multi-word-component-names": "off",
			"vue/require-v-for-key": "error",
			"vue/no-multiple-template-root": "off",
		},
		languageOptions: { parserOptions: { parser: tseslint.parser } },
	},
	stylistic.configs.customize({
		indent: [2, "spaces"],
		noTabs: 0,
		quotes: "double",
		semi: true,
		arrowParens: true,
	}),
];

