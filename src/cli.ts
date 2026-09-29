#!/usr/bin/env node
import process from "node:process";
import { findUp } from "find-up-simple";
import logSymbols from "log-symbols";
import meow from "meow";
import * as helpers from "./helpers.ts";

// dprint-ignore
const cli = meow(`
	Usage
	  $ gitignore-to-glob […]

	Options
	  --input  -i  Path to .gitignore file
	  --help   -h  Show this help message

	Examples
	  Read from .gitignore, searching up
	  $ gitignore-to-glob

	  Read from given file
	  $ gitignore-to-glob -i path/to/.gitignore

	  Convert inputs
	  $ gitignore-to-glob "foo" "/*.bar" "baz/"
	  **/foo
	  /*.bar
	  **/baz/**
`, {
	description: false,
	flags: {
		help: {
			shortFlag: "h",
			type: "boolean",
		},
		input: {
			shortFlag: "i",
			type: "string",
		},
	},
	importMeta: import.meta,
});

const { flags, input } = cli;

if (input.length === 0) {
	const gitignorePath = flags.input ?? await findUp(".gitignore") ?? "";
	const content = await helpers.readGitignore(gitignorePath);

	if (!content) {
		console.error(`${logSymbols.error} No .gitignore file found.`);
		process.exit(1);
	}

	helpers.convertAndPrint(content.split("\n"));
} else {
	helpers.convertAndPrint(input);
}
