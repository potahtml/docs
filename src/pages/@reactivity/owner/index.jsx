import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="owner">
				Returns the currently-running reactive{' '}
				<em>owner</em> — the scope that cleanups and child
				computations attach to — or <mark>undefined</mark> when
				called outside a tracked scope. Sibling to{' '}
				<a href="/Reactivity/listener">listener</a> (the
				tracking scope); both are low-level introspection
				helpers. Most app code never touches them.
			</Header>

			<Section title="Signature">
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
							<td>owner()</td>
							<td>{`Computation | undefined`}</td>
							<td>
								The active owner. <a href="/cleanup">cleanup</a>{' '}
								registrations attach here; child{' '}
								<mark>effect</mark> / <mark>memo</mark> /{' '}
								<mark>root</mark> instances become its children.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Capture an owner to schedule work later">
				<p>
					Pair with <a href="/Reactivity/owned">owned</a> or
					<mark> runWithOwner</mark> when you need to run a
					callback inside a previously-captured scope —
					typically when the callback fires from outside any
					reactive scope (DOM event from a library, a queued
					microtask).
				</p>
				<Code
					code={`import { owner, owned } from 'pota'

const cb = owned(() => {
  // ...runs under the owner that was active when owned() was called
})

externalLibrary.on('event', cb)`}
					render={false}
				/>
			</Section>

			<Section title="vs listener">
				<p>
					<mark>owner</mark> is about <em>lifetime</em> — what
					disposes when; <a href="/Reactivity/listener">listener</a>{' '}
					is about <em>tracking</em> — whether signal reads
					subscribe. The two are usually the same{' '}
					<mark>Computation</mark>, but{' '}
					<a href="/Reactivity/untrack">untrack</a> sets{' '}
					<mark>listener</mark> to <mark>undefined</mark> while
					leaving <mark>owner</mark> intact, and{' '}
					<a href="/Reactivity/root">root</a> creates a new
					owner without a listener.
				</p>
			</Section>
		</>
	)
}
