import { Head } from 'pota/components'
import styles from './DocPage.module.css'
import { DocHero } from './DocHero.jsx'
import { Subsection } from './Subsection.jsx'
import { Examples } from './Examples.jsx'

// the layout of a single API doc page:
//   header — title + lede (DocHero) and an on-this-page Toc derived
//            from the parsed section headings
//   subsections — parsed prose / tables / snippets per section
//   examples — a scrollable Example gallery, kept out of the main
//              flow so a long example set never fills the page.
//
// driven by a parsed `doc` object; see content-parser.js for the shape.
export function DocPage(props) {
	const doc = props.doc || {}
	const sections = doc.sections || []
	const examples = doc.examples || []

	const desc = doc.lede
		?.map(s => s.replace(/<[^>]*>/g, ''))
		.join(' ')
		.replace(/\s+/g, ' ')
		.trim()

	return (
		<article class={styles.page}>
			<Head>
				<title>{doc.title} — pota</title>
				{desc && (
					<>
						<meta property="og:title" content={doc.title} />
						<meta name="description" content={desc} />
						<meta
							property="og:description"
							content={desc}
						/>
					</>
				)}
			</Head>

			<DocHero
				title={doc.title}
				syntax={doc.syntax}
				lede={doc.lede}
			/>

			{sections.map(s => (
				<Subsection id={s.id} title={s.title} content={s.content} />
			))}

			{examples.length > 0 && (
				<Examples id={doc.id} steps={examples} />
			)}
		</article>
	)
}
