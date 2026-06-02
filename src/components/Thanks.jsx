import { Head } from 'pota/components'

import styles from './Thanks.module.css'
import { ReferenceHero } from './ReferenceHero.jsx'
import { Content } from './Content.jsx'

// Page copy lives in markdown under pages/ (parsed at build time by
// vite-plugin-content). Edit pages/thanks.md to change the credits —
// no JSX changes needed.
import doc from '../../pages/thanks.md'

export function Thanks() {
	return (
		<section class={styles.thanks}>
			<Head>
				<title>thanks — pota</title>
			</Head>

			<ReferenceHero title={doc.title} lede={doc.lede.join(' ')} />

			<Content items={doc.content} />
		</section>
	)
}
