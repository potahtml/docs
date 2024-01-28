import { render, lazy } from 'pota'

const Lazy = lazy(
	() => new Promise((resolve, reject) => setTimeout(reject, 100)),
)

function App() {
	return (
		<main>
			{lazy(
				() => import('/'),
				<div>lazy fallback testing as callback</div>,
			)}
			<Lazy fallback="Lazy fallback testing as component" />
		</main>
	)
}

render(App)
