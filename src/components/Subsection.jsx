import { signal } from 'pota'
import styles from './Subsection.module.css'
import { Heading } from './Heading.jsx'
import { Content } from './Content.jsx'
import { TableToggle } from './Table.jsx'

// a titled subsection of a doc page: heading + a parsed content array
// (paragraphs, lists, tables, code). see content-parser.js for shape.
//
// when the section contains a table, a shared table/list view toggle
// is rendered on the right of the heading and drives every table in
// the section.
export function Subsection(props) {
	const content = props.content || []
	const hasTable = content.some(c => c.type === 'table')
	const tableView = hasTable ? signal('table') : null

	return (
		<div class={styles.subsection}>
			<div class={styles.headRow}>
				<Heading level={props.level || 2} id={props.id}>
					{props.title}
				</Heading>
				{hasTable && <TableToggle view={tableView} />}
			</div>
			<Content items={content} tableView={tableView} />
		</div>
	)
}
