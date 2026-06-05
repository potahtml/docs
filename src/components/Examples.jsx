import { ready, signal, syncEffect } from 'pota'
import { location } from 'pota/use/location'
import { scrollToSelector } from 'pota/use/scroll'
import { Content } from './Content.jsx'
import { Heading } from './Heading.jsx'
import { Sep } from './Sep.jsx'
import styles from './Examples.module.css'

// stepped example gallery. one selector button per step, and a single
// active panel below — never more than one example on screen at once.
// steps: [{ slug, title, content }] (see content-parser.js).
//
// the inline/list button toggles the selector layout:
//   inline — buttons sit in a compact row (title only)
//   list   — buttons stack vertically, each with a short description
export function Examples(props) {
	const steps = props.steps || []
	const total = steps.length
	// props.id is the page route (e.g. "use/animate"). Slug it to
	// [a-z0-9-] so the heading id stays a valid CSS identifier: the "/"
	// would otherwise make "#use/animate-example-foo" an invalid
	// selector (breaking :target styling) and keeps shareable hashes
	// short.
	const base = (props.id || 'ex')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')

	const active = signal(0)
	const mode = signal('inline')

	const step = () => steps[active.read()] || {}

	const stepId = i => base + '-example-' + (steps[i]?.slug || i)

	// reveal-on-link: when the URL hash points at one of our steps,
	// select it — so a shared / deep link to a hidden example shows it.
	// syncEffect (not effect) so the switch lands during the router's
	// navigation write and its own scroll-to-hash finds the freshly
	// rendered heading; on initial load the router doesn't scroll, so we
	// scroll after render via ready().
	syncEffect(() => {
		const id = location.hash().slice(1)
		if (!id) return
		const i = steps.findIndex((_, idx) => stepId(idx) === id)
		if (i === -1) return
		active.write(i)
		ready(() => scrollToSelector('#' + id))
	})

	const modeBtn = m => () =>
		styles.modeBtn + (mode.read() === m ? ' ' + styles.active : '')

	return (
		<section class={styles.examples}>
			<div class={styles.head}>
				<Heading level={2} id="examples">
					Examples
				</Heading>
				<span class={styles.meta}>
					{total} {total === 1 ? 'step' : 'steps'}
				</span>
				<div
					class={styles.modes}
					role="group"
					aria-label="Examples layout"
				>
					<button
						class={modeBtn('inline')}
						on:click={() => mode.write('inline')}
					>
						⊞ inline
					</button>
					<button
						class={modeBtn('list')}
						on:click={() => mode.write('list')}
					>
						☰ list
					</button>
				</div>
			</div>

			{() => {
				const list = mode.read() === 'list'
				return (
					<div
						class={
							styles.chips + (list ? ' ' + styles.listChips : '')
						}
						role="tablist"
					>
						{steps.map((s, i) => {
							const desc = list ? stepDesc(s) : ''
							return (
								<button
									class={() =>
										styles.chip +
										(active.read() === i ? ' ' + styles.active : '')
									}
									on:click={() => active.write(i)}
								>
									<span class={styles.label}>
										<span class={styles.num}>
											{String(i + 1).padStart(2, '0')}
										</span>
										{s.title}
									</span>
									{list && desc && (
										<>
											<Sep />
											<span class={styles.chipDesc}>{desc}</span>
										</>
									)}
								</button>
							)
						})}
					</div>
				)
			}}

			{() => {
				const s = step()
				return (
					<article class={styles.panel}>
						<Heading level={3} id={stepId(active.read())}>
							{s.title}
							<span class={styles.tag}>
								example {String(active.read() + 1).padStart(2, '0')} /{' '}
								{String(total).padStart(2, '0')}
							</span>
						</Heading>
						<Content items={s.content} />
					</article>
				)
			}}
		</section>
	)
}

// first paragraph of a step, as plain text — used as the chip
// description in list mode. Round-trips through the DOM so inline tags
// drop and entities (e.g. &#39;) decode; a bare regex strip would leave
// the escaped entities to surface as literal text in the chip.
function stepDesc(step) {
	const para = (step.content || []).find(c => c.type === 'paragraph')
	if (!para) return ''
	const el = document.createElement('div')
	el.innerHTML = para.html
	return el.textContent || ''
}
