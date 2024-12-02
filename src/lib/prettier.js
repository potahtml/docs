const prettierConfig = {
	parser: 'babel',
	printWidth: 55,
	useTabs: false,
	tabWidth: 2,
	semi: false,
	singleQuote: true,
	quoteProps: 'as-needed',
	jsxSingleQuote: false,
	trailingComma: 'none',
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: 'avoid',
	proseWrap: 'never',
	endOfLine: 'lf',
	singleAttributePerLine: false,
	embeddedLanguageFormatting: 'off',
}

export function prettier(code, playground = false) {
	return globalThis.prettier
		.format(code, {
			plugins: [
				globalThis.prettierPluginBabel,
				globalThis.prettierPluginEstree,
			],
			...prettierConfig,
			printWidth: playground ? 70 : 55,
			bracketSameLine: playground ? true : false,
		})
		.then(code => code.trim())
}
