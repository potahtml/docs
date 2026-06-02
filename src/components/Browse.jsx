import { memo, signal } from 'pota'

import styles from './Browse.module.css'
import { ViewToggle } from './ViewToggle.jsx'
import { BrowseSection } from './BrowseSection.jsx'
import { filterSections, query, searchTerm } from '../search.js'

const searching = () => searchTerm().length > 0

// the API catalog. collapsed to a slim reveal button by default on every
// page — including the index — so the page content comes first; it
// expands while searching or when manually revealed.
export function Browse(props) {
	const sections = props.sections || []
	const expanded = signal(false)

	// memo so that typing (which keeps `show` true) does not rebuild the
	// whole catalog — only its inner counts / sections react.
	const show = memo(() => searching() || expanded.read())

	const total = sections.reduce((a, s) => a + s.items.length, 0)

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

	// clicking a topic/subtopic link navigates — collapse the catalog and
	// clear the search (via onHide) so the destination page shows content.
	const onClick = e => {
		if (e.target.closest('a')) props.onHide()
	}

	return (
		<section class={styles.catalog} on:click={onClick}>
			<div class={styles.controls}>
				<span class={styles.summary}>
					<strong>{() => visible().length}</strong> topics ·{' '}
					<strong>
						{() => visible().reduce((a, s) => a + s.items.length, 0)}
					</strong>{' '}
					exports
				</span>
				<ViewToggle />
				{/* the catalog is only visible when revealed or searching
				    (collapsed via CSS otherwise), so the control is always
				    available — to collapse it and/or clear the search */}
				<button class={styles.hide} on:click={props.onHide}>
					hide
				</button>
			</div>

			{sections.map(s => (
				<BrowseSection section={s} />
			))}
		</section>
	)
}
