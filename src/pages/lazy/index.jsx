import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="lazy">
				<mark>lazy</mark> is a <mark>promise</mark> loader. It is used
				when you want to display something while a promise is loading,
				or to run a callback after a promise is resolved.
				<ol>
					<li>
						Allows to display/run something, or nothing while a
						promise is resolving.
					</li>
					<li>Allows to run a callback when the promise resolves.</li>
					<li>
						Allows to get notified of errors, and display/run
						something, or nothing. If wanted, a <mark>retry</mark>{' '}
						function is given for retrying the promise.
					</li>
					<li>
						It will render what the promise returns. If the promise
						returns a function it can be used as{' '}
						<mark>Component(props)</mark>.
					</li>
				</ol>
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
							<td>fn</td>
							<td>fn/promise</td>
							<td>a function that returns a promise or a promise</td>
						</tr>
						<tr>
							<td>[options.onLoading]</td>
							<td>
								<mark>any</mark>
							</td>
							<td>renders something while the promise resolves</td>
						</tr>
						<tr>
							<td>[options.onLoaded]</td>
							<td>
								<mark>Function</mark>
							</td>
							<td>runs a callback after the promise resolves</td>
						</tr>
						<tr>
							<td>[options.onError]</td>
							<td>
								<mark>any</mark> |{' '}
								<mark>(e: Error, retry: Function) => void)</mark>
							</td>
							<td>
								renders something or runs a callback with the error
								object and a retry function as argument
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="When not to use lazy">
				<p>
					<mark>Lazy</mark> is not needed unless you use one of its
					options. You may use a promise directly as follows.
				</p>
				<Code
					url="/pages/lazy/no-need.jsx"
					render={true}
				></Code>
			</Section>

			<Section title="Usage">
				<p>
					All the different uses of <mark>Lazy</mark>
				</p>
				<Code
					url="/pages/lazy/snippet.jsx"
					render={true}
				></Code>
			</Section>
		</>
	)
}
