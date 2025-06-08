import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="css">
				There are a variety of ways to set and inline <mark>CSS</mark>{' '}
				StylesSheets.
			</Header>

			<Section title="Inline CSS In The Document">
				<p>
					Could be done just using JSX. <mark>css</mark> creates a{' '}
					<mark>CSSStyleSheet</mark> and adds it to the document. The{' '}
					<mark>CSSStyleSheet</mark> is removed from the document when
					the element is destroyed.
				</p>

				<Code url="/pages/@props/css/inline.jsx"></Code>
			</Section>
			<Section title="Inline CSS In An Attribute">
				<p>
					In the <mark>use:css</mark> attribute of an element you may
					use the keyword <mark>class</mark> which will be replaced
					for a random class, and that class will be added to the
					element.
				</p>
				<Code url="/pages/@props/css/jsx.jsx"></Code>
			</Section>
		</>
	)
}
