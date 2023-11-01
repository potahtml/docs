import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="ref">
				<p>
					<mark>ref</mark> is a small helper for setting a{' '}
					<mark>ref</mark> via a JSX attribute. It's a signal that can
					be used in places like effects.
				</p>
			</Header>

			<Section title="Snippet">
				<Code url="/pages/props/ref/snippet.jsx"></Code>
			</Section>
		</>
	)
}
