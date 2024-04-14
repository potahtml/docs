import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="memo">
				A regular memo will run right away after the definition. Memos
				in pota are lazy, it holds the execution till it is used. If
				the resulting lazy memo is not used, then the function will
				never run. It used to use a version writen by{' '}
				<a href="https://github.com/fabiospampinato">Fabio</a> but has
				been changed to create a STALE memo instead that starts
				executing after called.
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
							<td>fn</td>
							<td>function to memo</td>
						</tr>
					</tbody>
					<tbody>
						<tr>
							<td>options?</td>
							<td>{`{{equals?: false | ((prev: unknown, next: unknown) => boolean)}}`}</td>
							<td>memo options</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Return Value:</b> Function
				</p>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@reactivity/memo/memo-snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Usage">
				<Code url="/pages/@reactivity/memo/memo.jsx"></Code>
			</Section>
		</>
	)
}
