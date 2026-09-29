import fs from "node:fs/promises";
import { gitignoreToMinimatch } from "@humanwhocodes/gitignore-to-minimatch";

/** Returns contents of `.gitignore` at given `path`, or returns `undefined` if file not found or readable. */
export async function readGitignore(path: string): Promise<string | undefined> {
	try {
		const stats = await fs.stat(path);
		if (!stats.isFile()) {
			return undefined;
		}
	} catch {
		return undefined;
	}

	try {
		return await fs.readFile(path, "utf8");
	} catch {
		return undefined;
	}
}

export function convertAndPrint(input: string[]): void {
	const patterns = input.map(p => p.trim()).filter(Boolean).filter(p => !p.startsWith("#"));

	for (const pattern of patterns) {
		const glob = gitignoreToMinimatch(pattern);
		console.log(glob);
	}
}
