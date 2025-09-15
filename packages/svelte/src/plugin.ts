import type { Plugin } from "vite";
import { transform, SUPPORTED_EXTENSIONS as CORE_SUPPORTED_EXTENSIONS } from "../../core/dist/index.mjs";
import { transform as svelteTransform } from "./transform";

export const SUPPORTED_EXTENSIONS = [".svelte"];

export const plugin = (): Plugin => {
	return {
		name: "vite-plugin-transform-lucide-imports",
		transform: async (code, fileName) => {
			if (CORE_SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext))) {
				return transform(code);
			}

			if (SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext))) {
				return svelteTransform(code);
			}
		},
	};
};
