import fs from 'fs'

const read = name => fs.readFileSync(name, { encoding: 'utf8' })

const write = (name, content) =>
	fs.writeFileSync(mkdir(name), content)

const append = (name, content) =>
	fs.appendFileSync(mkdir(name), content)

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

"pota": "/node_modules/pota/src/main.js",

"pota/babel-preset": "/node_modules/pota/babel-preset/index.js",
"pota/jsx-runtime": "/node_modules/pota/src/jsx-runtime.js",

"pota/html": "/node_modules/pota/src/html.js",
"pota/web": "/node_modules/pota/src/web/main.js",

__PLUGIN__,

__LIB__,

"x/articles/": "/pages/@articles/"

}
}\``

export function pre() {
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
		'http://localhost:11433',
	)

	if (read('./src/importmap/importmap.json') !== importmap)
		write('./src/importmap/importmap.json', importmap)
	if (read('./src/importmap/importmap.quack.json') !== importmapQuack)
		write('./src/importmap/importmap.quack.json', importmapQuack)
	if (read('./src/importmap/importmap.local.json') !== importmapLocal)
		write('./src/importmap/importmap.local.json', importmapLocal)
}

export function post() {}
