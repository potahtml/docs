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
					url="/pages/@use/location/snippet.jsx"
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
					<mark>navigate(href, options?)</mark> changes the current
					location programmatically.{' '}
					<Tag mark={true}>Navigate</Tag> is a JSX wrapper around
					the same function, for when you want to redirect
					declaratively from inside a route.
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
								When the <mark>href</mark> is not absolute (i.e.
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
									navigate("/some/:cat/:page", {'{'} params: {'{'}{' '}
									cat: 'variété', page: 'touché' {'}'} {'}'})
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
					url="/pages/@use/location/navigate/snippet.jsx"
					render={false}
				></Code>
			</Section>
			<Section title="Navigate Function">
				<p>Example using params</p>
				<Code
					url="/pages/@use/location/navigate/snippet-function.jsx"
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
							<td>protocol</td>
							<td>string</td>
							<td>
								<mark>window.location.protocol</mark>
							</td>
						</tr>
						<tr>
							<td>origin</td>
							<td>string</td>
							<td>
								<mark>window.location.origin</mark>
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
							<td>hash</td>
							<td>signal</td>
							<td>
								<mark>window.location.hash</mark>
							</td>
						</tr>
						<tr>
							<td>search</td>
							<td>signal</td>
							<td>
								<mark>window.location.search</mark>
							</td>
						</tr>
						<tr>
							<td>searchParams</td>
							<td>
								Record{'<'}string, string{'>'}
							</td>
							<td>
								A key-value pairs object with URI decoded values of{' '}
								<mark>searchParams</mark>, such as:{' '}
								<mark>
									{'{'}search:'variété'{'}'}
								</mark>
							</td>
						</tr>
						<tr>
							<td>params</td>
							<td>
								Record{'<'}string, string{'>'}
							</td>
							<td>
								A key-value pairs object with URI decoded values of{' '}
								Route <mark>params</mark>, such as:{' '}
								<mark>
									{'{'}page:'variété'{'}'}
								</mark>
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Read and navigate the URL">
				<p>
					<mark>location</mark> is a frozen object of accessors
					over <mark>window.location</mark> — read{' '}
					<mark>location.pathname()</mark>,{' '}
					<mark>location.hash()</mark>,{' '}
					<mark>location.search()</mark>, or the reactive{' '}
					<mark>location.searchParams</mark> map.{' '}
					<mark>navigate(path, options)</mark> performs
					client-side navigation;{' '}
					<mark>addListeners()</mark> ensures{' '}
					<mark>popstate</mark>/click handlers are wired up.
				</p>
				<Code url="/pages/@use/location/navigate-buttons.jsx"></Code>
			</Section>

			<Section title="Log of `location`">
				<p>
					We modify the location to trigger reactivity based on the
					location
				</p>
				<Code url="/pages/@use/location/use-location/snippet.jsx"></Code>
			</Section>

			<Section title="useBeforeLeave">
				<p>
					Register a callback to run whenever the user tries to
					leave the current route. The callback can be sync or
					async; if it returns (or resolves to) <mark>false</mark>,
					navigation is cancelled. Rejecting a returned promise
					counts as <mark>false</mark>. Call{' '}
					<mark>useBeforeLeave</mark> from within a route's
					rendering — the guard is automatically cleared once the
					user navigates to a location outside the route's path.
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
							<td>() {'=>'} boolean | Promise&lt;boolean&gt;</td>
							<td>
								returning (or resolving to) <mark>false</mark>{' '}
								cancels the navigation. A rejected promise is
								treated as <mark>false</mark>.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Preventing navigation">
				<p>Example preventing navigation</p>
				<Code
					url="/pages/@use/location/use-before-leave/snippet.jsx"
					render={false}
				></Code>
			</Section>
		</>
	)
}
