import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="Classes">
				<p>
					If for some reason make sense to use a component class, you
					may do so by extending <mark>Component</mark>
				</p>
			</Header>

			<p>
				A class, automatically registers the methods{' '}
				<mark>onReady</mark> and <mark>onCleanup</mark>
			</p>

			<Section title="Example">
				<p>Testing a Class</p>
				<Code url="/pages/components/classes/test.jsx"></Code>
			</Section>
		</>
	)
}
