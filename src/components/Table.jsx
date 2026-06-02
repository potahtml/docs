import { signal } from 'pota'
import styles from './Table.module.css'

// the table/list segmented toggle. exported so the owning section can
// render it on the right of its heading (see Subsection.jsx).
export function TableToggle(props) {
	const view = props.view
	const btn = v => () =>
		styles.modeBtn + (view.read() === v ? ' ' + styles.active : '')

	return (
		<div class={styles.modes} role="group" aria-label="Table layout">
			<button
				class={btn('table')}
				on:click={() => view.write('table')}
			>
				▦ table
			</button>
			<button class={btn('list')} on:click={() => view.write('list')}>
				☰ list
			</button>
		</div>
	)
}

// renders a parsed table in one of two views:
//   table — the columnar view (default)
//   list  — each row stacked as labeled fields; better when cell text
//           is long and would blow out the column widths.
// header / rows carry pre-rendered inline HTML (see content-parser.js).
//
// `view` may be supplied by the owning section (so the toggle can live
// on its heading); when omitted the table renders its own toggle.
export function Table(props) {
	const view = props.view || signal('table')

	return (
		<div class={styles.wrap}>
			{!props.view && (
				<div class={styles.toolbar}>
					<TableToggle view={view} />
				</div>
			)}

			{() =>
				view.read() === 'list' ? (
					<div class={styles.list}>
						{props.rows.map(row => (
							<div class={styles.row}>
								{row.map((cell, i) => (
									<div class={styles.field}>
										<span
											class={styles.label}
											prop:innerHTML={props.header[i] || ''}
										/>
										<span
											class={styles.value}
											prop:innerHTML={cell}
										/>
									</div>
								))}
							</div>
						))}
					</div>
				) : (
					<table class={styles.table}>
						<thead>
							<tr>
								{props.header.map(h => (
									<th prop:innerHTML={h} />
								))}
							</tr>
						</thead>
						<tbody>
							{props.rows.map(row => (
								<tr>
									{row.map(c => (
										<td prop:innerHTML={c} />
									))}
								</tr>
							))}
						</tbody>
					</table>
				)
			}
		</div>
	)
}
