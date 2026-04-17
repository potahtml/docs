import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="use:ref">
				<mark>use:ref</mark> is an attribute that hands you a
				reference to the element via a signal. Accept a function
				that receives the signal, or an array of such functions
				when you need more than one consumer. Call the signal to
				read the ref — <mark>ref()</mark> — so it works inside
				effects and memos.
			</Header>

			<p>
				The ref is written as soon as the element is created,{' '}
				<em>before</em> its children exist and <em>before</em> it
				is inserted into the document. Layout-dependent properties
				like <mark>clientWidth</mark> therefore return <mark>0</mark>
				{' '}at ref time. For values that need the element to be
				connected, see the <em>Mounted Ref</em> example below — it
				combines <mark>use:ref</mark> with{' '}
				<a href="/use/connected">use:connected</a>.
			</p>

			<Section title="Snippet">
				<Code url="/pages/@use/ref/snippet.jsx"></Code>
			</Section>

			<Section title="Mounted Ref">
				<Code url="/pages/@use/ref/mounted.jsx"></Code>
			</Section>
		</>
	)
}
