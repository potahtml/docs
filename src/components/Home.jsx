import { Head } from 'pota/components'
import { ReferenceHero } from './ReferenceHero.jsx'
import { Content } from './Content.jsx'

// Landing content for `/` — hero + intro prose. The page copy lives in
// markdown (parsed at build time by vite-plugin-content); edit
// pages/home.md to change it, no JSX needed. The API catalog (Browse) is
// rendered by the shell below this — see index.jsx.
import doc from '../pages/home.md'

const desc = doc.lede
	?.map(s => s.replace(/<[^>]*>/g, ''))
	.join(' ')
	.replace(/\s+/g, ' ')
	.trim()

export function Home() {
	return (
		<>
			<Head>
				<title>pota — small reactive web renderer</title>
				{desc && (
					<>
						<meta property="og:title" content={"pota — small reactive web renderer"} />
						<meta name="description" content={desc} />
						<meta
							property="og:description"
							content={desc}
						/>
					</>
				)}
			</Head>

			<ReferenceHero title={doc.title} lede={doc.lede} />
			<Content items={doc.content} />
		</>
	)
}
