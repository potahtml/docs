import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="onReady">
				<mark>onReady</mark> is for components that need to run some
				initialization.
			</Header>

			<p>
				The <mark>onReady</mark> callbacks, will run once the current
				processing batch is done. That's it, after the full queue of{' '}
				<mark>onMount</mark> callbacks has been processed, and before
				painting. Relevant Elements that render something should be
				already connected to the document.
			</p>

			<p>
				<b>Warning:</b> On components loaded by <mark>lazy</mark> this
				wont work as you expect as the <mark>onReady</mark> callback
				will fire before the component mounts. Thats because{' '}
				<mark>lazy</mark> is a <mark>promise</mark>. So dont use this
				API as a way to check for "onMount".
			</p>
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
							<td>
								function to run once the processing batch is done
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/components/lifecycles/on-ready/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Timing">
				<p>
					Displays current timings of <mark>onReady</mark> vs{' '}
					<mark>onMount</mark>
				</p>
				<Code url="/pages/components/lifecycles/on-ready/timing.jsx"></Code>
			</Section>
		</>
	)
}
