import { Head } from 'pota/components'
import styles from './NotFound.module.css'

export function NotFound(props) {
	return (
		<section class={styles.notFound}>
			<Head>
				<title>not found — pota</title>
				<meta property="og:title" content={"not found — pota"} />
				<meta name="description" content={""} />
				<meta
					property="og:description"
					content={""}
				/>
			</Head>

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
