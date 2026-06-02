import styles from './BrowseSection.module.css'
import { TopicList } from './TopicList.jsx'
import { itemMatches, searchTerm } from '../search.js'

// one topic in the catalog: heading + subpath + export count, then the
// inline/list TopicList. filters its own items to the search query and
// hides entirely when nothing matches.
export function BrowseSection(props) {
	const s = props.section

	const filtered = () => {
		const term = searchTerm()
		if (!term) return s.items
		return s.items.filter(it => itemMatches(it, term))
	}

	return () => {
		const items = filtered()
		if (items.length === 0) return null

		return (
			<section class={styles.section} id={s.id}>
				<header class={styles.head}>
					<span class={styles.title}>
						<span class={styles.hash}>#</span>
						{s.title}
					</span>
					<span class={styles.meta}>{s.subpath}</span>
					<span class={styles.count}>{items.length}</span>
				</header>
				<TopicList items={items} />
			</section>
		)
	}
}
