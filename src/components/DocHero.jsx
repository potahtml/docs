import styles from './DocHero.module.css'

// the title-and-lede block at the top of every doc page.
// `lede` is an array of pre-rendered inline-HTML paragraphs (or a
// single string); injected via prop:innerHTML (trusted markdown).
// `syntax` adds a subdued suffix to the title, e.g. `()` for fns.
export function DocHero(props) {
	const ledes = Array.isArray(props.lede)
		? props.lede
		: props.lede
			? [props.lede]
			: []

	return (
		<section class={styles.hero}>
			<h1 class={styles.title}>
				<span class={styles.hash}>#</span>
				{props.title}
				{props.syntax && (
					<span class={styles.syntax}>{props.syntax}</span>
				)}
			</h1>
			{ledes.map(l => (
				<p class={styles.lede} prop:innerHTML={l} />
			))}
		</section>
	)
}
