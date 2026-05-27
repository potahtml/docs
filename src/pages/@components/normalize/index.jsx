import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Normalize ...</Tag>}>
				Resolves children as text. It unwraps all descendants and
				joins them into a single string, producing <em>one</em> text
				node inside a <em>single</em> effect — rather than one
				effect (and potentially one text node) per child.
			</Header>

			<Section title="When to use">
				<p>
					Use it when rendering purely textual content made of
					multiple reactive values side by side. A single effect
					updates the whole string when any dependency changes,
					which reduces the number of DOM nodes and the amount of
					reactive bookkeeping.
				</p>
				<p>
					If the children are a mix of text and elements, use a
					regular fragment instead — <mark>Normalize</mark> turns
					everything into a string.
				</p>
			</Section>

			<Section title="Coalesced text">
				<p>
					Two reactive inputs and a static greeting collapse into
					one text node — typing in either input updates the
					whole string in a single effect run.
				</p>
				<Code url="/pages/@components/normalize/two-input.jsx"></Code>
			</Section>

			<Section title="Snippet">
				<Code
					code={`
import { render, signal } from 'pota'
import { Normalize } from 'pota/components'

const name = signal('world')
const n = signal(3)

render(
	<>
		<p>
			<Normalize>
				hello {name.read}, you have {n.read} messages
			</Normalize>
		</p>
		<button on:click={() => n.update(x => x + 1)}>+1 message</button>
		<button
			on:click={() =>
				name.update(x => (x === 'world' ? 'pota' : 'world'))
			}
		>
			toggle name
		</button>
	</>,
)
					`}
				/>
			</Section>

			<Section title="Empty string">
				<p>
					When the joined result is an empty string,{' '}
					<mark>Normalize</mark> renders <mark>null</mark> instead,
					avoiding an empty text node.
				</p>
			</Section>
		</>
	)
}
