import { Code } from '../../../../lib/components/code/code.jsx'
import { Header } from '../../../../lib/components/header.jsx'
import { Section } from '../../../../lib/components/section.jsx'
import { Tag } from '../../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Route ...</Tag>}>
				Renders components based on location paths. It doesn't need a
				wrapper, and routes can be nested. When a route is nested, the
				paths are relative to the parent route.{' '}
				<mark>{'<Route.Default/>'}</mark> can be used for rendering a
				default/404 when no sibling routes match
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
							<td>path?</td>
							<td>string</td>
							<td>
								when the location matches this path, the children of
								this Route will render. When path is not defined, it
								will render its children only when the parent route
								path matches the location exactly
							</td>
						</tr>

						<tr>
							<td>params?</td>
							<td>key-value pairs object</td>
							<td>
								used to replace params for URI encoded equivalents.{' '}
								<mark>
									{
										'<Route path="/some/:cat/:page" params={{ cat: "variété", page:"touché" }}/>'
									}
								</mark>{' '}
								will become{' '}
								<mark>
									{
										'<Route path="/some/vari%C3%A9t%C3%A9/touch%C3%A9"/>'
									}
								</mark>
							</td>
						</tr>
						<tr>
							<td>children?</td>
							<td>any</td>
							<td>thing to render.</td>
						</tr>
						<tr>
							<td>collapse?</td>
							<td>boolean [false]</td>
							<td>
								instead of disposing/unmounting the route it will be
								hidden, useful for frames and canvas that would lose
								state if removed from the document
							</td>
						</tr>
						<tr>
							<td>when?</td>
							<td>signal</td>
							<td>
								an optional condition to stop rendering the route even
								if the path matches.
							</td>
						</tr>
						<tr>
							<td>fallback?</td>
							<td>any</td>
							<td>
								fallback for when a `when` condition is set. if the
								`when` condition is not set, this wont be used.
							</td>
						</tr>
						<tr>
							<td>scrolls?</td>
							<td>string[]</td>
							<td>
								array of selectors to scroll when the route matches
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@components/router/route/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Test">
				<p>some router testing</p>
				<Code url="/pages/@components/router/route/test.jsx"></Code>
			</Section>

			<Section title="Collapse">
				<p>
					<mark>Collapse</mark> hides a route instead of unmounting
					it, so it avoids a re render and could be helpful to keep
					state of iframes, canvas, video, audio or anything
				</p>
				<Code url="/pages/@components/router/route/collapse.jsx"></Code>
			</Section>
		</>
	)
}
