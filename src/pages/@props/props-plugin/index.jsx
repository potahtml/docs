import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="propsPlugin">
				Register a prop (or a prop namespace) that can be used on
				any element. The handler runs whenever an element has that
				prop set; this is how <mark>use:bind</mark>,{' '}
				<mark>use:clickoutside</mark> and friends work — and how
				you add your own. See <a href="/Directory">Directory</a>{' '}
				for the built-in list.
			</Header>

			<Section title="Signatures">
				<Code
					code={`propsPlugin(propName, (node, value) => ..., onMicrotask?)
propsPluginNS(nsName, (node, localName, value, ns?) => ..., onMicrotask?)`}
					render={false}
				/>
				<ul>
					<li>
						<mark>propsPlugin('use:tooltip', fn)</mark> matches a
						single prop name exactly.
					</li>
					<li>
						<mark>propsPluginNS('use', fn)</mark> claims the whole{' '}
						<mark>use:*</mark> namespace — the handler receives
						the part after the colon as <mark>localName</mark>.
					</li>
					<li>
						<mark>onMicrotask</mark> defaults to <mark>true</mark>{' '}
						so the handler runs on a microtask, after siblings are
						set and children exist. Pass <mark>false</mark> if you
						need the handler to fire synchronously while the
						element is being built.
					</li>
				</ul>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/@props/props-plugin/snippet.jsx"></Code>
			</Section>
			<Section title="Type">
				<Code
					render={false}
					code={`
import type { JSX } from "pota";

declare module "pota" {
  namespace JSX {
    interface ElementAttributes<Element> {
      "use:tooltip"?: {
        position: { x: number; y: number };
      };
    }
  }
}
`}
				></Code>
			</Section>
		</>
	)
}
