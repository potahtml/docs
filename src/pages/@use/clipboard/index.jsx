import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="clipboard">
				<mark>clipboard(value)</mark> from{' '}
				<mark>pota/use/clipboard</mark> returns a ref function
				that copies text to the clipboard on click. The value
				decides what gets copied:
			</Header>

			<ul>
				<li>
					<mark>function</mark> — invoked with the click
					event; its return value is copied
				</li>
				<li>
					<mark>string</mark> or <mark>number</mark> — that
					literal value is copied
				</li>
				<li>
					<mark>true</mark> — the element's own{' '}
					<mark>innerText</mark> is copied
				</li>
			</ul>

			<Section title="Three value shapes">
				<p>
					Pass <mark>true</mark> to copy the element's own{' '}
					<mark>innerText</mark>, a string to copy that
					literal text, or a function{' '}
					<mark>(event) =&gt; string</mark> to compute it on
					the fly.
				</p>
				<Code url="/pages/@use/clipboard/copy.jsx"></Code>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/@use/clipboard/snippet.jsx"></Code>
			</Section>
		</>
	)
}
