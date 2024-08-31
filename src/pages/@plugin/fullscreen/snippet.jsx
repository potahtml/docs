import { render } from 'pota'

import 'pota/plugin/fullscreen'

function App() {
	return (
		<main>
			<section>
				<div fullscreen>fullscreen body</div>
				<div fullscreen={(event, node) => node}>
					fullscreen element
				</div>
			</section>
		</main>
	)
}

render(App)
