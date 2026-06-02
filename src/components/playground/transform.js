// JSX → JS for the live playground. Babel (standalone) and prettier are
// heavy, so we load them lazily — only the first time a live example
// needs to compile. Ported from the old docs site
// (projects/docs/src/lib/{transform,prettier}.js), made on-demand.
//
// Both run in the PARENT page. The preview iframe only ever receives
// already-transformed JS, so it never loads Babel.

// `import(url)` written through Function so Vite/Rolldown leaves the
// absolute CDN URL alone instead of trying to resolve it at build time.
const dynImport = new Function('u', 'return import(u)')

const BABEL_URL =
	'/node_modules/pota/generated/babel-preset-standalone.js'

const PRETTIER = 'https://unpkg.com/prettier@3.3.3'

const prettierConfig = {
	parser: 'babel-ts',
	printWidth: 70,
	useTabs: false,
	tabWidth: 2,
	semi: false,
	singleQuote: true,
	quoteProps: 'as-needed',
	jsxSingleQuote: false,
	trailingComma: 'none',
	bracketSpacing: true,
	bracketSameLine: true,
	arrowParens: 'avoid',
	proseWrap: 'never',
	endOfLine: 'lf',
	singleAttributePerLine: false,
	embeddedLanguageFormatting: 'off',
}

let babelPromise
function loadBabel() {
	if (!babelPromise) {
		babelPromise = new Promise((resolve, reject) => {
			if (globalThis.Babel) return resolve(globalThis.Babel)
			// the standalone build reads process.env.NODE_ENV
			globalThis.process = globalThis.process || {
				env: { NODE_ENV: 'development' },
			}
			const script = document.createElement('script')
			script.src = BABEL_URL
			script.onload = () => resolve(globalThis.Babel)
			script.onerror = () =>
				reject(new Error('failed to load babel-preset-standalone'))
			document.head.append(script)
		})
	}
	return babelPromise
}

let prettierPromise
function loadPrettier() {
	if (!prettierPromise) {
		prettierPromise = dynImport(PRETTIER + '/standalone.mjs')
	}
	return prettierPromise
}

let jsPluginsPromise
function loadJsPlugins() {
	if (!jsPluginsPromise) {
		jsPluginsPromise = Promise.all([
			dynImport(PRETTIER + '/plugins/babel.mjs'),
			dynImport(PRETTIER + '/plugins/estree.mjs'),
		]).then(([babel, estree]) => [babel.default, estree.default])
	}
	return jsPluginsPromise
}

let cssPluginPromise
function loadCssPlugin() {
	if (!cssPluginPromise) {
		cssPluginPromise = dynImport(PRETTIER + '/plugins/postcss.mjs').then(
			m => [m.default],
		)
	}
	return cssPluginPromise
}

/**
 * Prettier-format an editor document, preserving the cursor. Returns
 * `{ formatted, cursorOffset }`; rejects if prettier can't parse (e.g. a
 * syntax error mid-edit) so the caller can simply no-op.
 *
 * @param {string} code
 * @param {number} cursorOffset
 * @param {'js' | 'css'} lang
 * @returns {Promise<{ formatted: string, cursorOffset: number }>}
 */
export async function formatWithCursor(code, cursorOffset, lang) {
	const isCss = lang === 'css'
	const [prettier, plugins] = await Promise.all([
		loadPrettier(),
		isCss ? loadCssPlugin() : loadJsPlugins(),
	])
	return prettier.formatWithCursor(code, {
		...prettierConfig,
		parser: isCss ? 'css' : 'babel-ts',
		plugins,
		cursorOffset,
	})
}

/**
 * Compile a single JSX/TSX source string to JS via the pota Babel
 * preset, then best-effort prettier-format it. On a compile error the
 * returned string starts with `Error:` so the preview can display it.
 *
 * @param {string} code
 * @returns {Promise<string>}
 */
export async function transform(code) {
	let out
	try {
		const Babel = await loadBabel()
		out = Babel.transform(code, {
			filename: 'file.tsx',
			presets: ['pota'],
		}).code
	} catch (e) {
		return 'Error:' + (e && e.message ? e.message : String(e))
	}

	// Formatting is cosmetic — a prettier failure must not mask a valid
	// transform, so fall back to the raw Babel output.
	try {
		const [prettier, plugins] = await Promise.all([
			loadPrettier(),
			loadJsPlugins(),
		])
		return (
			await prettier.format(out, { ...prettierConfig, plugins })
		).trim()
	} catch {
		return out
	}
}
