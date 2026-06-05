import styles from './ReferenceHero.module.css'
import { HeroMeta } from './HeroMeta.jsx'

// top-of-page hero for the reference index: title, lede, quick links.
// `lede` is an array of pre-rendered inline-HTML paragraphs (or a
// single string); injected via prop:innerHTML like DocHero, so entities
// (e.g. &#39;) decode and any inline markup renders instead of showing
// as literal text. One `<p>` per paragraph keeps them visually separate.
export function ReferenceHero(props) {
	const links = props.links || []
	const ledes = Array.isArray(props.lede)
		? props.lede
		: props.lede
			? [props.lede]
			: []
	return (
		<section class={styles.hero}>
			<h1>{props.title}</h1>
			{ledes.map(l => (
				<p class={styles.lede} prop:innerHTML={l} />
			))}
			{links.length > 0 && <HeroMeta items={links} />}
		</section>
	)
}
