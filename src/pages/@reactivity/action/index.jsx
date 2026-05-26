import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="action">
				Builds an action handler. Returns a function that, when
				called, runs the first callback with the received args and
				chains the remaining callbacks as continuations,
				unwrapping any returned functions or promises recursively.
				Cancels automatically if the owner is disposed — handy for
				async event handlers.
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
								one or more functions to run in order. The first
								receives the call arguments; subsequent stages
								receive the previous resolved value.
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> a function. Call it to start the
					pipeline. Errors route to the nearest{' '}
					<a href="/Reactivity/catchError">catchError</a> /{' '}
					<a href="/Components/Errored">&lt;Errored/&gt;</a>.
				</p>
			</Section>

			<Section title="Form submit pipeline">
				<p>
					Validation, fetch, and the success-side write all live
					on a single chain. The pipeline runs under the
					component's owner, so unmounting cancels in-flight
					work, and a thrown <mark>invalid email</mark> bubbles
					up to the surrounding <mark>&lt;Errored/&gt;</mark>{' '}
					boundary.
				</p>
				<Code url="/pages/@reactivity/action/pipeline.jsx"></Code>
			</Section>
		</>
	)
}
