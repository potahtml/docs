import { signal } from 'pota'
import styles from './Snippet.module.css'
import { Editor } from './playground/Editor.jsx'

// Static code block in a fake-OS window. One file, or several tabbed
// files. Read-only — it's CodeMirror purely for syntax highlighting.
// Live (runnable) examples render through Playground instead; see
// Content.jsx.
export function Snippet(props) {
	const files = props.files || []
	const active = signal(files[0]?.name || '')
	const multi = files.length > 1

	const current = () =>
		files.find(f => f.name === active.read()) ||
		files[0] || { lang: '' }

	return (
		<div class={styles.snippet}>
			<div class={styles.head}>
				<span class={styles.dots}>
					<span class={styles.close} />
					<span class={styles.min} />
					<span class={styles.max} />
				</span>

				{multi ? (
					<div class={styles.tabs}>
						{files.map(f => (
							<button
								class={() =>
									styles.tab +
									(active.read() === f.name
										? ' ' + styles.active
										: '')
								}
								on:click={() => active.write(f.name)}
							>
								{f.name}
							</button>
						))}
					</div>
				) : (
					files[0]?.name && <span>{files[0].name}</span>
				)}

				<span class={styles.lang}>{() => current().lang}</span>
			</div>

			<div class={styles.body}>
				<Editor
					editable={false}
					files={() => files}
					activeFile={active.read}
				/>
			</div>
		</div>
	)
}
