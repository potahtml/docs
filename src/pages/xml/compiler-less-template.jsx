import { signal, render } from 'pota'
import { xml } from 'pota/xml'

const [count, setCount, updateCount] = signal(0)

const App = xml`
	<div>
		<p>count: ${count}</p>
		<button on:click="${() => updateCount(n => n + 1)}">+</button>
		<button on:click="${() => setCount(0)}">reset</button>
	</div>
`

render(App)
