import { layout } from './ViewToggle.jsx'
import { searchTerm } from '../search.js'
import styles from './TopicList.module.css'

// renders a list of {name, href, desc} either as a comma-separated
// inline line, or as a vertical <li> list with descriptions.
//
// mode source: `props.mode` (a string or a reader function) when
// given, else the shared `layout` signal in ViewToggle.jsx. Passing
// `mode` lets a consumer (e.g. search) drive its own layout
// independently of the page toggle.
//
// while a search is active, the matched substring is highlighted in
// both the name and the description.
export function TopicList(props) {
	const items = props.items || []

	const readMode = () => {
		const m = props.mode
		if (m === undefined || m === null) return layout.read()
		return typeof m === 'function' ? m() : m
	}

	return () => {
		const term = searchTerm()

		if (readMode() === 'inline') {
			return (
				<p class={styles.inline}>
					{items.map((it, i) => (
						<>
							<a class={styles.name} href={it.href} title={it.desc}>
								<ApiName name={it.name} term={term} />
							</a>
							{i < items.length - 1 && (
								<span class={styles.comma}>, </span>
							)}
						</>
					))}
				</p>
			)
		}
		return (
			<ul class={styles.list}>
				{items.map(it => (
					<li class={styles.row}>
						<a class={styles.rowLink} href={it.href}>
							<span class={styles.name}>
								<ApiName name={it.name} term={term} />
							</span>
							<span
								class={styles.desc}
								prop:innerHTML={highlightHtml(it.desc, term)}
							/>
						</a>
					</li>
				))}
			</ul>
		)
	}
}

function escapeHtml(s) {
	return String(s == null ? '' : s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
}

// escaped HTML with the matched substring(s) wrapped in <mark>.
function highlightHtml(text, term) {
	if (!term) return escapeHtml(text)

	const src = String(text || '')
	const lower = src.toLowerCase()
	let out = ''
	let i = 0
	let idx
	while ((idx = lower.indexOf(term, i)) !== -1) {
		out += escapeHtml(src.slice(i, idx))
		out += `<mark class="${styles.mark}">${escapeHtml(
			src.slice(idx, idx + term.length),
		)}</mark>`
		i = idx + term.length
	}
	out += escapeHtml(src.slice(i))
	return out
}

// while searching, show the raw (highlighted) name. otherwise subdue
// the angle brackets around <Component/> names and the colon in
// `use:bind` so the actual name reads cleanly.
function ApiName(props) {
	const n = props.name
	const term = props.term

	if (term) return <span prop:innerHTML={highlightHtml(n, term)} />

	if (n.startsWith('<') && n.endsWith('/>')) {
		return (
			<>
				<span class={styles.ang}>&lt;</span>
				{n.slice(1, -2)}
				<span class={styles.ang}>/&gt;</span>
			</>
		)
	}
	if (n.includes(':')) {
		const [a, b] = n.split(':')
		return (
			<>
				{a}
				<span class={styles.colon}>:</span>
				{b}
			</>
		)
	}
	return n
}
