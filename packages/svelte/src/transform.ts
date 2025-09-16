import { transform as coreTransform } from "vite-plugin-transform-lucide-imports";
import * as sv from "svelte/compiler";

export async function transform(code: string): Promise<string> {
	const result = await sv.preprocess(code, {
		script: async ({ content }) => {
			return { code: coreTransform(content) };
		},
	});

	return result.code;
}
