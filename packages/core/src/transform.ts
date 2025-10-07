import { type Node, walk } from "estree-walker";
import MagicString from "magic-string";
import { Parser, Program } from "acorn";
import { tsPlugin } from "@sveltejs/acorn-typescript";
import { normalizeName, startsWithLowercase } from "./utils";

type LucidePackage = {
	name: string;
	/** These packages are already tree shaken and using this plugin will only break things */
	treeShaken?: boolean;
};

const LUCIDE_PACKAGES: LucidePackage[] = [
	{ name: "lucide", treeShaken: true },
	{ name: "lucide-react", treeShaken: true },
	{ name: "lucide-vue", treeShaken: true },
	{ name: "lucide-vue-next", treeShaken: true },
	{ name: "lucide-react-native" },
	{ name: "lucide-svelte" },
	{ name: "@lucide/svelte" },
	{ name: "lucide-angular", treeShaken: true },
	{ name: "lucide-solid" },
	{ name: "lucide-static" },
	{ name: "lucide-preact", treeShaken: true },
	{ name: "@lucide/astro" },
];

export type Warning = {
	message: string;
	error?: unknown;
	meta?: Record<string, unknown>;
};

export function transform(code: string, { warn }: { warn?: (warning: Warning) => void } = {}): string | undefined {
	let program: Program;
	try {
		program = Parser.extend(tsPlugin()).parse(code, {
			sourceType: "module",
			ecmaVersion: "latest",
			locations: true,
		});
	} catch (err) {
		warn?.({
			message: `Could not parse file Error: ${err instanceof Error ? err.message : String(err)}`,
			error: err,
		});
		return;
	}

	const s = new MagicString(code);

	const enter = (node: Node) => {
		if (node.type === "ImportDeclaration") {
			if (typeof node.source?.value === "string") {
				transformImports(node.source.value, { node, s, warn });
			}
		} else if (node.type === "ImportExpression") {
			if (node.source.type === "Literal" && typeof node.source.value === "string") {
				transformImports(node.source.value, { node, s });
			}
		}
	};

	for (const node of program.body) {
		walk(node as any, { enter });
	}

	return s.toString();
}

function transformImports(
	path: string,
	{ node, s, warn }: { node: any; s: MagicString; warn?: (warning: Warning) => void }
) {
	// we sort by length to make sure we find the longest matching package
	const lucidePackage = LUCIDE_PACKAGES.sort((a, b) => b.name.length - a.name.length).find((pkg) =>
		path.startsWith(pkg.name)
	);
	if (!lucidePackage) return;
	if (lucidePackage.treeShaken) {
		warn?.({
			message: `Skipping optimization of ${path} because ${lucidePackage.name} is already a tree shaken package`,
			meta: {
				packageName: lucidePackage.name,
				path,
			}
		});
		return;
	}
	if (node.specifiers.length === 1 && node.specifiers[0].type === "ImportDefaultSpecifier") {
		return;
	}

	const transformableImports: { original: string; new: string; node: any }[] = [];

	const remainingImports: { original: string; node: any }[] = [];

	for (const specifier of node.specifiers) {
		if (specifier.type === "ImportSpecifier") {
			if (specifier.importKind === "type") {
				remainingImports.push({
					original: specifier.imported.name,
					node: specifier,
				});
				// "Icon" and camelCase imports are reserved and not transformable
			} else if (startsWithLowercase(specifier.imported.name) || specifier.imported.name === "Icon") {
				remainingImports.push({
					original: specifier.imported.name,
					node: specifier,
				});
			} else {
				transformableImports.push({
					original: specifier.imported.name,
					new: specifier.local.name,
					node: specifier,
				});
			}
		}
	}

	if (remainingImports.length === 0) {
		s.remove(node.start, node.end);
	} else {
		// type only imports remaining
		if (remainingImports.filter(({ node }) => node.importKind !== "type").length === 0) {
			s.replace(
				s.slice(node.start, node.end),
				`import type { ${remainingImports.map(({ original }) => original).join(", ")} } from '${
					lucidePackage.name
				}';`
			);
		} else {
			s.replace(
				s.slice(node.start, node.end),
				`import { ${remainingImports
					.map(({ original, node }) => (node.importKind === "type" ? `type ${original}` : original))
					.join(", ")} } from '${lucidePackage.name}';`
			);
		}
	}

	for (const { original, new: newName } of transformableImports) {
		const newImport = `\nimport ${newName} from '${lucidePackage.name}/icons/${normalizeName(original)}';`;
		s.appendLeft(node.end, newImport);
	}
}
