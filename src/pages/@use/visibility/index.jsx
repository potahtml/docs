import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="visibility">
				<mark>pota/use/visibility</mark> tracks the{' '}
				<a
					href="https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API"
					target="_blank"
				>
					Page Visibility API
				</a>{' '}
				— whether the current document is visible to the user
				(e.g. the tab is active and the window isn't minimized
				or covered). Exposes a synchronous reader plus an{' '}
				<a href="/use/emitter">Emitter</a> pair, mirroring the
				shape of <a href="/use/fullscreen">fullscreen</a>.
			</Header>

			<Section title="Exports">
				<Code
					code={`import {
  // synchronous reader
  isDocumentVisible,    // isDocumentVisible() → boolean

  // emitter pair
  useDocumentVisible,   // useDocumentVisible() → signal accessor
  onDocumentVisible,    // onDocumentVisible(visible => …)
} from 'pota/use/visibility'`}
					render={false}
				/>
			</Section>

			<Section title="Reactive (signal accessor)">
				<p>
					<mark>useDocumentVisible()</mark> returns a signal
					accessor — read it as a function in JSX (or from an{' '}
					<mark>effect</mark>) to re-run on every change.
					Multiple consumers share one underlying{' '}
					<mark>visibilitychange</mark> listener.
				</p>
				<Code url="/pages/@use/visibility/signal.jsx"></Code>
			</Section>

			<Section title="Side-effect callback">
				<p>
					<mark>onDocumentVisible(fn)</mark> wraps the same
					accessor in an effect and forwards each value to{' '}
					<mark>fn</mark>. Use this for pausing timers,
					stopping animations, or refreshing data when the
					tab regains focus.
				</p>
				<Code url="/pages/@use/visibility/callback.jsx"></Code>
			</Section>

			<Section title="Synchronous read">
				<p>
					<mark>isDocumentVisible()</mark> is a plain function
					that reads <mark>document.visibilityState</mark>{' '}
					each call. It does <em>not</em> establish a
					subscription — use it for one-off checks (e.g.
					inside an event handler) where you don't need
					reactivity.
				</p>
				<Code
					code={`import { isDocumentVisible } from 'pota/use/visibility'

button.addEventListener('click', () => {
  if (isDocumentVisible()) doExpensiveThing()
})`}
					render={false}
				/>
			</Section>
		</>
	)
}
