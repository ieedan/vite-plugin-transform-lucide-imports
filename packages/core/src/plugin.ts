import type { Plugin } from "vite";
import { transform as coreTransform } from "./transform";

export const SUPPORTED_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs"];

export const plugin = (): Plugin => ({
	name: "transform-lucide-imports",
	enforce: 'pre',
	async transform(code, fileName) {
		if (!SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext))) return {};

		return { code: coreTransform(code) };
	},
});
