import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="focus">
				<mark>pota/use/focus</mark> covers per-element focus
				ergonomics as ref functions, plus document-level focus
				state through an emitter and standalone focus
				traversal helpers.
			</Header>

			<Section title="Exports">
				<Code
					code={`import {
  // bare ref functions (attach via use:ref)
  autoFocus,
  selectOnFocus,
  trapFocus,

  // imperative focus traversal
  focusNext,
  focusPrevious,

  // document-level focus emitter
  onDocumentFocus,
  useDocumentFocus,
} from 'pota/use/focus'`}
					render={false}
				/>
			</Section>

			<Section title="autoFocus — focus on mount">
				<p>
					<mark>autoFocus</mark> is a bare ref function:
					attach it via <mark>use:ref</mark> and it focuses
					the element after mount. Equivalent to writing{' '}
					<mark>{`node => onMount(() => node.focus())`}</mark>{' '}
					yourself.
				</p>
				<Code url="/pages/@use/focus/auto.jsx"></Code>
			</Section>

			<Section title="selectOnFocus — select-all on focus">
				<p>
					Selects the input/textarea contents whenever the
					element gains focus. Pairs well with{' '}
					<mark>autoFocus</mark> for "click to edit" UI.
				</p>
				<Code url="/pages/@use/focus/select.jsx"></Code>
			</Section>

			<Section title="trapFocus — modal-style Tab containment">
				<p>
					Confines <mark>Tab</mark>/<mark>Shift+Tab</mark>{' '}
					navigation to focusable descendants of the
					element. A standard accessibility need for modals,
					popovers, and command palettes. Does nothing when
					the element has no focusable descendants.
				</p>
				<Code url="/pages/@use/focus/trap.jsx"></Code>
			</Section>

			<Section title="focusNext / focusPrevious">
				<p>
					Imperative traversal of the document's focusable
					elements with wrap-around. Pass an explicit array
					to scope the cycle to a subset (the
					implementation behind <mark>trapFocus</mark>).
				</p>
				<Code
					code={`import { focusNext, focusPrevious } from 'pota/use/focus'

focusNext()       // advance focus document-wide
focusPrevious()   // step back
focusNext([a, b, c])  // scoped to a given list`}
					render={false}
				/>
			</Section>

			<Section title="Document focus emitter">
				<p>
					<mark>useDocumentFocus()</mark> returns a signal
					accessor that is <mark>true</mark> when the
					document has focus; <mark>onDocumentFocus(fn)</mark>{' '}
					registers a callback. Reflects window{' '}
					<mark>focus</mark>/<mark>blur</mark> events.
				</p>
				<Code
					code={`import { onDocumentFocus, useDocumentFocus } from 'pota/use/focus'

const hasFocus = useDocumentFocus()
onDocumentFocus(value => console.log('focused:', value))`}
					render={false}
				/>
			</Section>
		</>
	)
}
