import dedent from "dedent";
import { $, test, verifyCli } from "./_util.ts";

for (const flag of ["--help", "-h"]) {
	test(`shows help (${flag})`, async t => {
		const { all: helpText } = await $`${t.context.binPath} ${flag}`;
		t.snapshot(helpText);
	});
}

test("converts input - single", verifyCli, {
	args: "foo.bar",
	expected: "**/foo.bar",
});

test("converts input - multiple", verifyCli, {
	args: "foo /*.bar baz/",
	expected: dedent`
		**/foo/**
		*.bar
		**/baz/**
	`,
});

for (const flag of ["--input", "-i"]) {
	test(`reads from file (${flag})`, verifyCli, {
		args: `${flag} fixture.txt`,
		fixture: "fixture.txt", // eslint-disable-next-line perfectionist/sort-objects
		expected: dedent`
			**/*
			foo/**
			**/foo/**
			**/*.js
			foo/bar/**
			!**/foo?
			./foo.js
			../foo.js
			**/*.js
			**/fixtures/**
			**/fixtures/**
			**/test.js
			!foo/bar/**
		`,
	});

	test(`errors if file is a directory (${flag})`, verifyCli, {
		args: `${flag} cwd`,
		fixture: "find-up", // eslint-disable-next-line perfectionist/sort-objects
		error: "✖ No .gitignore file found.",
	});
}

test("reads from `.gitignore` in cwd", verifyCli, {
	fixture: "cwd", // eslint-disable-next-line perfectionist/sort-objects
	expected: "**/foo/**",
});

test("reads from `.gitignore`, finding up from cwd", verifyCli, {
	fixture: "find-up/cwd", // eslint-disable-next-line perfectionist/sort-objects
	expected: "**/foo/**",
});

test("errors if `.gitignore` not found", verifyCli, {
	fixture: "not-found", // eslint-disable-next-line perfectionist/sort-objects
	error: "✖ No .gitignore file found.",
});
