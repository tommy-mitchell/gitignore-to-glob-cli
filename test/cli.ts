import process from "node:process";
import anyTest, { type TestFn } from "ava";
import { Sema } from "async-sema";
import { execa } from "execa";
import { getExecutableBinPath } from "get-executable-bin-path";
// import { atFixture } from "./_utils.ts";

const test = anyTest as TestFn<{
	binPath: string;
	semaphore: string;
}>;

test.before("setup context", async t => {
	t.context.binPath = await getExecutableBinPath({
		map: binPath => binPath.replace("dist", "src").replace(".js", ".ts"),
	});
});

const concurrency = Number(process.env["concurrency"]) || 5;
const semaphore = new Sema(concurrency);

test.beforeEach("setup concurrency", async () => {
	await semaphore.acquire();
});

test.afterEach.always(() => {
	semaphore.release();
});

const $ = execa({ all: true });

for (const flag of ["--help", "-h"]) {
	test(`shows help (${flag})`, async t => {
		const { all: helpText } = await $`${t.context.binPath} ${flag}`;
		t.snapshot(helpText);
	});
}

test.todo("convert input - single");
test.todo("convert input - multiple");
test.todo("read from --input, -i");
test.todo("read from .gitignore in cwd");
test.todo("read from .gitignore, finding up from cwd");
test.todo(".gitignore not found");
