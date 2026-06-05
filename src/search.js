import { signal } from 'pota'

// shared search query — the Header input writes it, the catalog
// (Browse) reads it to reveal + filter.
export const query = signal('')

export const searchTerm = () => query.read().trim().toLowerCase()

export const itemMatches = (it, term) =>
	it.name.toLowerCase().includes(term) ||
	(it.desc && it.desc.toLowerCase().includes(term))

// sections with their items filtered to the current query; topics with
// no match are dropped. returns the original sections when not
// searching.
export const filterSections = sections => {
	const term = searchTerm()
	if (!term) return sections
	const out = []
	for (const s of sections) {
		const items = s.items.filter(it => itemMatches(it, term))
		if (items.length) out.push({ ...s, items })
	}
	return out
}
