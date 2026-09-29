/* eslint-disable ava/no-ignored-test-files, unicorn/no-top-level-side-effects -- invalid */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import anyTest, { type TestFn } from "ava";
import { Sema } from "async-sema";
import { execa, parseCommandString } from "execa";
import { getExecutableBinPath } from "get-executable-bin-path";
import type { RequireExactlyOne as OneOf } from "type-fest";

export const test = anyTest as TestFn<{
	binPath: string;
	semaphore: string;
}>;

test.before("setup context", async t => {
	t.context.binPath = await getExecutableBinPath({
		map: binPath => binPath.replace("dist", "src").replace(".js", ".ts"),
	});
});

const fixtures: string[] = [];

test.after.always("cleanup fixtures", () => {
	for (const fixture of fixtures) {
		fs.rmSync(fixture, { force: true, recursive: true });
	}
});

const concurrency = Number(process.env["concurrency"]) || 5;
const semaphore = new Sema(concurrency);

test.beforeEach("setup concurrency", async () => {
	await semaphore.acquire();
});

test.afterEach.always(() => {
	semaphore.release();
});

// eslint-disable-next-line @typescript-eslint/naming-convention
export const $ = execa({ all: true, env: { NO_COLOR: "1" }, reject: false });

/** Copies given fixture to a temporary directory and returns copied path. */
const withFixture = (name: string) => {
	const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), "gitignore-to-minimatch-cli-"));
	fixtures.push(temporaryDir);

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
	const cwd = fixture ? withFixture(fixture) : undefined;
	const { all: output, exitCode } = await $(t.context.binPath, parseCommandString(args), { cwd });

	t.is(output, expected ?? error);
	t.is(exitCode, expected ? 0 : 1, "Process exited with incorrect exit code!");
});
