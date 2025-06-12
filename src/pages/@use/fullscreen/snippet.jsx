import { render } from 'pota'

import 'pota/use/fullscreen'

function App() {
	return (
		<main>
			<section>
				<div use:fullscreen>fullscreen body</div>
				<div
					use:fullscreen={(event, node) => console.log(event, node)}
				>
					fullscreen element
				</div>
			</section>
		</main>
	)
}

render(App)
