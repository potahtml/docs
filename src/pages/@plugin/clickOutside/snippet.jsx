import { render } from 'pota'

import 'pota/plugin/clickoutside'

function App() {
	return (
		<main>
			<section>
				<input
					name="name"
					plugin:clickoutside={(event, node) =>
						render('clicking outside')
					}
				/>
			</section>
		</main>
	)
}

render(App)
