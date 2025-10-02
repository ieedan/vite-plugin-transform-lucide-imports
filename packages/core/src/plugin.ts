import type { Plugin } from "vite";
import { transform as coreTransform } from "./transform";

export const SUPPORTED_EXTENSIONS = [
	".ts",
	".tsx",
	".js",
	".jsx",
	".mjs",
	".svelte",
];

type Options = { extensions?: string[] };
export const plugin = (options?: Options): Plugin => {
	const extensions = options?.extensions ?? SUPPORTED_EXTENSIONS;
	return {
		name: "transform-lucide-imports",
		transform(code, fileName) {
			if (!extensions.some((ext) => fileName.endsWith(ext))) return;

			return { code: coreTransform(code) };
		},
	};
};
