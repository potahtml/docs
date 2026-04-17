import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="use:clipboard">
				Copies text to the clipboard on click. The prop value
				decides what gets copied:
			</Header>

			<ul>
				<li>
					<mark>function</mark> — invoked with the click event; its
					return value is copied
				</li>
				<li>
					<mark>string</mark> — that literal string is copied (can
					also be a signal for a dynamic value)
				</li>
				<li>
					<mark>true</mark> — the element's own{' '}
					<mark>innerText</mark> is copied
				</li>
			</ul>

			<Section title="Snippet">
				<Code url="/pages/@use/clipboard/snippet.jsx"></Code>
			</Section>
		</>
	)
}
