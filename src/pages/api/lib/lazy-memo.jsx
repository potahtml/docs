import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="lazyMemo">
				A regular memo will run right away after the definition. A
				lazy memo holds the execution till it is used. If the
				resulting lazy memo is not used, then the function will never
				run. Written by{' '}
				<a href="https://github.com/fabiospampinato">Fabio</a>
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
							<td>the function to memo</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Return Value:</b> Function
				</p>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/api/lib/lazy-memo/lazy-memo-snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Usage">
				<p>Memo vs lazyMemo</p>
				<Code url="/pages/api/lib/lazy-memo/lazy-memo.jsx"></Code>
			</Section>
		</>
	)
}
