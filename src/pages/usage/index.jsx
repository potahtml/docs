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
					pota provides a babel preset for changing the reactive
					library in use and also to transform JSX. By default, it
					uses <a href="https://www.solidjs.com/">Solid</a>, but you
					may change it to use{' '}
					<a href="https://github.com/vobyjs/oby">Oby</a> or{' '}
					<a href="https://github.com/fabiospampinato/flimsy">
						Flimsy
					</a>
				</p>
				<code>
					<pre>
						{'presets: [["pota/babel-preset", {"lib":"oby"}]]'}
					</pre>
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
					provides a cdn for standalone files
				</p>
				<code>
					<pre>
						{`
// solid
https://cdn.jsdelivr.net/npm/pota@${version}/dist/standalone.js
https://cdn.jsdelivr.net/npm/pota@${version}/dist/standalone.no-min.js

// oby
https://cdn.jsdelivr.net/npm/pota@${version}/dist/standalone.oby.js
https://cdn.jsdelivr.net/npm/pota@${version}/dist/standalone.oby.no-min.js

// flimsy
https://cdn.jsdelivr.net/npm/pota@${version}/dist/standalone.flimsy.js
https://cdn.jsdelivr.net/npm/pota@${version}/dist/standalone.flimsy.no-min.js

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
