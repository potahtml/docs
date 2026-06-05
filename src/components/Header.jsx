import { version } from 'pota'
import { location } from 'pota/use/location'
import { isMac } from 'pota/use/browser'
import { globalShortcut } from 'pota/use/keyboard'
import styles from './Header.module.css'
import { Logo } from './Logo.jsx'
import { ThemeToggle } from './ThemeToggle.jsx'
import { query } from '../search.js'

const NAV = [{ href: '/playground', label: 'playground', icon: '▶' }]

export function Header() {
	let input

	const navClass = href => () =>
		styles.navLink +
		(location.pathname() === href ? ' ' + styles.active : '')

	// Mod-K from anywhere focuses the filter (matches the kbd hint).
	const focusFilter = () => {
		input?.focus()
		input?.select()
	}

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
							{item.icon && (
								<span class={styles.navIcon} aria-hidden="true">
									{item.icon}
								</span>
							)}
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
						use:ref={[
							el => (input = el),
							globalShortcut('mod+k', focusFilter),
						]}
						on:input={e => query.write(e.currentTarget.value)}
						on:keydown={e => {
							window.scrollTo(0, 0)
						}}
					/>
					<kbd class={styles.kbd}>{isMac ? '⌘' : 'Ctrl'} K</kbd>
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
