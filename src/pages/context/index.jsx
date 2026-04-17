import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Context">
				Context carries values through the reactive scope so deeply
				nested components can read them without <em>prop drilling</em>
				. A single function acts as both the provider and the reader.
			</Header>

			<Section title="Signature">
				<Code
					code={`// create (defaultValue is optional)
const useCtx = context('default value')

// read
useCtx()

// provide, scoped to fn
useCtx('new value', fn)`}
					render={false}
				/>
				<p>
					<mark>context(defaultValue?)</mark> returns a function.
					Call it with no argument to read the current value (or
					the default if nothing was provided). Call it with a
					value and a <mark>fn</mark> to push that value for the
					duration of <mark>fn</mark> — children rendered inside
					read the new value; everything outside keeps the
					previous one. Providing a <mark>Partial</mark> of an
					object value shallow-merges it with the inherited value.
				</p>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/context/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Example">
				<p>Using and testing context</p>
				<Code url="/pages/context/test.jsx"></Code>
			</Section>

			<Section title="Another Test">
				<Code url="/pages/context/provider.jsx"></Code>
			</Section>
		</>
	)
}
