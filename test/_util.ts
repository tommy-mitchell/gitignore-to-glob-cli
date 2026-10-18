/* eslint-disable ava/no-ignored-test-files, unicorn/no-top-level-side-effects -- invalid */
import fs from "node:fs";
import path from "node:path";
import anyTest, { type ExecutionContext, type TestFn } from "ava";
import {
	$$,
	type ConcurrencyContext,
	getExecutableBinPath,
	parseCommandString,
	withConcurrency,
	withTemporaryDirectory,
} from "@tommy-mitchell/test-helpers";
import type { RequireExactlyOne as OneOf } from "type-fest";

export const test = anyTest as TestFn<{
	binPath: string;
	concurrency: ConcurrencyContext;
}>;

test.before("setup context", async t => {
	t.context.binPath = await getExecutableBinPath({
		map: binPath => binPath.replace("dist", "src").replace(".js", ".ts"),
	});

	t.context.concurrency = await withConcurrency();
	t.log("CLI concurrency:", t.context.concurrency.max);
});

test.beforeEach("setup concurrency", async t => {
	await t.context.concurrency.lock();
});

test.afterEach.always(t => {
	t.context.concurrency.unlock();
});

/** Copies given fixture to a temporary directory and returns copied path. */
const withFixture = async (name: string, t: ExecutionContext) => {
	const temporaryDir = await withTemporaryDirectory(t, "gitignore-to-glob-cli-");

	const fixture = new URL(`fixtures/${name}`, import.meta.url);
	const stats = fs.statSync(fixture);

	// Copy fixture directory and return subdir of fixture in temp dir, if any
	if (stats.isDirectory()) {
		const [fixtureTopLevel, cwd] = name.split("/", 2);
		const fixtureDir = new URL(`fixtures/${fixtureTopLevel}`, import.meta.url);

		fs.cpSync(fixtureDir, temporaryDir, { recursive: true });
		return path.join(temporaryDir, cwd ?? "");
	}

	// Otherwise, copy the fixture file directly and return temp dir
	fs.copyFileSync(fixture, path.join(temporaryDir, name));
	return temporaryDir;
};

type VerifyCliMacroArgs = [
	OneOf<{
		error: string;
		expected: string;
	}> & {
		args?: string;
		fixture?: string;
	},
];

export const verifyCli = test.macro<VerifyCliMacroArgs>(async (t, { args = "", error, expected, fixture }) => {
	const cwd = fixture ? await withFixture(fixture, t) : undefined;
	const { all: output, exitCode } = await $$(t.context.binPath, parseCommandString(args), { cwd });

	t.is(output, expected ?? error);
	t.is(exitCode, expected ? 0 : 1, "Process exited with incorrect exit code!");
});
