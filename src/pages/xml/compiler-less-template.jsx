import { signal, render } from 'pota'
import { xml } from 'pota/xml'

const count = signal(0)

const App = xml`
	<div>
		<p>count: ${count.read}</p>
		<button on:click="${() => count.update(n => n + 1)}">+</button>
		<button on:click="${() => count.write(0)}">reset</button>
	</div>
`

render(App)
