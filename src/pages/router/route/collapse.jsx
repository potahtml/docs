import { render } from 'pota'

import { Route, A } from 'pota/router'

function App() {
	return (
		<main>
			<ul>
				<li>
					<A href="/index.html#kilo/frame">frame</A>
				</li>
				<li>
					<A href="/index.html#kilo/no-frame">no frame</A>
				</li>
			</ul>
			<Route path="/index.html#">
				<Route path="kilo/">
					<Route
						path="frame"
						collapse={true}
					>
						<h3>yes!</h3>
						<iframe
							width="560"
							height="315"
							src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?si=U8aoXoxgc77CKWOo&start=1"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowfullscreen
						></iframe>
					</Route>
					<Route path="no-frame">
						<h3>no!</h3>
					</Route>
				</Route>
			</Route>
		</main>
	)
}

render(App)
