import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'
import { CompilerLess } from '../html/compiler-less.jsx'
import { css } from 'pota/std'
/*
import { Runtime } from '@bigmistqke/repl'
import { babelTransform } from '@bigmistqke/repl/transform/babel'
import { typescriptTransform } from '@bigmistqke/repl/transform/typescript'
import { typescriptTransformModulePaths } from '@bigmistqke/repl/transform-module-paths/typescript'
import '@bigmistqke/repl/element'
const [transformModulePaths, transform] = await Promise.all([
	typescriptTransformModulePaths(),
	 await import('https://esm.sh/typescript'),
	Promise.all([
		typescriptTransform(),
		babelTransform({
			presets: ['pota/babel-preset'],
		}),
	]),
])

const runtime = await new Runtime({
	importExternalTypes: true,
	transformModulePaths,
	transform,
	files: {
		'src/index.css': `body { background: white; }`,
		'src/index.js': `
			import { render } from 'https://cdn.jsdelivr.net/npm/pota/+esm'
			import { html } from 'https://cdn.jsdelivr.net/npm/pota/html/+esm'

			render(html\`<b>hello</b>\`)
		`,
	},
}).initialize()
*/
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
			{css`
				repl-frame {
					background: blue;
					height: 60px;
					width: 100%;
				}
			`}

			{/*<repl-frame
				runtime={runtime}
				bodyStyle={{
					padding: '0px',
					margin: '0px',
					background: 'red',
				}}
				name="the-frame"
				onReady={({ frame }) => {
					console.log('onREady')
					const file = runtime.getFile('index.tsx')
					function injectUrl({ url }) {
						console.log('injected')
						if (!url) return
						frame.clearBody()
						frame.injectModuleUrl(url)
					}
					file.addEventListener('url', injectUrl)
					//injectUrl(file)
				}}
			/>*/}

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
						editable={false}
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
						editable={false}
					/>
				</p>
			</Section>

			<Section title="Vite Typescript">
				<p>
					<tm-textarea
						class="shell"
						grammar="shellscript"
						theme="monokai"
						value={`
npx degit potahtml/templates/vite-ts pota-vite-ts-project
cd pota-vite-ts-project
npm install --include=dev
npm run dev
						`
							.split('\n')
							.map(s => s.trim())
							.join('\n')
							.trim()}
						editable={false}
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
						editable={false}
					/>
				</p>
			</Section>

			<Section title="Compiler-less">
				<CompilerLess />
			</Section>
		</form>
	)
}
