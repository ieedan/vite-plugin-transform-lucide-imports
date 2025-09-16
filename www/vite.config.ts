import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import transformLucideImports from '@vite-plugin-transform-lucide-imports/svelte';

export default defineConfig({
	plugins: [sveltekit(), transformLucideImports()],
});
