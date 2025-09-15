import type { Plugin } from "vite";
import { transform } from "./transform";

export const SUPPORTED_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs"];

export const plugin = (): Plugin => {
	return {
		name: "vite-plugin-transform-lucide-imports",
		transform: async (code, fileName) => {
			if (!SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext))) return;

			return transform(code);
		},
	};
};
