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

Named lucide imports have long been the cause of slow dev server performance. This plugin transforms them into default imports, which are much faster to resolve.

### Before

```ts
import { BarIcon, Foo, Baz as Baz2Icon, type XIcon } from "@lucide/svelte";
```

### After

```ts
import type { XIcon } from "@lucide/svelte";
import BarIcon from "@lucide/svelte/icons/bar";
import Foo from "@lucide/svelte/icons/foo";
import Baz2Icon from "@lucide/svelte/icons/baz";
```

## Svelte

For Svelte use the `@vite-plugin-transform-lucide-imports/svelte` package.

```ts
import { defineConfig } from "vite";
import transformLucideImports from "@vite-plugin-transform-lucide-imports/svelte";

export default defineConfig({
	plugins: [transformLucideImports()],
});
```