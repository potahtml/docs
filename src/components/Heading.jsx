import styles from './Heading.module.css'

// renders <h1>/<h2>/<h3> with the `#` / `##` / `###` prefix and an
// anchor link when `id` is provided. used for doc-page titles and
// section heads in rendered markdown.
export function Heading(props) {
	const level = props.level || 2
	const Tag = 'h' + level
	const hash = '#'.repeat(level)
	const cls =
		styles.heading + ' ' + (styles['h' + level] || styles.h2)

	const inner = (
		<>
			<span class={styles.hash}>{hash}</span>
			{props.children}
		</>
	)

	return (
		<Tag class={cls} id={props.id}>
			{props.id ? (
				<a class={styles.anchor} href={'#' + props.id}>
					{inner}
				</a>
			) : (
				inner
			)}
		</Tag>
	)
}
