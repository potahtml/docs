import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="overlay">
				<mark>pota/use/overlay</mark> is the shared primitive
				behind <a href="/use/tooltip">tooltip</a> and{' '}
				<a href="/use/popover">popover</a>. Most code reaches
				for those instead — <mark>createOverlay</mark> is the
				low-level imperative API for floating, anchored,
				reactively-positioned panels.
			</Header>

			<Section title="When to use it">
				<p>
					If you want hover/focus-driven tooltips, use{' '}
					<a href="/use/tooltip">tooltip</a>. If you want an
					imperative dialog-like floating panel with focus
					management, use <a href="/use/popover">popover</a>.
					Reach for <mark>createOverlay</mark> directly when
					you're building a new floating-UI primitive (e.g.
					context menus, autocomplete dropdowns) and need
					control over how state is wired.
				</p>
			</Section>

			<Section title="Shape">
				<p>
					You hand <mark>createOverlay</mark> a bag of accessor
					functions (the overlay reads them reactively); it
					mounts a wrap + panel into <mark>document.body</mark>,
					repositions on every change, and tracks scroll and
					viewport resize for the lifetime of the overlay.
					Returns a disposer; calling it unmounts the overlay
					and releases the shared stylesheet. Idempotent.
				</p>
				<Code
					code={`import { createOverlay } from 'pota/use/overlay'

const dispose = createOverlay({
  // required
  opened:   () => isOpen.read(),       // truthy → visible
  related:  () => anchorNode.read(),   // Element | null
  content:  () => content.read(),      // string | JSX | unknown
  position: () => position.read(),     // OverlayPosition
  arrows:   () => arrows.read(),       // truthy → show arrow

  // optional
  role:        'dialog',               // panel role (default 'dialog')
  ariaLabel:   () => 'help',           // override aria-label
  manageFocus: true,                   // focus panel on open, restore on close
})

// later
dispose()`}
					render={false}
				/>
			</Section>

			<Section title="Positions">
				<p>
					<mark>OverlayPosition</mark> includes cardinals (
					<mark>top</mark>, <mark>bottom</mark>,{' '}
					<mark>left</mark>, <mark>right</mark>), plain
					corners (<mark>top-left</mark>,{' '}
					<mark>top-right</mark>, <mark>bottom-left</mark>,{' '}
					<mark>bottom-right</mark>), and overlap corners
					(matching edges aligned, e.g.{' '}
					<mark>top-left-overlap</mark>).
				</p>
				<p>
					Coordinates are clamped to the viewport — the panel
					will not render beyond the visible window. Clamping
					is naive: it does <em>not</em> flip the requested
					position when the panel doesn't fit.
				</p>
			</Section>

			<Section title="manageFocus">
				<p>
					When set, the panel gets <mark>tabindex="-1"</mark>,
					focus moves into it on open, and is restored to the
					previously-focused element on close (or on
					dispose-while-open). Used by{' '}
					<a href="/use/popover">popover</a>; tooltips leave
					it off so hover doesn't steal focus.
				</p>
			</Section>
		</>
	)
}
