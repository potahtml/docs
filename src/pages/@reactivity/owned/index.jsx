import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="owned">
				Captures the current owner and returns a function bound to
				it. Calling that function re-runs <mark>fn</mark> under
				the captured owner, as long as the owner hasn't been
				disposed. If the owner is disposed before the function is
				called, <mark>onCancel</mark> runs instead. Useful for
				scheduling deferred work (timers, promises, websocket
				callbacks) that must not outlive the component that
				scheduled it. Pair with{' '}
				<a href="/cleanup">cleanup</a> when you also need to tear
				down the resource itself.
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
							<td>(...args) {'=>'} void</td>
							<td>callback to run under the captured owner</td>
						</tr>
						<tr>
							<td>onCancel?</td>
							<td>() {'=>'} void</td>
							<td>
								called instead of <mark>fn</mark> when the captured
								owner has already been disposed
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Returns:</b> a wrapper function. Arguments passed to
					it are forwarded to <mark>fn</mark>.
				</p>
			</Section>

			<Section title="Owner-bound async callback">
				<p>
					When the surrounding component unmounts (or a parent
					re-renders past it), the captured owner disposes — and
					the wrapped callback becomes a no-op. The deferred
					write to <mark>status</mark> is skipped instead of
					tearing into a disposed scope.
				</p>
				<Code url="/pages/@reactivity/owned/example.jsx"></Code>
			</Section>
		</>
	)
}
