import { version, cleanup } from 'pota'
import { location } from 'pota/use/location'
import styles from './Header.module.css'
import { Logo } from './Logo.jsx'
import { ThemeToggle } from './ThemeToggle.jsx'
import { query } from '../search.js'

const NAV = [
	{ href: '/playground', label: 'playground' },
	{ href: '/cheatsheet', label: 'cheatsheet' },
	{ href: '/thanks', label: 'thanks' },
]

export function Header() {
	let input

	const navClass = href => () =>
		styles.navLink +
		(location.pathname() === href ? ' ' + styles.active : '')

	// Ctrl/Cmd-K from anywhere focuses the filter (matches the kbd hint).
	const onKey = e => {
		if (
			(e.metaKey || e.ctrlKey) &&
			!e.altKey &&
			e.key.toLowerCase() === 'k'
		) {
			e.preventDefault()
			input?.focus()
			input?.select()
		}
	}
	window.addEventListener('keydown', onKey)
	cleanup(() => window.removeEventListener('keydown', onKey))

	return (
		<header class={styles.bar}>
			<div class={styles.inner}>
				<a class={styles.brand} href="/">
					<Logo />
					<span>pota</span>
					<span class={styles.version}>v{version}</span>
				</a>
				<nav class={styles.nav}>
					{NAV.map(item => (
						<a class={navClass(item.href)} href={item.href}>
							{item.label}
						</a>
					))}
				</nav>
				<div class={styles.searchWrap}>
					<input
						class={styles.search}
						type="text"
						placeholder="/ filter — signal…"
						prop:value={query.read}
						use:ref={el => (input = el)}
						on:input={e => query.write(e.currentTarget.value)}
						on:keydown={e => {
							window.scrollTo(0, 0)
						}}
					/>
					<kbd class={styles.kbd}>
						{navigator.platform.startsWith('Mac') ? '⌘' : 'Ctrl'} K
					</kbd>
				</div>
				<ThemeToggle />
				<a
					class={styles.ext}
					href="https://github.com/potahtml/pota"
					target="_blank"
					rel="noopener"
					title="🌟"
					aria-label="🌟"
				/>
			</div>
		</header>
	)
}
