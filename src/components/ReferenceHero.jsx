import styles from './ReferenceHero.module.css'
import { HeroMeta } from './HeroMeta.jsx'

// top-of-page hero for the reference index: title, lede, quick links.
export function ReferenceHero(props) {
	const links = props.links || []
	return (
		<section class={styles.hero}>
			<h1>{props.title}</h1>
			<p class={styles.lede}>{props.lede}</p>
			{links.length > 0 && <HeroMeta items={links} />}
		</section>
	)
}
