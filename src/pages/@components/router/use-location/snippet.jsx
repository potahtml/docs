import { render } from 'pota'

import { location, navigate } from 'pota/plugin/useLocation'
import { Router } from 'pota/web'

function Example() {
	return (
		<main>
			<Router path="/:page">
				<ul>
					<li>hash: {location.hash} </li>
					<li>pathname: {location.pathname}</li>
					<li>path: {location.path}</li>
					<li>query: {() => JSON.stringify(location.query())}</li>
					<li>params: {() => JSON.stringify(location.params())}</li>
					<li>href: {location.href}</li>
					<hr />
					<hr />
					<li>
						<button
							name="button"
							onClick={() => navigate('/index.html?' + Math.random())}
						>
							replace to index
						</button>
					</li>
					<li>
						<button
							name="button"
							onClick={() =>
								navigate(
									'/path' +
										Math.random() +
										'?queryParams' +
										Math.random() +
										'=' +
										Math.random() +
										'#hash' +
										Math.random(),
								)
							}
						>
							randomize all
						</button>
					</li>
				</ul>
			</Router>
		</main>
	)
}

render(Example)
