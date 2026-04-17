import { prettier } from './prettier.js'

export async function transform(code) {
	return prettier(
		globalThis.Babel.transform(code, {
			filename: 'file.tsx',
			presets: ['pota'],
		}).code,
	).catch(e => 'Error:' + e.message)
}
