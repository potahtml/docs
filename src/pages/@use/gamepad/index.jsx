import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="gamepad">
				<mark>pota/use/gamepad</mark> exposes connect state,
				button presses, analog triggers, and axis positions as
				reactive accessors, plus a non-reactive snapshot for
				game loops.
			</Header>

			<p>
				The Gamepad API has no per-button events: state is
				sampled via <mark>navigator.getGamepads()</mark> every
				frame. This module runs a singleton{' '}
				<mark>requestAnimationFrame</mark> poll that starts on
				the first subscription and stops once the last consumer
				disposes. Even connect / disconnect is derived from the
				poll — one source of truth, and polling observes
				everything <mark>gamepadconnected</mark> /{' '}
				<mark>gamepaddisconnected</mark> would within one frame.
			</p>

			<Section title="Exports">
				<Code
					code={`import {
  useGamepadConnected,  // (index = 0) → reactive boolean
  useGamepadButton,     // (buttonIndex, gamepadIndex = 0) → reactive boolean
  useGamepadTrigger,    // (buttonIndex, gamepadIndex = 0) → reactive number 0..1
  useGamepadAxis,       // (axisIndex,  gamepadIndex = 0) → reactive number -1..1
  gamepadSnapshot,      // (index = 0)  → Gamepad | null (non-reactive, no rAF)
} from 'pota/use/gamepad'`}
					render={false}
				/>
			</Section>

			<Section title="Reactive accessors">
				<p>
					Each reactive accessor lazily allocates a backing
					signal the first time it's called for a given
					(gamepad, button/axis) pair, so the per-frame poll
					only updates signals consumers actually subscribed
					to. Cleanup happens automatically when the owning
					scope disposes — the rAF loop stops once nothing is
					listening.
				</p>
				<Code
					code={`import {
  useGamepadConnected,
  useGamepadButton,
  useGamepadTrigger,
  useGamepadAxis,
} from 'pota/use/gamepad'

const connected = useGamepadConnected(0)
const jump      = useGamepadButton(0)     // A on standard mapping
const lt        = useGamepadTrigger(6)    // left trigger 0..1
const leftX     = useGamepadAxis(0)       // -1..1, raw — apply your own deadzone`}
					render={false}
				/>
			</Section>

			<Section title="Snapshot — for tight game loops">
				<p>
					Inside a <a href="/use/animate">useAnimationFrame</a>{' '}
					loop you typically don't want reactive subscriptions.
					<mark>gamepadSnapshot(index)</mark> returns the raw{' '}
					<mark>Gamepad</mark> object (or <mark>null</mark>)
					without starting the rAF poll — read every button and
					axis directly each frame.
				</p>
				<Code
					code={`import { gamepadSnapshot } from 'pota/use/gamepad'
import { useAnimationFrame } from 'pota/use/animate'

useAnimationFrame(() => {
  const pad = gamepadSnapshot()
  if (!pad) return
  const [lx, ly] = pad.axes
  if (Math.abs(lx) > 0.15) move(lx * speed)
}).start()`}
					render={false}
				/>
			</Section>
		</>
	)
}
