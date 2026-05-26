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
					previous one. The new value replaces the inherited one
					entirely; if you want to inherit-and-override, build
					the merged object yourself before providing it.
				</p>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/context/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Theme provider">
				<p>
					<mark>context(defaultValue)</mark> returns a{' '}
					<mark>useContext</mark> function with a{' '}
					<mark>Provider</mark> JSX component attached. Wrap a
					subtree in <mark>&lt;Theme.Provider value=&#123;...&#125;/&gt;</mark>{' '}
					and any descendant call to <mark>Theme()</mark> returns
					that value. With no provider, <mark>Theme()</mark>{' '}
					returns the default.
				</p>
				<Code url="/pages/context/theme-provider.jsx"></Code>
			</Section>

			<Section title="Functional override">
				<p>
					Calling the context function as{' '}
					<mark>Theme(newValue, fn)</mark> runs <mark>fn</mark>{' '}
					with the override applied; outside of <mark>fn</mark>,
					the previous value is restored. Useful when you need
					the context override outside the JSX tree (computing a
					derived value, in an <mark>effect</mark>, etc.).
				</p>
				<Code
					url="/pages/context/override.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Reactive context value">
				<p>
					Putting a signal <em>into</em> the context value gives
					descendants both a reactive read and a write channel.
					The provider creates the signal once; any nested
					component can swap the theme by calling the context's{' '}
					<mark>set</mark> action.
				</p>
				<Code url="/pages/context/reactive-value.jsx"></Code>
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
