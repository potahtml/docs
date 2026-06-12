import { memo, signal } from 'pota'

import styles from './Browse.module.css'
import { BrowseSection } from './BrowseSection.jsx'
import { filterSections, query, searchTerm } from '../search.js'

const searching = () => searchTerm().length > 0

// the catalog cross-lists some pages in several topics (see
// tools/topics.js) — count each export once, not once per listing.
const countUnique = sections => {
	const keys = new Set()
	for (const s of sections)
		for (const it of s.items) keys.add(it.name + '|' + it.href)
	return keys.size
}

// the API catalog. collapsed to a slim reveal button by default on every
// page — including the index — so the page content comes first; it
// expands while searching or when manually revealed.
export function Browse(props) {
	const sections = props.sections || []
	const expanded = signal(false)

	// memo so that typing (which keeps `show` true) does not rebuild the
	// whole catalog — only its inner counts / sections react.
	const show = memo(() => searching() || expanded.read())

	const total = countUnique(sections)

	// The catalog is always rendered so every topic link stays in the DOM
	// for crawlers; collapsing only hides it with CSS (display:none) rather
	// than unmounting it. The slim reveal button shows in its place.
	return () => (
		<>
			{() =>
				!show() && (
					<button
						class={styles.reveal}
						on:click={() => expanded.write(true)}
					>
						<span class={styles.revealChev}>▸</span> browse all apis
						<span class={styles.revealCount}>{total}</span>
					</button>
				)
			}
			<div class={() => (show() ? '' : styles.collapsed)}>
				<Catalog
					sections={sections}
					onHide={() => {
						// collapse and clear the filter together, so "hide"
						// also dismisses an active search
						expanded.write(false)
						query.write('')
					}}
				/>
			</div>
		</>
	)
}

function Catalog(props) {
	const sections = props.sections
	const visible = () => filterSections(sections)

	// clicking a topic link navigates (via pota's global link handler) —
	// collapse the catalog and clear the search (via onHide) so the
	// destination page shows content. The catalog's display:none rides the
	// page's view transition, fading out with the swap. Modified /
	// non-primary clicks (open in new tab, etc.) are left untouched.
	const onClick = e => {
		if (
			e.defaultPrevented ||
			e.button !== 0 ||
			e.metaKey ||
			e.altKey ||
			e.ctrlKey ||
			e.shiftKey
		)
			return
		if (e.target.closest('a')) props.onHide()
	}

	return (
		<section class={styles.catalog} on:click={onClick}>
			{/* the whole bar is the collapse toggle — clicking it hides the
			    catalog (and clears any active search), mirroring the reveal
			    button that expands it */}
			<button class={styles.bar} on:click={props.onHide}>
				<span class={styles.barChev}>▾</span> browse all apis
				<span class={styles.barCount}>
					<strong>{() => visible().length}</strong> topics ·{' '}
					<strong>{() => countUnique(visible())}</strong> exports
				</span>
			</button>

			<div class={styles.sections}>
				{sections.map(s => (
					<BrowseSection section={s} />
				))}
			</div>
		</section>
	)
}
