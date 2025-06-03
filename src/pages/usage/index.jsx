import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'
import { CompilerLess } from '../html/compiler-less.jsx'

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
		</form>
	)
}
