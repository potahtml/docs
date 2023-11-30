import { render } from 'pota'
import { useLocation, navigate } from 'pota/router'

function Example() {
	const location = useLocation()

	return (
		<main>
			<ul>
				<li>hash: {location.hash} </li>
				<li>pathname: {location.pathname}</li>
				<li>path: {location.path}</li>
				<li>query: {() => JSON.stringify(location.query())}</li>
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
		</main>
	)
}

render(Example)
