import { render } from 'pota'

import 'pota/plugins/autofocus'

function App() {
	return (
		<main>
			<section>
				<div useClipboard="Copy this">copy the attribute value</div>
				<div useClipboard={() => 'Copy that'}>
					copy the return value
				</div>
				<div useClipboard>copy the innerText</div>
			</section>
		</main>
	)
}

render(App)
