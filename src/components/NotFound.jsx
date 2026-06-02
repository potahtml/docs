import styles from './NotFound.module.css'

export function NotFound(props) {
	return (
		<section class={styles.notFound}>
			<h1>
				<span class={styles.hash}>#</span>not found
			</h1>
			<p>
				<code>{props.path}</code> has no page yet.{' '}
				<a href="/">back home</a>
			</p>
		</section>
	)
}
