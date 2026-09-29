import * as configs from "@tommy-mitchell/eslint-config-xo";

/** @type {import('xo').FlatXoConfig} */
export default [...configs.xo, ...configs.dprint, {
	rules: {
		"@typescript-eslint/strict-boolean-expressions": "off",
		"unicorn/no-process-exit": "off",
		"unicorn/single-line-block-comment-style": "off",
	},
}, {
	files: "package.json",
	rules: {
		"package-json/dependency-version-range": ["error", {
			exceptions: ["typescript"],
		}],
	},
}];
