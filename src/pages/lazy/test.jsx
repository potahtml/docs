import { render, lazy } from 'pota'
import { Route } from 'pota/router'

const About = lazy(() => {
	// fake it to see if its working
	return new Promise(resolve => {
		setTimeout(
			() =>
				resolve({
					default: props => props.message,
				}),
			500,
		)
	})
})

function App() {
	return (
		<main>
			<Menu />
			<Route path="/">
				<Route>Home!</Route>

				<Route.Default>404 Not Found</Route.Default>

				<Route
					path="blog/"
					children={lazy(() => import('/@pages/lazy/blog.jsx'))}
				/>
				<Route
					path="about/"
					children={lazy(() => {
						// fake it to see if its working
						return new Promise(resolve =>
							setTimeout(
								() =>
									resolve({
										default: () =>
											'A fake lazy loaded component as about page!',
									}),
								800,
							),
						)
					})}
				/>
				<hr />
				<About message="About as a component" />
			</Route>
		</main>
	)
}

function Menu() {
	return (
		<ul>
			<li>
				<a href="/">home</a>
			</li>
			<li>
				<a href="/blog/">blog</a>
			</li>
			<li>
				<a href="/about/">about</a>
			</li>
			<li>
				<a href="/broken">broken link</a>
			</li>
		</ul>
	)
}
render(App)
