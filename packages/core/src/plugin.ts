import type { Plugin } from "vite";
import { transform } from "./transform";

export const SUPPORTED_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs"];

type TransformImportOptions = {};

export const plugin = (_: TransformImportOptions = {}): Plugin => ({
	name: "transform-lucide-imports",
	enforce: 'pre',
	transform: async (code, fileName) => {
		if (!SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext))) return;

		return transform(code);
	},
})
