import { render } from 'pota'

import 'pota/plugins/onClickOutside'

function App() {
	return (
		<main>
			<section>
				<input
					name="name"
					onClickOutside={(event, node) => render('clicking outside')}
				/>
			</section>
		</main>
	)
}

render(App)
