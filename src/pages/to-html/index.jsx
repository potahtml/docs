import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="toHTML">
				Turns any JSX-compatible value into concrete DOM nodes and
				returns them. Use it when you need actual{' '}
				<mark>Node</mark>s in hand — for third-party libraries that
				want a DOM reference, for inserting into a{' '}
				<mark>DocumentFragment</mark>, or for custom rendering
				pipelines.
			</Header>

			<Section title="Signature">
				<Code
					code={`toHTML(children)`}
					render={false}
				/>
			</Section>

			<Section title="Arguments">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>type</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>children</td>
							<td>any JSX value</td>
							<td>
								element, component, fragment, signal, array,
								promise — anything pota can render
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> a single <mark>Node</mark> when the input
					resolves to one root, or an array of <mark>Node</mark>s
					when it resolves to several.
				</p>
			</Section>

			<Section title="toHTML vs render">
				<ul>
					<li>
						<mark>render(children, parent?)</mark> mounts{' '}
						<mark>children</mark> into <mark>parent</mark> and
						returns a <mark>dispose</mark> function.
					</li>
					<li>
						<mark>toHTML(children)</mark> just returns the nodes —
						you decide where and how to attach them.
					</li>
				</ul>
				<p>
					Reactivity inside the returned nodes keeps working as
					long as the nodes stay together in the document. If you
					split them across containers, signals still update
					individual nodes, but structural helpers (like{' '}
					<mark>&lt;For/&gt;</mark>) expect the group to remain
					contiguous.
				</p>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/to-html/snippet.jsx"></Code>
			</Section>
		</>
	)
}
