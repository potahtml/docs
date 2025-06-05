import { prettier } from './prettier.js'

export async function transform(code) {
	return Promise.all([
		import('https://esm.sh/@babel/core?bundle=all'),
		import('https://esm.sh/@babel/preset-typescript?bundle=all'),
		import('https://esm.sh/pota/babel-preset?bundle=all'),
	])
		.then(imports => {
			const [babel, typescript, pota] = imports

			return prettier(
				babel.transform(code, {
					filename: 'bla.tsx',
					presets: [[typescript.default], [pota.default]],
				}).code,
			)
		})
		.catch(e => 'Error:' + e.message)
}
