import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="popover">
				<mark>pota/use/popover</mark> creates an imperative
				floating popover controller anchored to a related
				element. Each call creates an <em>independent</em>{' '}
				overlay instance (unlike <a href="/use/tooltip">tooltip</a>
				, which shares one). Use this when content is driven
				by async form flows, confirmations, or validation
				handlers — not by pointer / focus refs.
			</Header>

			<p>
				The panel is rendered with <mark>role="dialog"</mark>{' '}
				and <mark>tabindex="-1"</mark>; focus moves to it on
				open and is restored to the previously-focused element
				on close (or on <mark>dispose()</mark> while open).
			</p>

			<Section title="Controller API">
				<Code
					code={`import { popover } from 'pota/use/popover'

const p = popover()

p.setRelated(anchor)              // Element | null — the anchor
p.setContent(<div>Saved!</div>)   // string | JSX | unknown
p.setPosition('bottom')           // OverlayPosition
p.setArrows(false)

p.open()
p.close()
p.dispose()                       // when the controller is no longer needed`}
					render={false}
				/>
			</Section>

			<Section title="When to use popover vs tooltip">
				<ul>
					<li>
						<mark>tooltip</mark> — hover/focus-driven,
						single shared instance, no focus management.
						Reach for it 90% of the time.
					</li>
					<li>
						<mark>popover</mark> — imperative; "save was
						successful" pulses, async confirmation prompts,
						form-validation panels, multi-step menus. Per-call
						instance, owns focus.
					</li>
				</ul>
			</Section>

			<Section title="Position values">
				<p>
					Same set as{' '}
					<a href="/use/overlay">overlay</a> — cardinals,
					plain corners, overlap corners. Coordinates are
					clamped to the viewport (no auto-flip).
				</p>
			</Section>
		</>
	)
}
