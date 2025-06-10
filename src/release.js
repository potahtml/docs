import fs from 'fs'
import path from 'path'

const read = name => fs.readFileSync(name, { encoding: 'utf8' })

const write = (name, content) => {
	if (!exists(name) || read(name) !== content) {
		fs.writeFileSync(mkdir(name), content)
	}
}

const exists = name => fs.existsSync(name)

const mkdir = dir => {
	fs.mkdirSync(
		/[^\/]+\.[^\/]+$/.test(dir) ? path.dirname(dir) : dir,
		{
			recursive: true,
		},
	)
	return dir
}

export function pre() {
	{
		const importmap = JSON.parse(
			read('./node_modules/pota/src/release/importmap.json'),
		)
		importmap.imports['x/articles/'] = '/pages/@articles/'

		function updateImportMap(file, importmap) {
			const playground = read(file).split('<script type="importmap">')
			playground[0] =
				playground[0] + '<script type="importmap">' + importmap
			playground[1] = playground[1].split('</script>')
			playground[1][0] = ''
			playground[1] = playground[1].join('</script>')

			write(file, playground.flat(Infinity).join(''))
		}

		updateImportMap(
			'./src/pages/@playground/preview/index.html',
			JSON.stringify(importmap, null, 2),
		)
	}
}

export function post() {}
