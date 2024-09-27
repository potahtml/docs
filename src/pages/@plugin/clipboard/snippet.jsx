import { render } from 'pota'

import 'pota/plugin/clipboard'

function App() {
	return (
		<main>
			<section>
				<div clipboard="Copy this">copy the attribute value</div>
				<div clipboard={() => 'Copy that'}>copy the return value</div>
				<div clipboard>copy the innerText</div>
				<div
					clipboard={e => e.target.getAttribute('copy-this')}
					copy-this="hola"
				>
					copy a different attribute
				</div>
			</section>
		</main>
	)
}

render(App)
