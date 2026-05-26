import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="derived">
				A lazy, writable version of <mark>memo</mark> that unwraps
				and tracks functions and promises recursively. Pass any
				number of stage callbacks — each receives the resolved
				output of the previous stage. The body doesn't run until
				the result is read; writing to a derived overrides the
				computed value until one of its tracked sources changes
				again.
			</Header>

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
							<td>...stages</td>
							<td>{`Array<(prev?) => any>`}</td>
							<td>
								one or more functions to run in order. Each stage
								receives the resolved value of the previous stage
								(or <mark>undefined</mark> for the first). Returned
								functions and promises are unwrapped recursively.
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> a callable signal — call it with no args
					to read, or pass a value to override. <mark>await</mark>{' '}
					works too: a derived is thenable and resolves once its
					current pending stage commits.{' '}
					<a href="/Reactivity/isResolved">isResolved(d)</a>{' '}
					reports <mark>true</mark> after the first commit.
				</p>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@reactivity/derived/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Writable derived">
				<p>
					<mark>derived(fn)</mark> is like <mark>memo</mark> but
					writable: <mark>d()</mark> reads, <mark>d(value)</mark>{' '}
					writes. A manual write replaces the computed value
					until one of <mark>fn</mark>'s tracked dependencies
					fires a re-run, at which point the chain takes over
					again. Useful for inputs that are mostly auto-computed
					but occasionally need explicit override.
				</p>
				<Code url="/pages/@reactivity/derived/writable.jsx"></Code>
			</Section>

			<Section title="Multi-stage chain">
				<p>
					<mark>derived(f0, f1, f2, ...)</mark> runs the input
					through each stage in turn. Each stage receives the
					previous stage's resolved value. The chain re-runs
					whenever any tracked source in any stage changes, but
					individual stages can rerun independently when their
					own deps fire.
				</p>
				<Code url="/pages/@reactivity/derived/chain.jsx">
					Type into the input — every keystroke walks the chain
					to produce a slug.
				</Code>
			</Section>

			<Section title="Async fetch">
				<p>
					<mark>derived</mark> unwraps promises automatically —
					each stage's input is already-resolved by the time it
					runs. <mark>await d</mark> is also valid: a derived is
					thenable and resolves once its current pending stage
					commits. <mark>isResolved(d)</mark> is{' '}
					<mark>false</mark> until the chain has committed at
					least once.
				</p>
				<Code url="/pages/@reactivity/derived/async.jsx"></Code>
			</Section>

			<Section title="Async with Errored fallback">
				<p>
					A <mark>derived</mark> with promises rejects through the
					reactive scope — unhandled, the rejection routes to{' '}
					<mark>console.error</mark>. Wrap the consumer in{' '}
					<a href="/Components/Errored">&lt;Errored/&gt;</a> so a
					failed <mark>fetch</mark> or <mark>res.json()</mark>{' '}
					shows a fallback instead. The fallback's{' '}
					<mark>reset</mark> re-mounts the children, and because
					the chain re-runs from the source signal, bumping the
					trigger after reset triggers a fresh attempt.
				</p>
				<Code url="/pages/@reactivity/derived/async-errored.jsx"></Code>
			</Section>
		</>
	)
}
