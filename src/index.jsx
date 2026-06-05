import { render } from 'pota'
import { addListeners, location } from 'pota/use/location'

import './styles.css'
import styles from './index.module.css'

import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { Browse } from './components/Browse.jsx'
import { DocPage } from './components/DocPage.jsx'
import { Home } from './components/Home.jsx'
import { NotFound } from './components/NotFound.jsx'
import { PlaygroundPage } from './components/playground/PlaygroundPage.jsx'
import { Cheatsheet } from './components/Cheatsheet.jsx'
import { Thanks } from './components/Thanks.jsx'

import { manifest } from './manifest.js'

// One loader per page, keyed by route. The markdown is parsed to a
// plain data object at build time by the content plugin (marked never
// ships to the client); here we only code-split that already-parsed
// JSON. Lazy glob → each page is its own chunk, fetched on first
// navigation and cached by the browser/Vite thereafter, so the initial
// bundle carries no page bodies.
// content lives in the pota repo (documentation/content), outside this
// project's src/ — see vite-plugin-content.js and server.fs.allow.
const modules = import.meta.glob(
	'../../../documentation/content/**/*.md',
)
const loaders = {}
for (const path in modules) {
	// keys arrive prefixed with the relative climb out of src/; keep
	// only the part after documentation/content/ as the route
	const route =
		'/' +
		path
			.replace(/^.*\/documentation\/content\//, '')
			.replace(/\.md$/, '')
	loaders[route] = modules[path]
}

// Standalone routes that own the main reading content (no Home hero).
// Browse still renders on every page — collapsed to the "browse all
// apis" reveal until you search — so the header filter works everywhere.
// `/404` renders the same not-found body as an unknown path, but at a
// stable, linkable URL.
const special = {
	'/playground': () => <PlaygroundPage />,
	'/cheatsheet': () => <Cheatsheet />,
	'/thanks': () => <Thanks />,
	'/404': () => <NotFound path="/404" />,
}

// the playground breaks out of the reading column; everything else stays
// centered in it.
const mainClass = () =>
	styles.page +
	(location.pathname() === '/playground' ? ' ' + styles.wide : '')

function App() {
	// enables client-side navigation: internal <a href> clicks are
	// intercepted and update location.pathname() reactively.
	addListeners()

	return (
		<>
			<Header />
			<main class={mainClass}>
				{/* topics catalog sits above the page content so a search
				    (which reveals + filters it) surfaces results at the top
				    instead of below the homepage hero/intro. */}
				<Browse sections={manifest.sections} />

				{() => location.pathname() === '/' && <Home />}

				{() => {
					const path = location.pathname()
					if (path === '/') return null
					const render = special[path]
					if (render) return render()
					const load = loaders[path]
					if (!load) return <NotFound path={path} />
					// the renderer unwraps a returned promise (and ties it
					// into Suspense); the page chunk loads on demand here.
					return load().then(mod => <DocPage doc={mod.default} />)
				}}
			</main>
			<Footer />
		</>
	)
}

render(App, document.getElementById('root'))
