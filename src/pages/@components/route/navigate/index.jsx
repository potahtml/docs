import { Code } from '../../../../lib/components/code/code.jsx'
import { Header } from '../../../../lib/components/header.jsx'
import { Section } from '../../../../lib/components/section.jsx'
import { Tag } from '../../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Navigate ...</Tag>}>
				Navigates to a new location from JSX. When rendered, it
				changes the URL to <mark>path</mark> and then renders its
				children (if any) at the destination. Useful for conditional
				redirects inside a <mark>Route</mark> tree.
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
							<td>path</td>
							<td>string</td>
							<td>
								destination URL. Relative paths are resolved
								against the current location.
							</td>
						</tr>
						<tr>
							<td>params?</td>
							<td>key-value pairs object</td>
							<td>
								replaces <mark>:name</mark> params in{' '}
								<mark>path</mark> for their URI-encoded values,
								same as <mark>A</mark> and <mark>Route</mark>.
							</td>
						</tr>
						<tr>
							<td>replace?</td>
							<td>boolean [false]</td>
							<td>
								use <mark>history.replaceState</mark> so no new
								history entry is added.
							</td>
						</tr>
						<tr>
							<td>scroll?</td>
							<td>boolean</td>
							<td>
								whether to scroll to the hash (if any) after
								navigating.
							</td>
						</tr>
						<tr>
							<td>delay?</td>
							<td>number</td>
							<td>
								milliseconds to wait before navigating. Useful to
								show a message before redirecting.
							</td>
						</tr>
						<tr>
							<td>children?</td>
							<td>any</td>
							<td>
								optional content rendered in place during the
								navigation (for example a &quot;Redirecting…&quot;
								notice when combined with <mark>delay</mark>).
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					code={`
import { Route, Navigate } from 'pota/components'

function Routes() {
	return (
		<Route path="old-page">
			<Navigate path="/new-page" replace={true} />
		</Route>
	)
}
					`}
					render={false}
				/>
			</Section>

			<Section title="Programmatic navigation">
				<p>
					Outside JSX, import <mark>navigate</mark> from{' '}
					<mark>pota/use/location</mark> to navigate imperatively.
					It accepts the same options.
				</p>
				<Code
					code={`
import { navigate } from 'pota/use/location'

navigate('/dashboard', { replace: true })
					`}
					render={false}
				/>
			</Section>
		</>
	)
}
