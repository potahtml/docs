import styles from './Content.module.css'
import { Heading } from './Heading.jsx'
import { Snippet } from './Snippet.jsx'
import { Playground } from './playground/Playground.jsx'
import { Table } from './Table.jsx'

// renders a parsed content array (see content-parser.js). each item is
// one of: paragraph | heading | list | table | file. prose items carry
// pre-rendered inline HTML (trusted — it's our own markdown), injected
// via prop:innerHTML.
export function Content(props) {
	const items = props.items || []
	return items.map(item => renderItem(item, props.tableView))
}

function renderItem(item, tableView) {
	switch (item.type) {
		case 'paragraph':
			return <p class={styles.p} prop:innerHTML={item.html} />

		case 'heading':
			return (
				<Heading level={item.level} id={item.id}>
					{item.text}
				</Heading>
			)

		case 'list':
			return item.ordered ? (
				<ol class={styles.list}>
					{item.items.map(html => (
						<li prop:innerHTML={html} />
					))}
				</ol>
			) : (
				<ul class={styles.list}>
					{item.items.map(html => (
						<li prop:innerHTML={html} />
					))}
				</ul>
			)

		case 'table':
			return (
				<Table
					header={item.header}
					rows={item.rows}
					view={tableView}
				/>
			)

		case 'file': {
			const files = [
				{
					name: item.name || '',
					lang: item.lang,
					source: item.source,
				},
			]
			return item.live ? (
				<Playground files={files} />
			) : (
				<Snippet files={files} />
			)
		}

		case 'files':
			return item.live ? (
				<Playground files={item.files} entry={item.entry} />
			) : (
				<Snippet files={item.files} />
			)

		default:
			return null
	}
}
