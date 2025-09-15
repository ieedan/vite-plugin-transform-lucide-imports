/**
 * Normalizes a PascalCase name to a kebab-case name.
 *
 * @example
 * ```ts
 * normalizeName("FooBar") // "foo-bar"
 * normalizeName("FooBarIcon") // "foo-bar"
 * normalizeName("FooBar2") // "foo-bar-2"
 * normalizeName("FooBar2Icon") // "foo-bar-2"
 * ```
 *
 * @param name
 * @returns
 */
export function normalizeName(name: string) {
	if (name.endsWith("Icon")) {
		return pascalToKebab(name.slice(0, -4));
	}

	return pascalToKebab(name);
}

function pascalToKebab(str: string): string {
	let newStr = "";

	for (let i = 0; i < str.length; i++) {
		// is uppercase letter / number (ignoring the first)
		if (i > 0 && (!isLetter(str[i]) || (isLetter(str[i]) && str[i].toUpperCase() === str[i]))) {
			let l = i;

			while (l < str.length && (!isLetter(str[l]) || (isLetter(str[l]) && str[l].toUpperCase() === str[l]))) {
				l++;
			}

			newStr += `${str.slice(i, l - 1).toLocaleLowerCase()}-${str[l - 1].toLocaleLowerCase()}`;

			i = l - 1;

			continue;
		}

		newStr += str[i].toLocaleLowerCase();
	}

	return newStr;
}

const LETTER_REGEX = new RegExp(/[a-zA-Z]/);

function isLetter(char: string): boolean {
	if (char.length > 1) {
		throw new Error(`You probably only meant to pass a character to this function. Instead you gave ${char}`);
	}

	return LETTER_REGEX.test(char);
}

export function startsWithLowercase(str: string): boolean {
	if (str.length === 0) return false;

	return isLetter(str[0]) && str[0].toLowerCase() === str[0];
}
