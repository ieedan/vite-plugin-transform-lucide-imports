import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	dts: true,
	external: ["vite"],
	treeshake: true,
	format: ["esm"],
});
