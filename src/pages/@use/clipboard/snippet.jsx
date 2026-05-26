import { render } from 'pota'

import { clipboard } from 'pota/use/clipboard'

function App() {
	return (
		<main>
			<section>
				<div use:ref={clipboard('Copy this')}>
					copy the attribute value
				</div>
				<div use:ref={clipboard(() => 'Copy that')}>
					copy the return value
				</div>
				<div use:ref={clipboard(true)}>copy the innerText</div>
				<div
					copy-this="alt text"
					use:ref={clipboard(e =>
						e.currentTarget.getAttribute('copy-this'),
					)}
				>
					copy a different attribute
				</div>
			</section>
		</main>
	)
}

render(App)
