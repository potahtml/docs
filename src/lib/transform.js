export async function transform(code) {
	return import('https://esm.sh/pota/babel-preset?bundle=all')
		.then(async potaPreset => {
			return await import(
				'https://esm.sh/@babel/core?bundle=all'
			).then(
				babel =>
					babel.transform(code, {
						presets: [[potaPreset.default]],
					}).code,
			)
		})
		.catch(e => {
			console.log('babel in browser cannot transform:', code, e)
			return ''
		})
}
