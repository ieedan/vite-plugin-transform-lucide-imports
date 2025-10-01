import { describe, it, expect } from "vitest";
import { normalizeName } from "vite-plugin-transform-lucide-imports";

describe("normalizeName", () => {
	it("should properly normalize pascal case names", () => {
		expect(normalizeName("FooBar")).toBe("foo-bar");
		expect(normalizeName("FooBar2")).toBe("foo-bar-2");
	});

	it("should remove icon suffix and normalize the name", () => {
		expect(normalizeName("FooBarIcon")).toBe("foo-bar");
		expect(normalizeName("FooBar2Icon")).toBe("foo-bar-2");
	});
});
