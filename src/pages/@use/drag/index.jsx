import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="draggable">
				<mark>pota/use/drag</mark> exports{' '}
				<mark>draggable</mark>, a ref factory that turns the
				element into a drag handle. <mark>onMove</mark> is
				called on every <mark>pointermove</mark> between{' '}
				<mark>pointerdown</mark> and{' '}
				<mark>pointerup</mark>/<mark>pointercancel</mark>, with
				the cumulative delta from the starting position.
			</Header>

			<p>
				<mark>pointermove</mark> and{' '}
				<mark>pointerup</mark> are listened for on{' '}
				<mark>document</mark>, so the gesture continues even
				when the pointer leaves the handle. Each callback
				receives a <mark>DragInfo</mark> with the cumulative
				delta (<mark>dx</mark>, <mark>dy</mark>), the current
				pointer position (<mark>x</mark>, <mark>y</mark>), the
				origin (<mark>originX</mark>, <mark>originY</mark>),
				pointer coordinates relative to the element's box at
				<mark> pointerdown</mark> clamped to the box (
				<mark>elementX</mark>, <mark>elementY</mark>), the same
				values expressed as <mark>0</mark>–<mark>100</mark>{' '}
				percent (<mark>percentX</mark>, <mark>percentY</mark>),
				and the raw <mark>event</mark>.
			</p>
			<p>
				Use <mark>dx</mark>/<mark>dy</mark> when you're moving
				the element itself. Use <mark>elementX</mark>/
				<mark>elementY</mark> or <mark>percentX</mark>/
				<mark>percentY</mark> for sliders, range pickers, and
				color canvases — where the element doesn't move during
				the gesture and the pointer position within its bounds
				is what matters.
			</p>

			<Section title="Exports">
				<Code
					code={`import { draggable } from 'pota/use/drag'

draggable({
  onMove(info) { /* required */ },
  onStart(info) { /* optional */ },
  onEnd(info) { /* optional */ },
})`}
					render={false}
				/>
			</Section>

			<Section title="Drag a box around">
				<p>
					Drive an absolutely-positioned element from{' '}
					<mark>dx</mark>/<mark>dy</mark> deltas. Track the
					element's last commit on <mark>onEnd</mark> so the
					next drag starts where the previous one left off.
				</p>
				<Code url="/pages/@use/drag/snippet.jsx"></Code>
			</Section>
		</>
	)
}
