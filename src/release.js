import fs from 'fs'
import path from 'path'

const read = name => fs.readFileSync(name, { encoding: 'utf8' })

const write = (name, content) => {
	if (!exists(name) || read(name) !== content) {
		fs.writeFileSync(mkdir(name), content)
	}
}

const exists = name => fs.existsSync(name)

const append = (name, content) =>
	fs.appendFileSync(mkdir(name), content)

const isDirectory = name => fs.statSync(name).isDirectory()

const remove = name => {
	try {
		fs.rmSync(name, { recursive: true })
		if (/[^\/]+\.[^\/]+$/.test(name)) {
			fs.rmdirSync(path.dirname(name))
		}
	} catch (e) {}
}

const move = (source, destination) =>
	fs.renameSync(source, mkdir(destination))

const copy = (source, destination) =>
	fs.copyFileSync(source, mkdir(destination))

const mkdir = dir => {
	fs.mkdirSync(
		/[^\/]+\.[^\/]+$/.test(dir) ? path.dirname(dir) : dir,
		{
			recursive: true,
		},
	)
	return dir
}

const template = `\`{

"imports": {

"pota": "/node_modules/pota/src/@main.js",

"pota/babel-preset": "/node_modules/pota/src/babel-preset/index.js",
"pota/jsx-runtime": "/node_modules/pota/src/jsx/jsx-runtime.js",
"pota/jsx-dev-runtime": "/node_modules/pota/src/jsx/jsx-runtime.js",

"pota/html": "/node_modules/pota/src/html.js",
"pota/components": "/node_modules/pota/src/components/@main.js",

__PLUGIN__,

__LIB__,

"x/articles/": "/pages/@articles/"

}
}\``

export function pre() {
	{
		const plugin = fs
			.readdirSync('../pota/src/plugin')
			.map(file =>
				file.includes('.js')
					? `"pota/plugin/${file.replace(/.js$/, '')}": "/node_modules/pota/src/plugin/${file}"`
					: null,
			)
			.filter(x => x)

		const lib = fs
			.readdirSync('../pota/src/lib')
			.map(file =>
				file.includes('.js')
					? `"pota/${file.replace(/.js$/, '')}": "/node_modules/pota/src/lib/${file}"`
					: null,
			)
			.filter(x => x)

		const importmap = template
			.replace('__PLUGIN__', plugin.join(',\n'))
			.replace('__LIB__', lib.join(',\n'))
			.slice(1, -1)

		const importmapQuack = importmap.replaceAll(
			'"/node_modules/',
			'"https://pota.quack.uy/node_modules/',
		)
		const importmapLocal = importmapQuack.replaceAll(
			'https://pota.quack.uy',
			'',
		)

		write('./src/importmap/importmap.json', importmap)
		write('./src/importmap/importmap.quack.json', importmapQuack)

		function updateImportMap(file, importMap) {
			const playground = read(file).split('<script type="importmap">')
			playground[0] =
				playground[0] + '<script type="importmap">' + importMap
			playground[1] = playground[1].split('</script>')
			playground[1][0] = ''
			playground[1] = playground[1].join('</script>')

			write(file, playground.flat(Infinity).join(''))
		}

		updateImportMap(
			'./src/pages/@playground/preview/index.html',
			importmap,
		)
	}

	{
		const root = '../pota/'
		const files = fs.readdirSync(root, {
			recursive: true,
		})

		const types = []

		for (const file of files) {
			const path = root + file
			if (
				!isDirectory(path) &&
				!path.includes('node_modules') &&
				path.includes('.d.ts') &&
				!path.includes('.d.ts.map')
			) {
				types.push({
					f: path.replace(/\\/g, '/').replace(/^.*pota\//, 'pota/'),
					c: read(path),
				})
			}
		}

		const importMap = JSON.parse(
			read('./src/importmap/importmap.json'),
		)
		for (const moduleName in importMap.imports) {
			if (moduleName === 'pota/jsx-runtime') {
				types.push({
					f: 'pota/jsx-runtime/index.d.ts',
					c: `export * from "pota/@main.d.ts"`,
				})
				types.push({
					f: 'pota/jsx-dev-runtime/index.d.ts',
					c: `export * from "pota/@main.d.ts"`,
				})
			} else {
				types.push({
					f: moduleName + '/index.d.ts',
					c: `export * from "${importMap.imports[moduleName].replace(/^.*\/pota\/src\//, 'pota/types/').replace(/\.js$/, '.d.ts')}"`,
				})
			}
		}

		write(
			'./src/lib/components/monaco/types.json',
			JSON.stringify(types),
		)
	}
}

export function post() {}
