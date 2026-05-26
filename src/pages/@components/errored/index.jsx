import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Errored ...</Tag>}>
				Error boundary. Catches errors thrown by descendants and
				renders a <mark>fallback</mark> in their place. It protects
				its subtree from both synchronous throws during render and
				reactive throws inside descendant{' '}
				<a href="/Reactivity/effect">effect</a>,{' '}
				<a href="/Reactivity/memo">memo</a> and{' '}
				<a href="/Reactivity/derived">derived</a>. The
				programmatic form is{' '}
				<a href="/Reactivity/catchError">catchError</a>.
			</Header>

			<Section title="Attributes">
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
							<td>fallback?</td>
							<td>
								<mark>any</mark> |{' '}
								<mark>
									(err, reset) {'=>'} JSX.Element
								</mark>
							</td>
							<td>
								what to render when a descendant throws. When the
								fallback is a function it receives the thrown value
								and a <mark>reset</mark> function that clears the
								error and re-runs the subtree.
							</td>
						</tr>
						<tr>
							<td>children</td>
							<td>any</td>
							<td>the protected subtree</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Boundary with reset">
				<p>
					<mark>&lt;Errored/&gt;</mark> catches throws from its
					descendants — synchronous, from effects, or from
					rejected <mark>derived</mark>/<mark>action</mark>{' '}
					chains — and renders <mark>fallback</mark>. The
					fallback can be a <mark>(err, reset) =&gt; JSX</mark>{' '}
					function; calling <mark>reset()</mark> clears the
					error and re-renders the children.
				</p>
				<Code url="/pages/@components/errored/boundary.jsx"></Code>
			</Section>

			<Section title="Different fallback shapes">
				<p>
					The <mark>fallback</mark> prop accepts three shapes: a
					JSX element for a static "something failed" view, a
					primitive (like a string or number) when you just want
					to substitute a placeholder, or a{' '}
					<mark>(err, reset) =&gt; JSX</mark> function when you
					want to show the error and let the user recover. The
					function form is the most common.
				</p>
				<Code url="/pages/@components/errored/fallback-shapes.jsx"></Code>
			</Section>

			<Section title="Async derived chain">
				<p>
					<mark>&lt;Errored/&gt;</mark> doesn't just catch
					synchronous throws during render — it also catches
					rejections from <mark>derived</mark> chains,{' '}
					<mark>action</mark> pipelines, and async work in
					effects within its subtree. Useful for network-driven
					views: parse failures, HTTP errors, and timeouts land
					in the same fallback regardless of how they were
					thrown.
				</p>
				<Code url="/pages/@components/errored/async-derived.jsx"></Code>
			</Section>

			<Section title="Snippet">
				<Code
					code={`
import { render, signal } from 'pota'
import { Errored } from 'pota/components'

const [ok, setOk] = signal(false)

function Boom() {
	if (!ok()) throw new Error('kaboom')
	return <p>Everything is fine now.</p>
}

render(
	<Errored
		fallback={(err, reset) => (
			<div>
				<p>Something broke: {String(err)}</p>
				<button
					on:click={() => {
						setOk(true)
						reset()
					}}
				>
					retry
				</button>
			</div>
		)}
	>
		<Boom />
	</Errored>,
)
					`}
				/>
			</Section>

			<Section title="Async errors">
				<p>
					A component can return a promise — pota awaits it and
					renders the resolved value. If the promise rejects,
					the rejection is thrown back into the reactive scope
					and <mark>&lt;Errored/&gt;</mark> catches it the same
					way it catches synchronous throws. Clicking{' '}
					<mark>reset</mark> re-creates the protected subtree:{' '}
					<mark>AsyncBoom</mark> is called again and a fresh
					promise is created.
				</p>
				<Code
					code={`
import { render, signal } from 'pota'
import { Errored, Suspense } from 'pota/components'

const [ok, setOk] = signal(false)

function AsyncBoom() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			ok()
				? resolve(<p>Everything is fine now.</p>)
				: reject(new Error('fetch failed'))
		}, 800)
	})
}

render(
	<Errored
		fallback={(err, reset) => (
			<div>
				<p>Something broke: {String(err)}</p>
				<button
					on:click={() => {
						setOk(true)
						reset()
					}}
				>
					retry
				</button>
			</div>
		)}
	>
		<Suspense fallback={<p>Loading…</p>}>
			<AsyncBoom />
		</Suspense>
	</Errored>,
)
					`}
				/>
			</Section>

			<Section title="Notes">
				<ul>
					<li>
						<mark>fallback</mark> is optional. Without it, the subtree
						is replaced with nothing when an error is caught.
					</li>
					<li>
						Calling <mark>reset</mark> re-renders the protected
						children, so the error must have been resolved (for
						example, stale state replaced) or it will throw again.
					</li>
					<li>
						Errors that occur outside the reactive graph
						(detached <mark>setTimeout</mark>, microtasks,
						external event listeners) are not caught — keep
						async work reactive (return a promise from a
						component, use an{' '}
						<a href="/Reactivity/effect">effect</a>, or wrap
						callbacks with{' '}
						<a href="/Reactivity/owned">owned</a>) so the
						error flows through the boundary.
					</li>
				</ul>
			</Section>
		</>
	)
}
