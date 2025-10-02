import { type Node, walk } from "estree-walker";
import MagicString from "magic-string";
import { Parser, Program } from "acorn";
import { tsPlugin } from "@sveltejs/acorn-typescript";
import { normalizeName, startsWithLowercase } from "./utils";

type LucidePackage = {
	name: string;
};

const LUCIDE_PACKAGES: LucidePackage[] = [
	{ name: "lucide" },
	{ name: "lucide-react" },
	{ name: "lucide-vue-next" },
	{ name: "lucide-react-native" },
	{ name: "lucide-svelte" },
	{ name: "@lucide/svelte" },
	{ name: "lucide-angular" },
	{ name: "lucide-solid" },
	{ name: "lucide-static" },
	{ name: "lucide-preact" },
	{ name: "@lucide/astro" },
];

export function transform(code: string, { warn }: { warn?: (message: string) => void } = {}): string | undefined {
	let program: Program;
	try {
		program = Parser.extend(tsPlugin()).parse(code, {
			sourceType: "module",
			ecmaVersion: "latest",
			locations: true,
		});
	} catch (err) {
		warn?.(`Could not parse file Error: ${err instanceof Error ? err.message : String(err)}`);
		return;
	}

	const s = new MagicString(code);

	const enter = (node: Node) => {
		if (node.type === "ImportDeclaration") {
			if (typeof node.source?.value === "string") {
				transformImports(node.source.value, { node, s });
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

function transformImports(path: string, { node, s }: { node: any; s: MagicString }) {
	// we sort by length to make sure we find the longest matching package
	const lucidePackage = LUCIDE_PACKAGES.sort((a, b) => b.name.length - a.name.length).find((pkg) =>
		path.startsWith(pkg.name)
	);
	if (!lucidePackage) return;
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
