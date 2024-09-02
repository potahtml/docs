import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title="useLocation">
				<mark>useLocation</mark> is a plugin for handling location
				data and navigation.
			</Header>

			<Section title="Snippet">
				<Code
					url="/pages/@plugin/useLocation/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section
				title={
					<>
						navigate / <Tag>Navigate ...</Tag>
					</>
				}
			>
				<p>
					Used to navigate or change the location.{' '}
					<Tag mark={true}>Navigate</Tag> tag is just the same as{' '}
					<mark>navigate</mark> function exported as a component for
					convenience.
				</p>
			</Section>

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
							<td>href</td>
							<td>url</td>
							<td>
								When the <mark>href</mark> is not absolute (thats it
								starting with <mark>/</mark>, <mark>#</mark> or{' '}
								<mark>http</mark>) it will navigate relative to{' '}
								<mark>window.location.href</mark>.
							</td>
						</tr>
						<tr>
							<td>params?</td>
							<td>key-value pairs object </td>
							<td>
								used to replace params in the href for the URI encoded
								equivalents.{' '}
								<mark>
									{'<'}Navigate href="/some/:cat/:page" params={'{{'}{' '}
									cat: 'variété', page: 'touché' {'}}'}/{'>'}
								</mark>
								will navigate to{' '}
								<mark>/some/vari%C3%A9t%C3%A9/touch%C3%A9</mark>. Same
								with the function version,{' '}
								<mark>
									navigate("/some/:cat/:page", {'{'}params: cat:
									'variété', page: 'touché' {'}'})
								</mark>
							</td>
						</tr>
						<tr>
							<td>replace?</td>
							<td>boolean [false]</td>
							<td>to replace the browser history entry</td>
						</tr>
						<tr>
							<td>scroll?</td>
							<td>boolean [true]</td>
							<td>to scroll to the top of the page</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section
				title={
					<>
						<Tag mark={true}>Navigate</Tag> Tag
					</>
				}
			>
				<p>Example using params</p>
				<Code
					url="/pages/@plugin/useLocation/navigate/snippet.jsx"
					render={false}
				></Code>
			</Section>
			<Section title="Navigate Function">
				<p>Example using params</p>
				<Code
					url="/pages/@plugin/useLocation/navigate/snippet-function.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="location">
				<p>Returns location data in a reactive object</p>
			</Section>

			<Section title="Properties">
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
							<td>hash</td>
							<td>signal</td>
							<td>
								<mark>window.location.hash</mark>
							</td>
						</tr>
						<tr>
							<td>href</td>
							<td>signal</td>
							<td>
								<mark>window.location.href</mark>
							</td>
						</tr>
						<tr>
							<td>pathname</td>
							<td>signal</td>
							<td>
								<mark>window.location.pathname</mark>
							</td>
						</tr>
						<tr>
							<td>path</td>
							<td>signal</td>
							<td>
								<mark>window.location.pathname</mark> +{' '}
								<mark>window.location.hash</mark>
							</td>
						</tr>
						<tr>
							<td>query</td>
							<td>signal</td>
							<td>
								A key-value pairs object with URI decoded values of{' '}
								<mark>searchParams</mark>, such:{' '}
								<mark>
									{'{'}search:'variété'{'}'}
								</mark>
							</td>
						</tr>
						<tr>
							<td>params</td>
							<td>fn</td>
							<td>
								A key-value pairs object with URI decoded values of{' '}
								Router <mark>params</mark>, such:{' '}
								<mark>
									{'{'}page:'variété'{'}'}
								</mark>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Log of `location`">
				<p>
					We modify the location to trigger reactivity based on the
					location
				</p>
				<Code url="/pages/@plugin/useLocation/use-location/snippet.jsx"></Code>
			</Section>

			<Section title="useBeforeLeave">
				<p>
					Used to run code before leaving the route. To prevent
					leaving the route, return false. It also works with async
					functions.
				</p>
			</Section>

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
								async or sync function that when returns false it
								prevents the navigation. The async function could
								resolve to <mark>false</mark> or just{' '}
								<mark>reject</mark>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Preventing navigation">
				<p>Example preventing navigation</p>
				<Code
					url="/pages/@plugin/useLocation/use-before-leave/snippet.jsx"
					render={false}
				></Code>
			</Section>
		</>
	)
}
