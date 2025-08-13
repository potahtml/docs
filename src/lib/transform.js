import { prettier } from './prettier.js'

import { version } from 'pota'

const cacheBurst =
	'&server-do-not-do-that=' + window.location.hostname + version

export async function transform(code) {
	return Promise.all([
		import(
			'https://esm.sh/pota@' +
				version +
				'/babel-preset?bundle=all' +
				cacheBurst
		),
		import(
			'https://esm.sh/@babel/preset-typescript?target=es2022&deps=@babel/helper-globals' +
				cacheBurst
		),
		import('https://esm.sh/@babel/core?bundle=all' + cacheBurst),
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
