import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import transformLucideImports from "vite-plugin-transform-lucide-imports";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), transformLucideImports()],
});
