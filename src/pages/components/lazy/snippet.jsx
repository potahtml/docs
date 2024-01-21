import { render, lazy } from 'pota'
import { Route } from 'pota/router'

const Lazy = lazy(() => new Promise((resolve, reject) => reject()))

function App() {
	return (
		<main>
			<Route
				path="blog/"
				children={lazy(
					() => import('/pages/components/lazy/blog.jsx'),
					<div>fallback: oops something went wrong</div>,
				)}
			/>
			<Lazy fallback="something went wrong" />
		</main>
	)
}

render(App)
