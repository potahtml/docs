import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="storage">
				<mark>storage(prefix)</mark> from{' '}
				<mark>pota/use/storage</mark> builds a namespaced signal
				factory. Every signal it produces persists under{' '}
				<mark>prefix + key</mark> in <mark>localStorage</mark> —
				falling back to <mark>sessionStorage</mark>, and then to
				an in-memory shim when both are unavailable (private
				mode, sandboxed iframes, etc.). The caller picks the
				separator: <mark>'my-app:'</mark>,{' '}
				<mark>'my-app/'</mark>, or no suffix at all.
			</Header>

			<p>
				Each call returns a plain pota{' '}
				<a href="/Reactivity/signal">signal</a> object —
				<mark>.read()</mark>, <mark>.write(v)</mark>, and{' '}
				<mark>.update(prev =&gt; next)</mark>. The initial value
				comes from storage when present, otherwise falls back to
				the <mark>initial</mark> argument. Storage writes are
				wrapped in <mark>try/catch</mark> so quota or
				private-mode failures don't crash anything — the signal
				still behaves correctly in memory.
			</p>

			<Section title="Persisting a single signal">
				<p>
					Reads happen synchronously at construction. Writes go
					to storage in a synchronous effect, so the value is
					persisted by the time <mark>write()</mark> returns —
					not on the next microtask. Reload the page and the
					counter resumes from where you left it.
				</p>
				<Code url="/pages/@use/storage/snippet.jsx"></Code>
			</Section>

			<Section title="Multiple signals share one namespace">
				<p>
					<mark>storage(prefix)</mark> returns a factory you
					can call many times. Two signals built from the same{' '}
					<mark>prefix + key</mark> within the same document
					see each other's writes immediately — no manual
					subscription needed.
				</p>
				<Code url="/pages/@use/storage/namespace.jsx"></Code>
			</Section>

			<Section title="Cross-tab sync">
				<p>
					Browser-backed signals also react to the native{' '}
					<mark>storage</mark> event from other tabs. Open
					this page in two tabs and toggle the theme — both
					tabs update in lockstep. If another tab calls{' '}
					<mark>localStorage.clear()</mark>, every active
					signal in this tab reverts to its own initial value.
				</p>
				<Code url="/pages/@use/storage/dark-mode.jsx"></Code>
			</Section>
		</>
	)
}
