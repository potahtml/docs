import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="mouse">
				<mark>pota/use/mouse</mark> tracks held mouse buttons and
				pointer position document-wide. Backed by Pointer Events
				(not Mouse Events) so back / forward buttons fire too,
				and pen / touch input is covered.
			</Header>

			<p>
				Tracking is lazy and refcounted: the first subscriber
				attaches <mark>pointer*</mark> + <mark>blur</mark>{' '}
				listeners on <mark>window</mark>; the last unsubscriber
				removes them and clears held state.{' '}
				<mark>pointerup</mark> is honored unconditionally so
				buttons can't get stuck, and a <mark>window</mark>{' '}
				<mark>blur</mark> (e.g. alt-tab while held) clears
				everything.
			</p>

			<Section title="Exports">
				<Code
					code={`import {
  // held buttons
  useMouseButton,    // useMouseButton(button) → reactive boolean
  mouseButtons,      // mouseButtons()         → live Set<number> (non-reactive)

  // pointer position (client coords)
  useMousePosition,  // useMousePosition()     → reactive { x, y }
  mousePosition,     // mousePosition()        → snapshot { x, y }
} from 'pota/use/mouse'`}
					render={false}
				/>
			</Section>

			<Section title="Button numbers">
				<p>
					Follows <mark>PointerEvent.button</mark>:
				</p>
				<ul>
					<li>
						<mark>0</mark> — primary (left)
					</li>
					<li>
						<mark>1</mark> — auxiliary (middle / wheel)
					</li>
					<li>
						<mark>2</mark> — secondary (right)
					</li>
					<li>
						<mark>3</mark> — back
					</li>
					<li>
						<mark>4</mark> — forward
					</li>
				</ul>
			</Section>

			<Section title="useMouseButton — reactive">
				<Code
					code={`import { useMouseButton } from 'pota/use/mouse'

const middle = useMouseButton(1)
effect(() => {
  if (middle()) startPanning()
  else stopPanning()
})`}
					render={false}
				/>
			</Section>

			<Section title="mouseButtons / mousePosition — non-reactive (for rAF loops)">
				<p>
					Inside <a href="/use/animate">useAnimationFrame</a>{' '}
					you don't want to subscribe — read the live set and
					the latest position directly each frame.{' '}
					<mark>mouseButtons()</mark> returns a live{' '}
					<mark>Set</mark> mutated in place;{' '}
					<mark>mousePosition()</mark> returns a snapshot{' '}
					<mark>{`{ x, y }`}</mark> at the moment of the call.
				</p>
				<Code
					code={`import { mouseButtons, mousePosition } from 'pota/use/mouse'
import { useAnimationFrame } from 'pota/use/animate'

const held = mouseButtons()
useAnimationFrame(() => {
  if (held.has(0)) {
    const { x, y } = mousePosition()
    paintAt(x, y)
  }
}).start()`}
					render={false}
				/>
			</Section>
		</>
	)
}
