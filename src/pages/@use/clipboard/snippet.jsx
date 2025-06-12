import { render } from 'pota'

import 'pota/use/clipboard'

function App() {
	return (
		<main>
			<section>
				<div use:clipboard="Copy this">copy the attribute value</div>
				<div use:clipboard={() => 'Copy that'}>
					copy the return value
				</div>
				<div use:clipboard>copy the innerText</div>
				<div
					use:clipboard={e =>
						e.currentTarget.getAttribute('copy-this')
					}
				>
					copy a different attribute
				</div>
			</section>
		</main>
	)
}

render(App)
