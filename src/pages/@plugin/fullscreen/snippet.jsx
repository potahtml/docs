import { render } from 'pota'

import 'pota/plugin/fullscreen'

function App() {
	return (
		<main>
			<section>
				<div plugin:fullscreen>fullscreen body</div>
				<div plugin:fullscreen={(event, node) => node}>
					fullscreen element
				</div>
			</section>
		</main>
	)
}

render(App)
