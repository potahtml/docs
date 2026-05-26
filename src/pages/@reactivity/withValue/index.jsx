import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="withValue">
				Resolves <mark>value</mark> and calls{' '}
				<mark>fn(resolved)</mark>. Functions are unwrapped inside
				an effect (so <mark>fn</mark> re-runs on change); promises
				and arrays of functions/promises are resolved recursively.
				Plain values call <mark>fn</mark> immediately.
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
							<td>value</td>
							<td>{`T | () => T | Promise<T> | Array<T | () => T | Promise<T>>`}</td>
							<td>
								the value (or accessor) to resolve. Functions are
								tracked; promises are awaited.
							</td>
						</tr>
						<tr>
							<td>fn</td>
							<td>(resolved) {'=>'} void</td>
							<td>
								called with the fully-resolved value, re-running
								whenever a tracked source changes
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> <mark>void</mark>.
				</p>
			</Section>

			<Section title="Custom ref factory">
				<p>
					<mark>withValue</mark> is the right helper when
					authoring a custom <a href="/use/ref">use:ref</a>{' '}
					factory: it accepts the same{' '}
					<mark>{'Attribute<T>'}</mark> flavor (
					<mark>{'T | () => T | Promise<T>'}</mark>) the rest
					of the props pipeline expects, and the factory body
					stays concise.
				</p>
				<Code url="/pages/@reactivity/withValue/plugin.jsx"></Code>
			</Section>
		</>
	)
}
