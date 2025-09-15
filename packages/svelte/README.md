# @vite-plugin-transform-lucide-imports/svelte

[![npm version](https://flat.badgen.net/npm/v/@vite-plugin-transform-lucide-imports/svelte?color=pink)](https://npmjs.com/package/@vite-plugin-transform-lucide-imports/svelte)
[![npm downloads](https://flat.badgen.net/npm/dm/@vite-plugin-transform-lucide-imports/svelte?color=pink)](https://npmjs.com/package/@vite-plugin-transform-lucide-imports/svelte)
[![license](https://flat.badgen.net/github/license/ieedan/vite-plugin-transform-lucide-imports?color=pink)](https://github.com/ieedan/vite-plugin-transform-lucide-imports/blob/main/LICENSE)

Transform named lucide imports into default imports.

```sh
pnpm install @vite-plugin-transform-lucide-imports/svelte -D
```

```ts
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import transformLucideImports from "@vite-plugin-transform-lucide-imports/svelte";

export default defineConfig({
	plugins: [transformLucideImports(), sveltekit()],
});
```

**Before**

```svelte
<script lang="ts">
    import { BarIcon, Foo, Baz as Baz2Icon, type XIcon } from "@lucide/svelte";
</script>

<!-- ... -->
```

**After**

```svelte
<script lang="ts">
    import type { XIcon } from "@lucide/svelte";
	import BarIcon from "@lucide/svelte/icons/bar";
	import Foo from "@lucide/svelte/icons/foo";
	import Baz2Icon from "@lucide/svelte/icons/baz";
</script>

<!-- ... -->
```

## Why use this plugin?

Named lucide imports have long been the cause of slow dev server performance. This plugin transforms them into default imports, which are much faster to resolve.

### Why not just use default imports?

Named imports have a few advantages over default imports:

-   Better autocomplete
-   Less verbose
-   LLMs love to use named imports
