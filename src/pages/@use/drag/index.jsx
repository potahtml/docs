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
				receives a <mark>DragInfo</mark> with{' '}
				<mark>dx</mark>, <mark>dy</mark>, the current{' '}
				<mark>x</mark>/<mark>y</mark>, the origin, and the raw
				event.
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
