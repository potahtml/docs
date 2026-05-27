import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="dom">
				<mark>pota/use/dom</mark> is the low-level DOM helper
				module the renderer itself uses. It re-exports a few
				platform globals pre-bound to <mark>document</mark> and
				wraps the imperative APIs that pota's internals lean on
				— attribute / class / part manipulation, tree walking,
				and a couple of niche utilities like{' '}
				<mark>isPlaying</mark> and <mark>cleanJSXText</mark>.
				Most app code doesn't need it; it's documented because
				it ships as a public subpath.
			</Header>

			<Section title="Document / window passthroughs">
				<table>
					<tbody>
						<tr>
							<td>document</td>
							<td>
								<mark>window.document</mark>.
							</td>
						</tr>
						<tr>
							<td>head</td>
							<td>
								<mark>document.head</mark>.
							</td>
						</tr>
						<tr>
							<td>documentElement</td>
							<td>
								<mark>document.documentElement</mark>.
							</td>
						</tr>
						<tr>
							<td>DocumentFragment</td>
							<td>
								<mark>window.DocumentFragment</mark>{' '}
								constructor.
							</td>
						</tr>
						<tr>
							<td>activeElement()</td>
							<td>
								<mark>document.activeElement</mark> (function
								so it's read on call).
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Creating nodes">
				<p>
					Pre-bound to <mark>document</mark>, so calls are a
					method dispatch lighter than the platform versions
					and can be passed around as values.
				</p>
				<table>
					<tbody>
						<tr>
							<td>createElement(tag)</td>
							<td>HTML element.</td>
						</tr>
						<tr>
							<td>createElementNS(ns, tag)</td>
							<td>namespaced element (SVG, MathML).</td>
						</tr>
						<tr>
							<td>createTextNode(text)</td>
							<td>text node.</td>
						</tr>
						<tr>
							<td>createComment(text)</td>
							<td>comment node — used as the placeholder anchor for reactive ranges.</td>
						</tr>
						<tr>
							<td>importNode(node, deep?)</td>
							<td>
								<mark>document.importNode</mark> — used when
								adopting a template's content.
							</td>
						</tr>
						<tr>
							<td>createTreeWalker(root, what?)</td>
							<td>
								<mark>document.createTreeWalker</mark>.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Connectivity / play state">
				<table>
					<tbody>
						<tr>
							<td>isConnected(node)</td>
							<td>
								<mark>node.isConnected</mark>.
							</td>
						</tr>
						<tr>
							<td>isPlaying(el)</td>
							<td>
								<mark>true</mark> when a media element is
								actively progressing —{' '}
								<mark>currentTime &gt; 0</mark>, not paused,
								not ended,{' '}
								<mark>readyState &gt; HAVE_FUTURE_DATA</mark>.
								Use it as a one-shot in event handlers; for
								reactive play state wrap a signal around{' '}
								<mark>play</mark> / <mark>pause</mark> /{' '}
								<mark>ended</mark>.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Attributes, classes, parts">
				<p>
					Direct passthroughs over their{' '}
					<mark>Element</mark> counterparts. Prefer JSX{' '}
					<a href="/props/attributes-properties">attributes / properties</a>{' '}
					or <a href="/props/class:__">class:*</a> in components — these
					are for imperative escape hatches and for library code.
				</p>
				<table>
					<tbody>
						<tr>
							<td>setAttribute / hasAttribute / removeAttribute</td>
							<td>
								The platform method on <mark>node</mark>.
							</td>
						</tr>
						<tr>
							<td>addClass(node, str|array)</td>
							<td>
								Splits a string by whitespace via{' '}
								<mark>tokenList</mark> or uses the array
								directly, then{' '}
								<mark>classList.add(...tokens)</mark>.
								No-ops on empty input.
							</td>
						</tr>
						<tr>
							<td>removeClass(node, str|array)</td>
							<td>
								Same shape, calls{' '}
								<mark>classList.remove</mark>.
							</td>
						</tr>
						<tr>
							<td>addPart / removePart</td>
							<td>
								<mark>node.part.add / remove</mark> — for{' '}
								<mark>::part()</mark> styling on shadow DOM.
							</td>
						</tr>
						<tr>
							<td>tokenList(s)</td>
							<td>
								Trims and splits by whitespace; returns the
								module-shared empty array for falsy input.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Queries / traversal">
				<table>
					<tbody>
						<tr>
							<td>querySelector / querySelectorAll</td>
							<td>
								Per-node versions —{' '}
								<mark>{`querySelector(node, query)`}</mark>.
								For document-scoped shorthands with type
								inference, see{' '}
								<a href="/use/test">pota/use/test</a>'s{' '}
								<mark>$</mark> / <mark>$$</mark>.
							</td>
						</tr>
						<tr>
							<td>walkElements(node, max?, nodes?)</td>
							<td>
								Depth-first element walk using a shared{' '}
								<mark>TreeWalker</mark>. Includes{' '}
								<mark>node</mark> itself when it's an
								element. Used by the renderer's
								partial-instantiation path.
							</td>
						</tr>
						<tr>
							<td>getDocumentForElement(node)</td>
							<td>
								Returns the owning <mark>Document</mark> or{' '}
								<mark>ShadowRoot</mark> — works for
								disconnected nodes and for nodes inside a
								shadow tree.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Renderer-internal helpers">
				<p>
					Public because they ship with the file, but rarely
					useful outside the renderer.{' '}
					<mark>cleanJSXText(value)</mark> mirrors the
					whitespace-stripping rules JSX applies to{' '}
					<mark>JSXText</mark> children — exposed so the{' '}
					<a href="/XML">xml</a> tagged-template parser can
					normalise text the same way the compiler does.{' '}
					<mark>getValueElement(value, ...args)</mark> resolves
					a possibly-function value to a <mark>Node</mark> (or{' '}
					<mark>undefined</mark>).{' '}
					<mark>toDiff(prev, next, short?)</mark> removes from
					the DOM any element in <mark>prev</mark> that isn't
					in <mark>next</mark> — used by the{' '}
					<a href="/Reactivity/map">map</a> /{' '}
					<mark>&lt;For/&gt;</mark> reconciliation.
				</p>
			</Section>
		</>
	)
}
