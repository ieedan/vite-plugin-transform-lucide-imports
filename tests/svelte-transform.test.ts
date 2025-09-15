import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { transform } from "@vite-plugin-transform-lucide-imports/svelte";

// test cases are written under ./cases
// and should include a in.svelte file and a out.svelte file

type Case = {
	name: string;
	in: string;
	out: string;
};

const cases: Case[] = [];

// build up test cases
const casesDir = "./svelte/cases";

const dirs = fs.readdirSync(casesDir);

for (const dir of dirs) {
	const casePath = path.join(casesDir, dir);

	const testCase: Case = { name: dir, in: "", out: "" };

	const files = fs.readdirSync(casePath);

	for (const file of files) {
		if (file === "out.svelte") {
			testCase.out = fs.readFileSync(path.join(casePath, file)).toString();
		} else if (file === "in.svelte") {
			testCase.in = fs.readFileSync(path.join(casePath, file)).toString();
		}
	}

	cases.push(testCase);
}

for (const c of cases) {
	describe(c.name, () => {
		it("Transforms imports correctly", async () => {
            const transformed = await transform(c.in);
			expect(transformed).toBe(c.out);
		});
	});
}
