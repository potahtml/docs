import styles from './Footer.module.css'

export function Footer() {
	return (
		<footer class={styles.footer}>
			<div>
				<span>docs prototype</span> ·{' '}
				<span>disclaimer: AI assisted documentation</span>
			</div>
			<span>
				<a
					href="https://pota.quack.uy/Articles/"
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
