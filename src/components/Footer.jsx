import { location } from 'pota/use/location'
import styles from './Footer.module.css'

export function Footer() {
	const editHref = () =>
		`https://github.com/potahtml/pota/edit/master/documentation/content${location.pathname()}.md`

	return (
		<footer class={styles.footer}>
			<div>
				<span>docs</span> ·{' '}
				<span>disclaimer: AI assisted documentation</span>
			</div>
			<span>
				<a href="/thanks">thanks</a> ·{' '}
				{()=>location.pathname() !== '/' &&
					location.pathname() !== '/playground' &&
					location.pathname() !== '/cheatsheet' &&
					location.pathname() !== '/thanks' && (
						<>
							<a
								href={editHref()}
								target="_blank"
								rel="noopener"
							>
								edit
							</a>{' '}
							·{' '}
						</>
					)}{' '}
				made with{' '}
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
