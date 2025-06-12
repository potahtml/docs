import { render } from 'pota'

import 'pota/use/clickoutside'

function App() {
	return (
		<main>
			<section>
				<input
					name="name"
					use:clickoutside={(event, node) =>
						render('clicking outside')
					}
				/>
			</section>
		</main>
	)
}

render(App)
