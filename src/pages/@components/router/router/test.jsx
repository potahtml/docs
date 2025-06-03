import { render } from 'pota'

import { location, navigate } from 'pota/plugin/useLocation'
import { A, Router } from 'pota/components'

// this sort of playground has a very deep url
// change it to pretend we are in an index page
navigate('/')

// used to show off that the links are relative to the route
function RelativeLinks() {
	return (
		<>
			<section>
				relative links:
				<A href="uno/">uno/</A> - <A href="dos/">dos/</A>
			</section>
			<hr />
		</>
	)
}

function App() {
	return (
		<main>
			<LocationData />
			<h2>using slash / </h2>
			<A href="/">Index</A>
			<Router path="/">
				<h2>all</h2>
				<section>
					absolute links: <A href="/uno/">/uno/</A> -{' '}
					<A href="/dos/">/dos/</A> - <A href="/tres/">/tres/</A>
				</section>
				<hr />
				<Router>
					<h2>landing exact!</h2>
					<RelativeLinks />
				</Router>
				<Router path="uno/">
					<h2>this is UNO!</h2>
					<Router>
						<h2>exact uno</h2>
					</Router>

					<RelativeLinks />
					<Router path="uno">
						<section>/uno/uno content</section>
					</Router>
					<Router path="dos">
						<section>/uno/dos content</section>
					</Router>
					<hr />
				</Router>
				<Router path="dos/">
					<h2>this is dos</h2>
					<Router>
						<h2>exact dos</h2>
					</Router>

					<RelativeLinks />
					<Router path="uno">
						<section>/dos/uno content</section>
					</Router>
					<Router path="dos">
						<section>/dos/dos content</section>
					</Router>
				</Router>
				<RelativeLinks />

				<Router
					path="tres/"
					collapse={true}
				>
					<iframe
						width="560"
						height="315"
						src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?si=U8aoXoxgc77CKWOo&start=1"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
						crossorigin="anonymous"
					></iframe>
				</Router>
			</Router>
			<hr />
			<h2>using a #hash</h2>
			<A href="/#">Index</A> {'<-'} click here first to test hash
			routing
			<Router path="#">
				<h2>all</h2>
				<section>
					absolute links: <A href="#uno/">/uno/</A> -{' '}
					<A href="#dos/">/dos/</A> - <A href="#tres/">/tres/</A>
				</section>
				<hr />
				<Router>
					<h2>landing exact!</h2>
					<RelativeLinks />
				</Router>
				<Router path="uno/">
					<h2>this is UNO!</h2>
					<Router>
						<h2>exact uno</h2>
					</Router>

					<RelativeLinks />
					<Router path="uno">
						<section>/uno/uno content</section>
					</Router>
					<Router path="dos">
						<section>/uno/dos content</section>
					</Router>
					<hr />
				</Router>
				<Router path="dos/">
					<h2>this is dos</h2>
					<Router>
						<h2>exact dos</h2>
					</Router>

					<RelativeLinks />
					<Router path="uno">
						<section>/dos/uno content</section>
					</Router>
					<Router path="dos">
						<section>/dos/dos content</section>
					</Router>
				</Router>
				<Router
					path="tres/"
					collapse={true}
				>
					<iframe
						width="560"
						height="315"
						src="https://www.youtube.com/embed/dQw4w9WgXcQ"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
						allowfullscreen
						crossorigin="anonymous"
					></iframe>
				</Router>
			</Router>
		</main>
	)
}

function LocationData() {
	return (
		<>
			<hr />
			location data:
			<ul>
				<li>hash: {location.hash} </li>
				<li>pathname: {location.pathname}</li>
				<li>path: {location.path}</li>
				<li>query: {() => JSON.stringify(location.query())}</li>
				<li>href: {location.href}</li>
			</ul>
			params data:
			<ul>
				<li>params: {() => JSON.stringify(location.params())}</li>
			</ul>
			<hr />
		</>
	)
}

render(App)
