import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Suspense ...</Tag>}>
				Provides a fallback until children promises resolve
				(recursively). Pairs with{' '}
				<a href="/Reactivity/derived">derived</a> /{' '}
				<a href="/Reactivity/withValue">withValue</a> for the
				async work, and{' '}
				<a href="/Components/Errored">&lt;Errored/&gt;</a> for
				the failure path.
			</Header>

			<Section title="Suspense Attributes">
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
							<td>fallback</td>
							<td>any</td>
							<td>
								show <mark>fallback</mark> while awaiting
							</td>
						</tr>
						<tr>
							<td>children</td>
							<td>children</td>
							<td>children to render</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@components/suspense/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Async fallback">
				<p>
					<mark>&lt;Suspense/&gt;</mark> tracks promises read by
					descendants (via{' '}
					<a href="/Reactivity/derived">derived</a>,{' '}
					<a href="/Reactivity/withValue">withValue</a>, or
					Suspense-aware components) and shows{' '}
					<mark>fallback</mark> until they all resolve. Once the
					tree is settled it swaps in the real content.
				</p>
				<Code url="/pages/@components/suspense/basic.jsx"></Code>
			</Section>

			<Section title="Nested Suspense">
				<p>
					Each <mark>&lt;Suspense/&gt;</mark> captures the async
					work read by its descendants independently — the
					inner boundary can resolve while an outer boundary is
					still waiting. Use this when a page has fast-loading
					chrome and a slower content body: the chrome appears
					immediately once its sources resolve, the body fills
					in once theirs do.
				</p>
				<Code url="/pages/@components/suspense/nested.jsx"></Code>
			</Section>

			<Section title="Chained components demo">
				<Code url="/pages/@components/suspense/test.jsx"></Code>
			</Section>
		</>
	)
}
