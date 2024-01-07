import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="Usage">
				There are two vite templates for getting started with pota.
				The templates are located in{' '}
				<a href="https://github.com/potaorg/templates">github</a>.
				Feel free to send improvements!. The recommended way to use
				this package is with rollup, unless you can handle vite
				idiosyncrasies.
			</Header>

			<Section title="JavaScript">
				<code>
					<pre>
						npx degit potaorg/templates/js pota-project
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
						npx degit potaorg/templates/ts pota-project
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
					<a href="https://github.com/vobyjs/oby">Oby</a> instead
				</p>
				<code>
					<pre>
						{'presets: [["pota/babel-preset", {"lib":"oby"}]]'}
					</pre>
				</code>
			</Section>
		</>
	)
}
