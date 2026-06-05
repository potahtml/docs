import { Head } from 'pota/components'

import styles from './Cheatsheet.module.css'
import { ReferenceHero } from './ReferenceHero.jsx'
import { Content } from './Content.jsx'

// Page copy lives in the pota repo at documentation/cheatsheet.md
// (parsed at build time by vite-plugin-content). Edit that file to
// change the heading, blurb, or the cheatsheet itself — no JSX changes
// needed. It sits outside this Vite root; see server.fs.allow.
import doc from '../../../../documentation/cheatsheet.md'

export function Cheatsheet() {
	return (
		<section class={styles.cheatsheet}>
			<Head>
				<title>cheatsheet — pota</title>
			</Head>

			<ReferenceHero title={doc.title} lede={doc.lede} />

			<Content items={doc.content} />
		</section>
	)
}
