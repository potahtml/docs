import { Head } from 'pota/components'

import styles from './AiUsage.module.css'
import { ReferenceHero } from './ReferenceHero.jsx'
import { Content } from './Content.jsx'

// Page copy lives in markdown under pages/ (parsed at build time by
// vite-plugin-content). Edit pages/ai-usage.md to change it — no JSX
// changes needed.
import doc from '../pages/ai-usage.md'

export function AiUsage() {
	return (
		<section class={styles.aiUsage}>
			<Head>
				<title>AI usage — pota</title>
			</Head>

			<ReferenceHero title={doc.title} lede={doc.lede} />

			<Content items={doc.content} />
		</section>
	)
}
