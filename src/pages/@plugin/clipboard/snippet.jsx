import { render } from 'pota'

import 'pota/plugin/clipboard'

function App() {
	return (
		<main>
			<section>
				<div plugin:clipboard="Copy this">
					copy the attribute value
				</div>
				<div plugin:clipboard={() => 'Copy that'}>
					copy the return value
				</div>
				<div plugin:clipboard>copy the innerText</div>
				<div
					plugin:clipboard={e => e.target.getAttribute('copy-this')}
				>
					copy a different attribute
				</div>
			</section>
		</main>
	)
}

render(App)
