import { ReferenceHero } from './ReferenceHero.jsx'
import { Content } from './Content.jsx'

// Landing content for `/` — hero + intro prose. The page copy lives in
// markdown (parsed at build time by vite-plugin-content); edit
// pages/home.md to change it, no JSX needed. The API catalog (Browse) is
// rendered by the shell below this — see index.jsx.
import doc from '../../pages/home.md'

export function Home() {
	return (
		<>
			<ReferenceHero title={doc.title} lede={doc.lede.join(' ')} />
			<Content items={doc.content} />
		</>
	)
}
