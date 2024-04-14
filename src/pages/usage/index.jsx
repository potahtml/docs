import { version } from 'pota'

import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'
import { CompilerLess } from '../html/compiler-less.jsx'

export default function () {
	return (
		<>
			<Header title="Usage">
				The templates are located in{' '}
				<a href="https://github.com/potahtml/templates">
					github pota templates
				</a>
				. Feel free to send improvements!. The recommended way to use
				this package is with rollup, unless you can handle vite
				idiosyncrasies.
			</Header>

			<Section title="JavaScript">
				<code>
					<pre>
						npx degit potahtml/templates/js pota-project
						<br />
						cd pota-project
						<br />
						npm install --include=dev
						<br />
						npm run dev
					</pre>
				</code>
			</Section>

			<Section title="Typescript">
				<p>
					Please keep in mind this template may needs a tweak. I
					personally do not do TypeScript. The typings on the lib are
					a work in progress
				</p>
				<code>
					<pre>
						npx degit potahtml/templates/ts pota-project
						<br />
						cd pota-project
						<br />
						npm install --include=dev
						<br />
						npm run dev
					</pre>
				</code>
			</Section>

			<Section title="Babel Preset">
				<p>
					pota provides a customized babel preset for transforming
					JSX.
				</p>
				<code>
					<pre>{'presets: [["pota/babel-preset"]]'}</pre>
				</code>
			</Section>

			<Section title="Rollup">
				<p>Very customizable, recommended!</p>
				<code>
					<pre>
						{`npx degit potahtml/templates/rollup pota-project
cd pota-project
npm install --include=dev
npm run dev
npm run serve`}
					</pre>
				</code>
			</Section>

			<Section title="CDN">
				<p>
					<a href="https://www.jsdelivr.com/">jsdelivr</a> kindly
					provides a cdn for standalone files. `standalone` includes
					everything, you probably want to import from the depths of
					the lib instead.
				</p>
				<code>
					<pre>
						{`
https://cdn.jsdelivr.net/npm/pota@${version}/dist/standalone.js
https://cdn.jsdelivr.net/npm/pota@${version}/dist/standalone.no-min.js
 `
							.split('\n')
							.map(item => item.trim())
							.join('\n')
							.trim()}
					</pre>
				</code>
			</Section>

			<Section title="Compiler-less">
				<CompilerLess />
			</Section>
		</>
	)
}
