import styles from './Sep.module.css'

// the faint inline separator used between links, dots, and chips
// across the site. defaults to a middot; pass `char` to override.
export function Sep(props) {
	return <span class={styles.sep}>{props.char || '·'}</span>
}
