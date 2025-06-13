import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'
import { CompilerLess } from '../xml/compiler-less.jsx'

export default function () {
	return (
		<form>
			<Header title="Usage">
				The templates are located in{' '}
				<a href="https://github.com/potahtml/templates">
					github pota templates
				</a>
				. Feel free to send improvements!. The recommended way to use
				this package is with <b>rollup</b>, unless you can handle vite
				idiosyncrasies.
			</Header>

			<Section title="Rollup (recommended)">
				<p>Very customizable, you are in control!</p>

				<p>
					<tm-textarea
						class="shell"
						grammar="shellscript"
						theme="monokai"
						value={`
npx degit potahtml/templates/rollup-js pota-rollup-js-project
cd pota-rollup-js-project
npm install --include=dev
npm run dev
npm run serve
						`
							.split('\n')
							.map(s => s.trim())
							.join('\n')
							.trim()}
						prop:editable={false}
					/>
				</p>
			</Section>

			<Section title="Vite JavaScript">
				<p>
					<tm-textarea
						class="shell"
						grammar="shellscript"
						theme="monokai"
						value={`
npx degit potahtml/templates/vite-js pota-vite-js-project
cd pota-vite-js-project
npm install --include=dev
npm run dev
						`
							.split('\n')
							.map(s => s.trim())
							.join('\n')
							.trim()}
						prop:editable={false}
					/>
				</p>
			</Section>

			<Section title="Babel Preset">
				<p>
					pota provides an optimized and customized babel preset for
					transforming JSX in a <em>better</em> way, inspired by{' '}
					<a href="https://github.com/ryansolid/dom-expressions">
						dom-expressions
					</a>
					, but you may use <mark>tsc</mark>,{' '}
					<mark>transform-react-jsx</mark> or any transform that
					somewhat follows <mark>react-transform</mark>.
				</p>
				<p>
					<tm-textarea
						class="shell"
						grammar="tsx"
						theme="monokai"
						value={`{babel:{presets: [["pota/babel-preset"]]}}`
							.split('\n')
							.map(s => s.trim())
							.join('\n')
							.trim()}
						prop:editable={false}
					/>
				</p>
			</Section>

			<Section title="Compiler-less">
				<CompilerLess />
			</Section>
			<Section title="Everything">
				<Code
					code={`
					Promise.all([
		import('pota'),

		import('pota/jsx-runtime'),
		import('pota/xml'),
		import('pota/components'),

		import('pota/experiments'),
		import('pota/store'),

		import('pota/use/animate'),
		import('pota/use/bind'),
		import('pota/use/browser'),
		import('pota/use/clickoutside'),
		import('pota/use/clipboard'),
		import('pota/use/css'),
		import('pota/use/dom'),
		import('pota/use/emitter'),
		import('pota/use/event'),
		import('pota/use/focus'),
		import('pota/use/fullscreen'),
		import('pota/use/location'),
		import('pota/use/orientation'),
		import('pota/use/paginate'),
		import('pota/use/polyfills'),
		import('pota/use/random'),
		import('pota/use/resize'),
		import('pota/use/scroll'),
		import('pota/use/selection'),
		import('pota/use/selector'),
		import('pota/use/stream'),
		import('pota/use/string'),
		import('pota/use/test'),
		import('pota/use/time'),
		import('pota/use/url'),
		import('pota/use/visibility'),
	]).then(imports => console.log(imports))`}
				/>
			</Section>
		</form>
	)
}
