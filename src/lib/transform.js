import { prettier } from './prettier.js'

export async function transform(code) {
	return import('https://esm.sh/pota/babel-preset?bundle=all').then(
		module =>
			globalThis.Babel.transform(code, {
				presets: [[module.default]],
			}).code,
	)
}
