import { prettier } from './prettier.js'

export async function transform(code) {
	return import('https://esm.sh/pota/babel-preset?bundle=all')
		.then(async potaPreset => {
			return await import(
				'https://esm.sh/@babel/core?bundle=all'
			).then(babel =>
				prettier(
					babel.transform(code, {
						presets: [[potaPreset.default]],
					}).code,
					true,
				),
			)
		})
		.catch(e => 'Error:' + e.message)
}
