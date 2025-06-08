import { render } from 'pota'
import { Route } from 'pota/components'

import { location, navigate } from 'pota/plugin/useLocation'

function Example() {
	function random() {
		return Math.random().toString().slice(4)
	}
	return (
		<main>
			<Route path="/:page">
				<ul>
					<li>pathname: {location.pathname}</li>
					<li>path: {location.path}</li>
					<li>hash: {location.hash} </li>
					<li>search: {location.search}</li>
					<li>
						searchParams:{' '}
						{() => JSON.stringify(location.searchParams)}
					</li>
					<li>href: {location.href}</li>
					<hr />
					<hr />

					<li>
						<button
							name="button"
							on:click={() =>
								navigate(
									'/path' +
										random() +
										'?queryParams1=' +
										random() +
										'&queryParams2=' +
										random() +
										'#hash' +
										random(),
								)
							}
						>
							randomize all
						</button>
					</li>
				</ul>
			</Route>
		</main>
	)
}

render(Example)
