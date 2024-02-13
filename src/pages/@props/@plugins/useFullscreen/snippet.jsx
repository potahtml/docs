import { render } from 'pota'

import 'pota/plugins/useFullscreen'

function App() {
	return (
		<main>
			<section>
				<div useFullscreen>fullscreen body</div>
				<div useFullscreen={(event, node) => node}>
					fullscreen element
				</div>
			</section>
		</main>
	)
}

render(App)
