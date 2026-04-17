import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="prop:__">
				Forces the value to be assigned as a DOM{' '}
				<em>property</em> instead of an HTML attribute.
			</Header>

			<Section title="When to use">
				<p>
					By default pota writes to attributes. That works for
					most props, but some are only correctly read back from
					the DOM property — or don't exist as attributes at all.
					Use <mark>prop:name</mark> when:
				</p>
				<ul>
					<li>
						the property and the attribute diverge after the user
						interacts with the element — <mark>value</mark> and{' '}
						<mark>checked</mark> on form controls are the usual
						suspects
					</li>
					<li>
						you need to assign a non-string JavaScript value —{' '}
						<mark>srcObject</mark> on <mark>&lt;video&gt;</mark>,{' '}
						<mark>files</mark> on <mark>&lt;input type="file"&gt;</mark>
						, <mark>plaintext-only</mark> contenteditable, or a
						custom-element property that expects an object
					</li>
					<li>
						you're writing a property that has no attribute
						equivalent — <mark>innerText</mark>,{' '}
						<mark>textContent</mark>, <mark>innerHTML</mark>
					</li>
				</ul>
			</Section>

			<Section title="Deleting">
				<p>
					Assigning <mark>null</mark> or <mark>undefined</mark> to
					a <mark>prop:</mark> sets the property to{' '}
					<mark>null</mark> (not <mark>undefined</mark>) — some
					elements (notably <mark>&lt;progress&gt;</mark>) break if
					you set their property to <mark>undefined</mark>.
				</p>
			</Section>

			<Section title="Textarea">
				<p>Setting the value on a textarea</p>
				<Code url="/pages/@props/prop/test.jsx"></Code>
			</Section>

			<Section title="Extended">
				<p>Some special properties</p>
				<Code url="/pages/@props/prop/test2.jsx"></Code>
			</Section>
		</>
	)
}
