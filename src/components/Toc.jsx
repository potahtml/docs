import styles from './Toc.module.css'
import { Sep } from './Sep.jsx'

// "on this page" anchor list. items: [{ href, label }].
// optional `note` renders to the right of the list (e.g. step count).
export function Toc(props) {
	const items = props.items || []
	if (items.length === 0) return null

	return (
		<aside class={styles.box} aria-label="On this page">
			<div class={styles.title}>{props.title || 'on this page'}</div>
			<div class={styles.list}>
				{items.map((it, i) => (
					<>
						{i > 0 && <Sep />}
						<a href={it.href}>{it.label}</a>
					</>
				))}
				{props.note && (
					<span class={styles.note}>— {props.note}</span>
				)}
			</div>
		</aside>
	)
}
