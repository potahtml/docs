import fs from 'fs'

const template = `\`{

	"imports": {
"pota": "/node_modules/pota/src/@main.js",

"pota/babel-preset": "/node_modules/pota/babel-preset/index.js",
"pota/jsx-runtime": "/node_modules/pota/src/jsx-runtime.js",

"pota/html": "/node_modules/pota/src/html.js",
"pota/web": "/node_modules/pota/src/web/@main.js",

__PLUGIN__,

__LIB__,

"x/articles/": "/pages/%40articles/"
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

	// pota.docs
	const files = [
		'./src/pages/@playground/preview/importmap.js',
		'./src/pages/@playground/default-importmap.js',
	]
	for (const file of files) {
		const original = fs
			.readFileSync(file, 'utf8')
			.split('/* IMPORT MAP REPLACER */')

		if (original[1] !== importmap) {
			original[1] = importmap

			fs.writeFileSync(
				file,
				original.join('/* IMPORT MAP REPLACER */'),
				'utf8',
			)
		}
	}

	// pota.templates
	const r = fs.readFileSync(
		'../pota.templates/html/index.html',
		'utf8',
	)

	fs.writeFileSync(
		'../pota.templates/html/index.html',
		r.replace(
			/<script type="importmap">([^<]+)<\/script>/gi,
			'<script type="importmap">' +
				importmap
					.replaceAll(
						'"/node_modules/',
						'"https://pota.quack.uy/node_modules/',
					)
					.slice(1, -1) +
				'</script>',
		),
		'utf8',
	)
}

export function post() {}

/*// bump version number
$('npm version patch --git-tag-version false')

// read version number
import('./package.json', {
	assert: { type: 'json' },
}).then(json => {
	// write version number to ./src/version.js
	const version = json.default.version
	fs.writeFileSync(
		'./src/version.js',
		"export const version = '" + version + "'",
	)

	// git add, commit with version number
	$('git add --all')
	$('git commit -m "v' + version + '"')

	// git push / npm publish
	$('git push --all --prune')
	$('npm publish')
})
*/
