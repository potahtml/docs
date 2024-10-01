import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="propsPlugin">
				<mark>propsPlugin</mark> and <mark>propsPluginNS</mark>{' '}
				register a custom prop that can be used on any element
				globally. This empowers JSX/HTML by allowing you to add custom
				behaviour via props. The <a href="/Directory">Directory</a>{' '}
				has a growing list of plugins to use.
			</Header>

			<Section title="Snippet">
				<Code url="/pages/@props/props-plugin/snippet.jsx"></Code>
			</Section>
		</>
	)
}
