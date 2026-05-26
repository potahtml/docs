import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="externalSignal">
				A signal tailored for arrays of objects with an{' '}
				<mark>id</mark> key. Reads behave like{' '}
				<a href="/Reactivity/signal">signal</a>, but{' '}
				<mark>write(fresh)</mark> patches the array by{' '}
				<mark>id</mark>: items already present and deep-equal stay
				as the same reference, only changed/new items become new
				references. Cheap way to merge polled or refreshed data
				without reaching for a full <a href="/Store">store</a>.
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
							<td>initialValue</td>
							<td>{`Array<{ id?: string, ... }>`}</td>
							<td>seed array; entries should expose an{' '} <mark>id</mark> key</td>
						</tr>
						<tr>
							<td>options?</td>
							<td>SignalOptions</td>
							<td>
								forwarded to the underlying{' '}
								<mark>signal</mark>
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> a signal whose <mark>write</mark>{' '}
					patches by id; everything else (read, update, options)
					matches <mark>signal</mark>.
				</p>
			</Section>

			<Section title="Patch a list while preserving identity">
				<p>
					Click <em>refresh</em>: <mark>id 1</mark> changes
					(toggled to done), <mark>id 2</mark> stays exactly
					equal (same reference reused), <mark>id 3</mark> is
					new. Downstream code that compares by reference (
					<mark>===</mark>) sees a minimal diff.
				</p>
				<Code url="/pages/@reactivity/externalSignal/patch.jsx"></Code>
			</Section>
		</>
	)
}
