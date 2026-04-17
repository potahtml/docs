import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="use:bind">
				Two-way binding between a form field and a signal. The
				value is read into the signal on <mark>input</mark>, and
				the element is updated when the signal changes. Accepts a
				single signal or a flat array of signals (all bound to the
				same element).
			</Header>

			<Section title="Supported elements">
				<ul>
					<li>
						<mark>&lt;input type="checkbox"&gt;</mark> — binds to{' '}
						<mark>checked</mark>
					</li>
					<li>
						<mark>&lt;input type="radio"&gt;</mark> — binds{' '}
						<mark>checked</mark> to{' '}
						<mark>node.value === signal()</mark>; writing the
						radio's own value when selected
					</li>
					<li>
						any other <mark>&lt;input&gt;</mark>,{' '}
						<mark>&lt;textarea&gt;</mark>,{' '}
						<mark>&lt;select&gt;</mark> — binds to{' '}
						<mark>value</mark>
					</li>
					<li>
						<mark>contenteditable</mark> elements — binds to{' '}
						<mark>innerText</mark>, preserving the caret selection
						across updates
					</li>
				</ul>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/@use/bind/snippet.jsx"></Code>
			</Section>
		</>
	)
}
