import { prettierConfig } from './prettier-config.js'

export function prettier(code) {
	return globalThis.prettier.format(code, {
		plugins: [
			globalThis.prettierPluginBabel,
			globalThis.prettierPluginEstree,
		],
		...prettierConfig,
		printWidth: 70,
	})
}
