// Seed code for the standalone /playground when the URL carries no
// shared snapshot. Ported from the old docs site's default example.
export default `import { render, signal, memo } from 'pota'

function Counter() {
	const count = signal(1)

	const double = memo(() => count.read() * 2)

	const increment = () => count.update(n => n + 1)

	return (
		<button on:click={increment}>
			{count.read} / {double}
		</button>
	)
}

render(Counter)
`
