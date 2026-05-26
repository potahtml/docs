import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="on">
				Effect with explicit dependencies. <mark>on(depend, fn)</mark>{' '}
				runs <mark>depend</mark> in a tracking scope and{' '}
				<mark>fn</mark> outside of one — so only{' '}
				<mark>depend</mark>'s reads become deps and reads inside{' '}
				<mark>fn</mark> stay snapshot-style. Handy when the
				handler reads other signals you don't want as
				dependencies. The auto-tracking form is{' '}
				<a href="/Reactivity/effect">effect</a>; for one-off
				untracked reads inside an existing effect, see{' '}
				<a href="/Reactivity/untrack">untrack</a>.
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
							<td>depend</td>
							<td>() {'=>'} unknown</td>
							<td>
								tracked function whose reads become the effect's
								dependencies
							</td>
						</tr>
						<tr>
							<td>fn</td>
							<td>() {'=>'} void</td>
							<td>
								untracked body — runs after every change to{' '}
								<mark>depend</mark>
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> <mark>void</mark>.
				</p>
			</Section>

			<Section title="Explicit dependencies">
				<p>
					Click <em>re-run</em> to bump <mark>trigger</mark> —
					the effect fires and reads <mark>noisy</mark>{' '}
					untracked. Click <em>mutate noisy</em> as many times
					as you like; the effect won't re-run until{' '}
					<mark>trigger</mark> changes again.
				</p>
				<Code url="/pages/@reactivity/on/explicit.jsx"></Code>
			</Section>
		</>
	)
}
