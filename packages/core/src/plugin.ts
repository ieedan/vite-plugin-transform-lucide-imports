import type { Plugin } from "vite";
import { transform as coreTransform } from "./transform";

export const SUPPORTED_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".svelte"];

export type Options = {
	/**
	 * Override the supported file extensions.
	 * @example
	 * ```ts
	 * import { defineConfig } from "vite";
	 * import transformLucideImports, { SUPPORTED_EXTENSIONS } from "vite-plugin-transform-lucide-imports";
	 *
	 * export default defineConfig({
	 * 	plugins: [
	 * 		transformLucideImports(
	 * 			{
	 * 				extensions: [...SUPPORTED_EXTENSIONS, ".vue"] 
	 * 			}
	 * 		),
	 * 	],
	 * });
	 * ```
	 * 
	 * @default [ ".ts", ".tsx", ".js", ".jsx", ".mjs", ".svelte" ]
	 */
	extensions?: string[];
};

export const plugin = (options?: Options): Plugin => {
	const extensions = options?.extensions ?? SUPPORTED_EXTENSIONS;
	return {
		name: "transform-lucide-imports",
		transform(code, fileName) {
			if (!extensions.some((ext) => fileName.endsWith(ext))) return;

			return {
				code: coreTransform(code, {
					warn: (message: string) => this.warn(message),
				}),
			};
		},
	};
};
