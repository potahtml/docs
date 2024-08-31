import { render } from 'pota'

import 'pota/plugin/clickOutside'

function App() {
	return (
		<main>
			<section>
				<input
					name="name"
					clickOutside={(event, node) => render('clicking outside')}
				/>
			</section>
		</main>
	)
}

render(App)
