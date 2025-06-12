globalThis.start = performance.now()

// css
import styles from './index.module.css'
import stylesMenu from './menu.module.css'

// components
import Menu from './@menu.jsx'
import Routes from './@routes.jsx'

// misc
import { Bench } from './lib/components/bench/bench.jsx'

// tm
// import { setCDN } from 'tm-textarea/cdn'
// setCDN('/assets/tm')

import { register as registerTmTextarea } from 'tm-textarea'
import './lib/components/code/tm-textarea.css'

// app
import { render, setClass } from 'pota'

import { onDocumentSize } from 'pota/use/resize'
import { location } from 'pota/use/location'

registerTmTextarea()

render(
	() => {
		return (
			<main
				flair="row grow"
				data-pathname={location.pathname}
			>
				{/*<Test />*/}
				<Bench />

				<svg
					flair="selection-none"
					height="24"
					viewBox="0 -960 960 960"
					width="24"
					class={stylesMenu.montevideo}
					on:click={e => {
						const menu = document.querySelector('#menu')
						if (
							menu.style.display === '' ||
							menu.style.display === 'inherit'
						) {
							menu.style.display = 'none'
						} else {
							menu.style.display = 'inherit'
						}
					}}
				>
					<path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
				</svg>

				<aside
					id="menu"
					flair="grow col"
					class={'menu ' + stylesMenu.menu}
					use:ref={menu => {
						onDocumentSize(e => {
							menu.style.display = e.width < 750 ? 'none' : 'inherit'
						})
					}}
					use:connected={menu => {
						const links = menu.querySelectorAll('li a')
						for (const link of links) {
							setClass(
								link.parentNode,
								'selected',
								() =>
									location.pathname() !== '/' &&
									link.href.startsWith(
										window.location.origin + location.pathname(),
									),
							)
						}
					}}
				>
					<nav flair="grow col scroll-y scroll-thin">
						<Menu />
					</nav>
					<footer flair="row width">
						<span>
							<a href="/Articles/">articles</a>
						</span>
						<span flair="grow" />
						<span>
							<a
								href="https://github.com/potahtml/pota"
								title="🌟"
							>
								<img
									class={styles.github}
									src="/assets/github-mark-white.png"
								/>
							</a>
						</span>

						{/*<a
						href=""
						on:click={() =>
							alert('sorry didnt develop the light theme yet')
						}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
						>
							<path d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
						</svg>
					</a>*/}
					</footer>
				</aside>
				<section
					flair="grow col scroll-y scroll-thin"
					id="content"
				>
					<article flair="grow col">
						<Routes />
					</article>
				</section>
			</main>
		)
	},
	document.body,
	{ clear: true },
)
