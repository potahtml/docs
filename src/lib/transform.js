import { prettier } from './prettier.js'

import { version } from 'pota'

const cacheBurst = '&' + version + 'bb'

const versions = {
	pota: version,
	'@babel/core': '7.28.6',
	'@babel/preset-typescript': '7.28.5',
	'@babel/helper-globals': '7.28.0',
}
export async function transform(code) {
	return Promise.all([
		import(
			'https://esm.sh/pota@' +
				versions.pota +
				'/babel-preset?bundle=all' +
				cacheBurst
		),
		import(
			'https://esm.sh/@babel/preset-typescript@' +
				versions['@babel/preset-typescript'] +
				'?target=es2022&deps=@babel/helper-globals@' +
				versions['@babel/helper-globals'] +
				cacheBurst
		),
		import(
			'https://esm.sh/@babel/core@' +
				versions['@babel/core'] +
				'?target=es2022&bundle=all' +
				cacheBurst
		),
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
