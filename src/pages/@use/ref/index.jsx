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

			<Section title="Focus on mount">
				<p>
					<mark>ref()</mark> returns a tiny signal-function:
					write with <mark>r(node)</mark>, read with{' '}
					<mark>r()</mark>. The renderer assigns the element
					synchronously at creation time via{' '}
					<mark>use:ref</mark>. Imperative work that requires
					the node to be in the DOM (focus, measure, integrate
					with a third-party widget) belongs inside{' '}
					<mark>ready</mark>, which fires once the renderer has
					mounted everything.
				</p>
				<Code url="/pages/@use/ref/focus-on-mount.jsx"></Code>
			</Section>

			<Section title="Multiple refs on one element">
				<p>
					<mark>use:ref</mark> accepts a single ref or an array
					— every entry receives the element. Useful when one
					place creates the element and another (a parent
					component, an external library wrapper) also needs a
					handle. Both refs read the same node.
				</p>
				<Code url="/pages/@use/ref/multiple.jsx"></Code>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/@use/ref/snippet.jsx"></Code>
			</Section>

			<Section title="Mounted Ref">
				<Code url="/pages/@use/ref/mounted.jsx"></Code>
			</Section>

			<Section title="Composable behaviors (ref factories)">
				<p>
					Anything that's a function{' '}
					<mark>(node) =&gt; void</mark> works as a ref. To
					parameterize a behavior, write a factory that
					returns one. This is how the built-in{' '}
					<mark>pota/use/*</mark> helpers (
					<a href="/use/clickoutside">clickOutside</a>,{' '}
					<a href="/use/clipboard">clipboard</a>,{' '}
					<a href="/use/fullscreen">fullscreen</a>, …) are
					built — and how you add your own without a plugin
					registry.
				</p>
				<p>
					Cleanup is automatic: <mark>addEvent</mark>,{' '}
					<a href="/cleanup">cleanup</a>, and{' '}
					<a href="/use/connected">use:connected</a> inside
					a ref body all dispose with the element. To accept
					a signal as a factory argument, resolve it inside
					the body with{' '}
					<a href="/Reactivity/withValue">withValue</a>.
				</p>
				<Code url="/pages/@use/ref/longpress.jsx"></Code>
			</Section>

			<Section title="Composing many refs on one element">
				<p>
					Pass an array (any depth) of refs — every entry
					receives the element. Order is the array order;
					each callback runs synchronously at element
					creation, before children exist.
				</p>
				<Code url="/pages/@use/ref/composed.jsx"></Code>
			</Section>
		</>
	)
}
