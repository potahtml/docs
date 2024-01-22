import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="Classes">
				If for some reason make sense to use a component class, you
				may do so by extending <mark>Pota</mark>
			</Header>

			<p>
				A class, automatically registers the methods{' '}
				<mark>onReady</mark> and <mark>onCleanup</mark>
			</p>

			<Section title="Example">
				<p>Testing a Class</p>
				<Code url="/pages/classes/test.jsx"></Code>
			</Section>
		</>
	)
}
