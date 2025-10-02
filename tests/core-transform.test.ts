import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { transform } from "vite-plugin-transform-lucide-imports";

// test cases are written under ./cases
// and should include a in.ts file and a out.ts file
// if a test does not include an out.ts file then the output should be undefined

type Case = {
	name: string;
	in: string;
	out?: string;
};

const cases: Case[] = [];

// build up test cases
const casesDirs = ["./core/cases"];

const dirs: string[] = casesDirs.flatMap((casesDir) => fs.readdirSync(casesDir).map((dir) => path.join(casesDir, dir)));

for (const dir of dirs) {
	const testCase: Case = { name: dir, in: "" };

	const files = fs.readdirSync(dir);

	for (const file of files) {
		if (file === "out.ts") {
			testCase.out = fs.readFileSync(path.join(dir, file)).toString();
		} else if (file === "in.ts") {
			testCase.in = fs.readFileSync(path.join(dir, file)).toString();
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

describe("transform", () => {
	it("should return undefined and call warn on invalid syntax", () => {
		const warn = vi.fn();
		const transformed = transform("import { }", { warn });
		expect(transformed).toBeUndefined();
		expect(warn).toHaveBeenCalledOnce();
	});
});
