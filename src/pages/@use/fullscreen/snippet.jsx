import { render } from 'pota'

import { fullscreen } from 'pota/use/fullscreen'

function App() {
	return (
		<main>
			<section>
				<div use:ref={fullscreen()}>fullscreen body</div>
				<div use:ref={fullscreen((event, node) => node)}>
					fullscreen element
				</div>
			</section>
		</main>
	)
}

render(App)
