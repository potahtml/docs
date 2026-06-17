
import { effect, render, signal } from 'pota'
import { Route } from 'pota/components'
import { location } from 'pota/use/location'

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
import { AiUsage } from './components/AiUsage.jsx'

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

// Resolved-page cache: route -> parsed doc. Populated by preload() on
// hover/press, ahead of the click that navigates. The point is to have
// the page already in hand at navigate time so the route effect can
// commit it SYNCHRONOUSLY — inside document.startViewTransition's
// callback, before it snapshots the "after" frame. The async loader
// promise (even for an already-fetched chunk) always resolves a tick
// too late, after the snapshot, so the new page would otherwise pop in
// only when the transition finishes instead of cross-fading in.
const resolved = new Map()

function preload(path) {
	const load = loaders[path]
	if (!load || resolved.has(path)) return
	resolved.set(path, null) // null = in-flight; commit waits for it
	load().then(mod => resolved.set(path, mod.default))
}

// warm a doc chunk as soon as the user signals intent for its link, so
// it lands in `resolved` before the click. pointerover fires on hover,
// pointerdown covers a press with no hover (touch, fast click).
const onIntent = e => {
	const a = e.target.closest && e.target.closest('a')
	if (!a || !a.href) return
	const url = new URL(a.href)
	if (url.origin === location.origin) preload(url.pathname)
}
document.addEventListener('pointerover', onIntent)
document.addEventListener('pointerdown', onIntent)

// the playground breaks out of the reading column; everything else stays
// centered in it.
const mainClass = () =>
	styles.page +
	(location.pathname() === '/playground' ? ' ' + styles.wide : '')

function App() {


	return (
		<>
			<Header />
			<main class={mainClass}>
				{/* topics catalog sits above the page content so a search
				    (which reveals + filters it) surfaces results at the top
				    instead of below the homepage hero/intro. */}
				<Browse sections={manifest.sections} />

				{/* Routing is owned by pota's <Route>, which also installs
				    the client-side link listeners — no manual addListeners().
				    Each route renders only while the location matches; the
				    trailing `$` pins an exact match (without it `path` is a
				    prefix). Everything that isn't one of these standalone
				    pages — the generated doc pages and any unknown URL —
				    falls through to <Route.Default>, which does an O(1)
				    loader lookup and renders the parsed page, or NotFound
				    when there is none (this also serves /404 at a stable,
				    linkable URL). It double-buffers: the page on screen
				    stays put until the next chunk has loaded, so the route
				    swap never blanks out mid-navigation. */}
				<Route path="/$">{() => <Home />}</Route>
				<Route path="/playground$">
					{() => <PlaygroundPage />}
				</Route>
				<Route path="/cheatsheet$">
					{() => <Cheatsheet />}
				</Route>
				<Route path="/thanks$">{() => <Thanks />}</Route>
				<Route path="/ai-usage$">{() => <AiUsage />}</Route>
				<Route.Default>
					{() => {
						// Render the doc page from a signal, committed by an
						// effect — never by returning the loader promise as a
						// child. Two problems that solves, in order of who
						// hits them:
						//
						// 1. Flash on navigation. document.startViewTransition
						//    (pota's navigate) snapshots the "after" frame a
						//    tick before any load().then resolves — even for an
						//    already-fetched chunk — so a promise-rendered page
						//    is never in the transition and pops in only when it
						//    finishes. When the chunk was preloaded on intent it
						//    sits in `resolved`, so here we commit it
						//    SYNCHRONOUSLY, landing the new page in the DOM
						//    before the snapshot → real cross-fade.
						// 2. Blank frame on a cold (un-preloaded) nav. The async
						//    path holds the current page on screen until the new
						//    chunk resolves, then swaps in one shot — no blank.
						//    (An effect, not `derived`: derived clears its value
						//    while a promise is pending, the very blank we avoid.)
						const current = signal(null)

						// bumped per navigation; a slow chunk that resolves
						// after a newer navigation is dropped instead of
						// clobbering the page the user actually asked for.
						let token = 0

						effect(() => {
							const path = location.pathname()
							const mine = ++token
							const load = loaders[path]
							if (!load) {
								current.write({ path })
								return
							}
							// preloaded → commit synchronously so the new page is
							// in the DOM before the view transition snapshots, for
							// a real cross-fade instead of a late pop-in.
							const cached = resolved.get(path)
							if (cached) {
								current.write({ path, doc: cached })
								return
							}
							// cold: load, holding the current page until it
							// resolves (no blank frame), then swap.
							load().then(mod => {
								resolved.set(path, mod.default)
								if (mine === token) {
									current.write({ path, doc: mod.default })
								}
							})
						})

						return () => {
							const page = current.read()
							return !page ? null : page.doc ? (
								<DocPage doc={page.doc} />
							) : (
								<NotFound path={page.path} />
							)
						}
					}}
				</Route.Default>
			</main>
			<Footer />
		</>
	)
}

render(App, document.getElementById('root'), {clear:true})
