import * as configs from "@tommy-mitchell/eslint-config-xo";

/** @type {import('xo').FlatXoConfig} */
export default [...configs.xo, ...configs.dprint, {
	rules: {
		"unicorn/no-process-exit": "off",
	},
}, {
	files: "package.json",
	rules: {
		"package-json/dependency-version-range": ["error", {
			exceptions: ["typescript"],
		}],
	},
}, {
	// TODO: move to @tommy-mitchell/eslint-config-xo, remove --legacy-peer-deps
	rules: {
		"@typescript-eslint/strict-boolean-expressions": "off",
		"node-test/no-import-test-files": "off",
		"unicorn/single-line-block-comment-style": "off",
	},
}];
