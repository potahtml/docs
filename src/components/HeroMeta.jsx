import styles from './HeroMeta.module.css'
import { Sep } from './Sep.jsx'

// quick-links row that sits under the hero lede.
// items: [{ label, href, external?: boolean, code?: boolean }]
export function HeroMeta(props) {
	const items = props.items || []
	return (
		<nav class={styles.meta} aria-label="Quick links">
			{items.map((it, i) => (
				<>
					{i > 0 && <Sep />}
					{it.code ? (
						<code>{it.label}</code>
					) : (
						<a
							href={it.href}
							target={it.external ? '_blank' : undefined}
							rel={it.external ? 'noopener' : undefined}
						>
							{it.label}
						</a>
					)}
				</>
			))}
		</nav>
	)
}
