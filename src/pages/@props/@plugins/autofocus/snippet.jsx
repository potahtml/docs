import { render } from 'pota'

import 'pota/plugins/autofocus'

function App() {
	return (
		<main>
			<section>
				<input
					name="name"
					autofocus
				/>
			</section>
		</main>
	)
}

render(App)
