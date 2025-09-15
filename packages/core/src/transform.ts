import { type Node, walk } from "estree-walker";
import MagicString from "magic-string";
import { Parser } from "acorn";
import { tsPlugin } from "@sveltejs/acorn-typescript";
import { normalizeName } from "./utils";

export function transform(code: string): string {
	const program = Parser.extend(tsPlugin()).parse(code, {
		sourceType: "module",
		ecmaVersion: "latest",
		locations: true,
	});

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
	if (!path.startsWith("@lucide/svelte")) return;
	if (node.specifiers.length === 1 && node.specifiers[0].type === "ImportDefaultSpecifier") {
		return;
	}

	const transformableImports: { original: string; new: string; node: Node }[] = [];

	const typedImports: { original: string; node: Node }[] = [];

	for (const specifier of node.specifiers) {
		if (specifier.type === "ImportSpecifier") {
			if (specifier.importKind === "type") {
				typedImports.push({
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

	if (typedImports.length === 0) {
		s.remove(node.start, node.end);
	} else {
		s.replace(
			s.slice(node.start, node.end),
			`import type { ${typedImports.map(({ original }) => original).join(", ")} } from '@lucide/svelte';`
		);
	}

	for (const { original, new: newName } of transformableImports) {
		const newImport = `\nimport ${newName} from '@lucide/svelte/icons/${normalizeName(original)}';`;
		s.appendLeft(node.end, newImport);
	}
}
