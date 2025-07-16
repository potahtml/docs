import { prettier } from './prettier.js'

export async function transform(code) {
	return Promise.all([
		import('https://esm.sh/@babel/core@7.25.9?target=es2022'),
		import(
			'https://esm.sh/@babel/preset-typescript@7.27.1?bundle=all&keep-names'
		),
		import(
			'https://esm.sh/pota/babel-preset?bundle=all&keep-names&deps=@babel/core@7.25.9'
		),
	])
		.then(imports => {
			const [babel, typescript, pota] = imports

			return prettier(
				babel.transform(code, {
					filename: 'file.tsx',
					presets: [[typescript.default], [pota.default]],
				}).code,
			)
		})
		.catch(e => 'Error:' + e.message)
}
