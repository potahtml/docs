import { render } from 'pota'

import 'pota/plugin/clipboard'

function App() {
	return (
		<main>
			<section>
				<div clipboard="Copy this">copy the attribute value</div>
				<div clipboard={() => 'Copy that'}>
					copy the return value
				</div>
				<div clipboard>copy the innerText</div>
			</section>
		</main>
	)
}

render(App)
