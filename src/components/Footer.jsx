import styles from './Footer.module.css'

export function Footer() {
	return (
		<footer class={styles.footer}>
			<div>
				<span>docs</span> ·{' '}
				<span>disclaimer: AI assisted documentation</span>
			</div>
			<span>
				<a href="/thanks">thanks</a> ·{' '}
				<a
					href="https://github.com/potahtml/pota/tree/master/documentation/content"
					target="_blank"
					rel="noopener"
				>
					edit
				</a>{' '}
				· made with{' '}
				<a
					href="https://github.com/potahtml/pota"
					target="_blank"
					rel="noopener"
				>
					pota
				</a>
			</span>
		</footer>
	)
}
