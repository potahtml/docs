import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'
import { CompilerLess } from '../html/compiler-less.jsx'
import { setCDN } from 'solid-shiki-textarea/custom-element'

import '../../lib/components/code/shiki-textarea.css'

export default function () {
	return (
		<>
			<Header title="Usage">
				The templates are located in{' '}
				<a href="https://github.com/potahtml/templates">
					github pota templates
				</a>
				. Feel free to send improvements!. The recommended way to use
				this package is with <b>rollup</b>, unless you can handle vite
				idiosyncrasies.
			</Header>

			<Section title="JavaScript">
				<shiki-textarea
					class="nice"
					language="shellscript"
					theme="monokai"
					value={`npx degit potahtml/templates/js pota-project
						cd pota-project
						npm install --include=dev
						npm run dev`
						.split('\n')
						.map(s => s.trim())
						.join('\n')
						.trim()}
					editable={false}
				/>
			</Section>

			<Section title="Typescript">
				<p>
					Please keep in mind this template may needs a tweak. The
					typings on the lib are a work in progress
				</p>

				<shiki-textarea
					class="nice"
					language="shellscript"
					theme="monokai"
					value={`npx degit potahtml/templates/ts pota-project
						cd pota-project
						npm install --include=dev
						npm run dev`
						.split('\n')
						.map(s => s.trim())
						.join('\n')
						.trim()}
					editable={false}
				/>
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
					somewhat follows react way.
				</p>
				<shiki-textarea
					class="nice"
					language="jsx"
					theme="monokai"
					value={`{babel:{presets: [["pota/babel-preset"]]}}`
						.split('\n')
						.map(s => s.trim())
						.join('\n')
						.trim()}
					editable={false}
				/>
			</Section>

			<Section title="Rollup">
				<p>Very customizable, you are in control, recommended!</p>

				<shiki-textarea
					class="nice"
					language="shellscript"
					theme="monokai"
					value={`npx degit potahtml/templates/rollup pota-project
cd pota-project
npm install --include=dev
npm run dev
npm run serve`
						.split('\n')
						.map(s => s.trim())
						.join('\n')
						.trim()}
					editable={false}
				/>
			</Section>

			<Section title="Compiler-less">
				<CompilerLess />
			</Section>
		</>
	)
}
