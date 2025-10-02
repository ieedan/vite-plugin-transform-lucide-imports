<!-- this is really just here to get some icons on a page to test -->

<script lang="ts">
    import { GithubIcon, PackageIcon, CodeXml } from '@lucide/svelte';
</script>

<main class="h-svh bg-slate-800 text-white flex items-center justify-center px-4">
    <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
            <a 
                href="https://github.com/ieedan/vite-plugin-transform-lucide-imports"
                class="hover:opacity-75 transition-opacity flex items-center"
            >
                <GithubIcon class="size-7"/>
            </a>
            <h1 class="text-3xl text-white">
                vite-plugin-transform-lucide-imports
            </h1>
        </div>
        
        <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
                <PackageIcon class="size-4"/>
                <h2>Packages</h2>
            </div>
            <ul class="flex flex-col gap-1 text-sm [--line-height:20px]">
                <li class="flex items-center gap-1">
                    <a 
                        href="https://npmjs.com/package/vite-plugin-transform-lucide-imports" 
                        class="h-(--line-height) flex items-center hover:opacity-75 transition-opacity"
                    >   
                        vite-plugin-transform-lucide-imports
                    </a>
                   <a 
                    href="https://github.com/ieedan/vite-plugin-transform-lucide-imports/tree/main/packages/core" 
                    class="h-(--line-height) hover:opacity-75 transition-opacity flex items-end"
                    >
                        <CodeXml class="size-3.5 mb-0.5"/>
                   </a>
                </li>
            </ul>
        </div>
    </div>
</main>