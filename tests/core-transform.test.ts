import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { transform } from "../packages/core/dist/index.mjs";

// test cases are written under ./cases
// and should include a in.ts file and a out.ts file

type Case = {
	name: string;
	in: string;
	out: string;
};

const cases: Case[] = [];

// build up test cases
const casesDir = "./core/cases";

const dirs = fs.readdirSync(casesDir);

for (const dir of dirs) {
	const casePath = path.join(casesDir, dir);

	const testCase: Case = { name: dir, in: "", out: "" };

	const files = fs.readdirSync(casePath);

	for (const file of files) {
		if (file === "out.ts") {
			testCase.out = fs.readFileSync(path.join(casePath, file)).toString();
		} else if (file === "in.ts") {
			testCase.in = fs.readFileSync(path.join(casePath, file)).toString();
		}
	}

	cases.push(testCase);
}

for (const c of cases) {
	describe(c.name, () => {
		it("Transforms imports correctly", () => {
			const transformed = transform(c.in);
			expect(transformed).toBe(c.out);
		});
	});
}
