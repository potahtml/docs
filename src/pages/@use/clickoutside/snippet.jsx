import { render } from 'pota'

import { clickOutside } from 'pota/use/clickoutside'

function App() {
	return (
		<main>
			<section>
				<input
					name="name"
					use:ref={clickOutside((event, node) =>
						render('clicking outside'),
					)}
				/>
			</section>
		</main>
	)
}

render(App)
