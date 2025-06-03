import { render } from 'pota'

import { Router, A } from 'pota/components'

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
			<Router path="/index.html#">
				<Router path="kilo/">
					<Router
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
							crossorigin="anonymous"
						></iframe>
					</Router>
					<Router path="no-frame">
						<h3>no!</h3>
					</Router>
				</Router>
			</Router>
		</main>
	)
}

render(App)
