# vite-plugin-transform-lucide-imports

[![npm version](https://flat.badgen.net/npm/v/vite-plugin-transform-lucide-imports?color=pink)](https://npmjs.com/package/vite-plugin-transform-lucide-imports)
[![npm downloads](https://flat.badgen.net/npm/dm/vite-plugin-transform-lucide-imports?color=pink)](https://npmjs.com/package/vite-plugin-transform-lucide-imports)
[![license](https://flat.badgen.net/github/license/ieedan/vite-plugin-transform-lucide-imports?color=pink)](https://github.com/ieedan/vite-plugin-transform-lucide-imports/blob/main/LICENSE)

Transform named lucide imports into default imports.

```sh
pnpm install vite-plugin-transform-lucide-imports -D
```

```ts
import { defineConfig } from "vite";
import transformLucideImports from "vite-plugin-transform-lucide-imports";

export default defineConfig({
	plugins: [transformLucideImports()],
});
```

**Before**

```ts
import { BarIcon, Foo, Baz as Baz2Icon, type XIcon } from "lucide";
```

**After**

```ts
import type { XIcon } from "lucide";
import BarIcon from "lucide/icons/bar";
import Foo from "lucide/icons/foo";
import Baz2Icon from "lucide/icons/baz";
```

https://github.com/user-attachments/assets/c2692f80-e8f6-4cb8-942d-8c109db49b5b

## Why use this plugin?

Named lucide imports have long been the cause of slow dev server performance. This plugin transforms them into default imports, which are much faster to resolve.

### Why not just use default imports?

Named imports have a few advantages over default imports:

-   Better autocomplete
-   Less verbose
-   LLMs love to use named imports

## Supported frameworks

-   Svelte (This plugin **MUST** be added _AFTER_ the SvelteKit plugin in the plugins array)
-   React
-   Vanilla JS

## Supporting other frameworks

For frameworks that transpile to a valid JS / JSX syntax you can just pass your file extension to the `extensions` option of the plugin:

```ts
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import transformLucideImports, { SUPPORTED_EXTENSIONS } from "vite-plugin-transform-lucide-imports";

export default defineConfig({
	// the plugin MUST be added after the plugin doing the transpilation
	// you may also want to spread the supported extensions to continue to support other extensions
	plugins: [sveltekit(), transformLucideImports({ extensions: [...SUPPORTED_EXTENSIONS, ".svelte"] })],
});
```

> Feel free to contribute your frameworks extension!

> By default the supported extensions are `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, and `.svelte`.
