import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="css">
				There are a variety of ways to inline <mark>CSS</mark>{' '}
				stylesheets.
			</Header>

			<Section title="The css tagged template">
				<p>
					<mark>css`...`</mark> (from <mark>pota/use/css</mark>) is
					a tagged-template helper that returns a{' '}
					<mark>CSSStyleSheet</mark>. Results are cached by source
					text, so the same template produces the same sheet
					across calls — you can safely use it at module scope.
					The underlying{' '}
					<mark>sheet(cssString)</mark> helper does the same from
					a plain string.
				</p>
				<p>
					The sheet is not adopted automatically. Assign it via{' '}
					<mark>addAdoptedStyleSheet(document, sheet)</mark>, by
					including it in a <mark>CustomElement</mark>'s static{' '}
					<mark>styleSheets</mark> array, or by applying it through
					the <mark>use:css</mark> prop described below.
				</p>
			</Section>

			<Section title="Inline CSS In The Document">
				<p>
					Any element with a <mark>css</mark> prop (a{' '}
					<mark>CSSStyleSheet</mark> or a CSS string) has that
					sheet adopted into its owning document while the
					element is mounted, and removed when it is destroyed.
				</p>

				<Code url="/pages/@props/css/inline.jsx"></Code>
			</Section>
			<Section title="Inline CSS In An Attribute">
				<p>
					In the <mark>use:css</mark> attribute of an element you
					can use the keyword <mark>class</mark> in a selector —
					it's rewritten to a random class name that's then added
					to the element. That way you can co-locate a scoped
					stylesheet with the markup without hand-generating a
					class.
				</p>
				<Code url="/pages/@props/css/jsx.jsx"></Code>
			</Section>
		</>
	)
}
