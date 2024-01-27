import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="addEventListener / removeEventListener">
				For adding and removing event listeners
			</Header>

			<Section title="addEventListener Arguments">
				<p>
					Returns a handy <mark>off</mark> function that uses no
					arguments, to remove the added event
				</p>
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
							<td>node</td>
							<td>node</td>
							<td>
								reference to the node on which to add the event
								listener
							</td>
						</tr>
						<tr>
							<td>type</td>
							<td>string</td>
							<td>
								event listener to add, example <mark>click</mark>.
								Types are case sensitive, as regular event listeners
							</td>
						</tr>
						<tr>
							<td>handler</td>
							<td>fn </td>
							<td>handler to run once the event is triggered</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="removeEventListener Arguments">
				<p>
					Returns a handy <mark>on</mark> function that uses no
					arguments, to add the event back
				</p>
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
							<td>node</td>
							<td>node</td>
							<td>
								reference to the node from which to remove the event
								listener
							</td>
						</tr>
						<tr>
							<td>type</td>
							<td>string</td>
							<td>
								event listener to remove, example <mark>click</mark>.
								Types are case sensitive, as regular event listeners
							</td>
						</tr>
						<tr>
							<td>handler</td>
							<td>fn</td>
							<td>
								reference to the handler that has been added using{' '}
								<mark>addEventListener</mark>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@props/event-listener/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Test Events Listeners">
				<Code url="/pages/@props/event-listener/test.jsx"></Code>
			</Section>
		</>
	)
}
