import type { Plugin } from "vite";
import { transform as coreTransform, SUPPORTED_EXTENSIONS as CORE_SUPPORTED_EXTENSIONS } from "vite-plugin-transform-lucide-imports";
import { transform as svelteTransform } from "./transform";

export const SUPPORTED_EXTENSIONS = [".svelte"];

export const plugin = (): Plugin => ({
	name: "transform-lucide-imports",
	enforce: 'pre',
	async transform(code, fileName) {
		if (CORE_SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext))) {
			return { code: coreTransform(code) };
		}

		if (SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext))) {
			return { code: await svelteTransform(code) };
		}

		return {};
	},
});
