import { prettier } from './prettier.js'

const time = Date.now()

export async function transform(code) {
	return Promise.all([
		import('https://esm.sh/pota/babel-preset?bundle=all&bla=' + time),
		import(
			'https://esm.sh/@babel/preset-typescript?target=es2022&deps=@babel/helper-globals&bla=' +
				time
		),
		import('https://esm.sh/@babel/core?bundle=all&bla=' + time),
		//	,
	])
		.then(imports => {
			const [
				//
				pota,
				//
				typescript,
				//
				babel,
				//
			] = imports

			return prettier(
				babel.transform(code, {
					filename: 'file.tsx',
					presets: [[typescript.default], [pota.default]],
				}).code,
			)
		})
		.catch(e => 'Error:' + e.message)
}
