import { render } from 'pota'

import { location, navigate } from 'pota/use/location'
import { A, Route } from 'pota/components'

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
			<Route path="/">
				<h2>all</h2>
				<section>
					absolute links: <A href="/uno/">/uno/</A> -{' '}
					<A href="/dos/">/dos/</A> - <A href="/tres/">/tres/</A>
				</section>
				<hr />
				<Route>
					<h2>landing exact!</h2>
					<RelativeLinks />
				</Route>
				<Route path="uno/">
					<h2>this is UNO!</h2>
					<Route>
						<h2>exact uno</h2>
					</Route>

					<RelativeLinks />
					<Route path="uno">
						<section>/uno/uno content</section>
					</Route>
					<Route path="dos">
						<section>/uno/dos content</section>
					</Route>
					<hr />
				</Route>
				<Route path="dos/">
					<h2>this is dos</h2>
					<Route>
						<h2>exact dos</h2>
					</Route>

					<RelativeLinks />
					<Route path="uno">
						<section>/dos/uno content</section>
					</Route>
					<Route path="dos">
						<section>/dos/dos content</section>
					</Route>
				</Route>
				<RelativeLinks />

				<Route
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
					></iframe>
				</Route>
			</Route>
			<hr />
			<h2>using a #hash</h2>
			<A href="/#">Index</A> {'<-'} click here first to test hash
			routing
			<Route path="#">
				<h2>all</h2>
				<section>
					absolute links: <A href="#uno/">/uno/</A> -{' '}
					<A href="#dos/">/dos/</A> - <A href="#tres/">/tres/</A>
				</section>
				<hr />
				<Route>
					<h2>landing exact!</h2>
					<RelativeLinks />
				</Route>
				<Route path="uno/">
					<h2>this is UNO!</h2>
					<Route>
						<h2>exact uno</h2>
					</Route>

					<RelativeLinks />
					<Route path="uno">
						<section>/uno/uno content</section>
					</Route>
					<Route path="dos">
						<section>/uno/dos content</section>
					</Route>
					<hr />
				</Route>
				<Route path="dos/">
					<h2>this is dos</h2>
					<Route>
						<h2>exact dos</h2>
					</Route>

					<RelativeLinks />
					<Route path="uno">
						<section>/dos/uno content</section>
					</Route>
					<Route path="dos">
						<section>/dos/dos content</section>
					</Route>
				</Route>
				<Route
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
					></iframe>
				</Route>
			</Route>
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
				<li>params: {() => JSON.stringify(location.params)}</li>
				<li>search: {() => JSON.stringify(location.search)}</li>
				<li>href: {location.href}</li>
			</ul>
			<hr />
		</>
	)
}

render(App)
