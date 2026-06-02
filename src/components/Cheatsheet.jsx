import { Head } from 'pota/components'

import styles from './Cheatsheet.module.css'
import { ReferenceHero } from './ReferenceHero.jsx'
import { Content } from './Content.jsx'

// Page copy lives in markdown under pages/ (parsed at build time by
// vite-plugin-content). Edit pages/cheatsheet.md to change the heading,
// blurb, or the cheatsheet itself — no JSX changes needed.
import doc from '../../pages/cheatsheet.md'

export function Cheatsheet() {
	return (
		<section class={styles.cheatsheet}>
			<Head>
				<title>cheatsheet — pota</title>
			</Head>

			<ReferenceHero title={doc.title} lede={doc.lede.join(' ')} />

			<Content items={doc.content} />
		</section>
	)
}
