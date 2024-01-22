import { render, lazy } from 'pota'

const Lazy = lazy(
	() => new Promise((resolve, reject) => setTimeout(reject, 100)),
)

function App() {
	return (
		<main>
			{lazy(
				() => import('/'),
				<div> something went wrong with lazy as callback</div>,
			)}
			<Lazy fallback="something went wrong with Lazy as component" />
		</main>
	)
}

render(App)
