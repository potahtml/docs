import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="catchError">
				Runs <mark>fn</mark> inside an error boundary. If it
				throws (synchronously or via a reactive dependency),{' '}
				<mark>onError(err)</mark> is called and the error does
				not bubble. Returns the value of <mark>fn</mark>, or{' '}
				<mark>undefined</mark> if it threw. The building block
				behind{' '}
				<a href="/Components/Errored">&lt;Errored/&gt;</a>; reach
				for it when you need a programmatic boundary outside JSX.
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
							<td>fn</td>
							<td>() {'=>'} T</td>
							<td>function to run inside the boundary</td>
						</tr>
						<tr>
							<td>onError</td>
							<td>(err) {'=>'} void</td>
							<td>handler called for any thrown error</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> the return value of <mark>fn</mark>, or{' '}
					<mark>undefined</mark> if it threw.
				</p>
			</Section>

			<Section title="Programmatic boundary">
				<p>
					Catches throws from descendants — synchronous, from
					effects, or from rejected{' '}
					<mark>derived</mark>/<mark>action</mark> chains — and
					routes them to the handler instead of the console.
				</p>
				<Code url="/pages/@reactivity/catchError/example.jsx"></Code>
			</Section>
		</>
	)
}
