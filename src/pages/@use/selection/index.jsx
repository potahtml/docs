import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="selection">
				<mark>pota/use/selection</mark> covers two needs: the{' '}
				<mark>clickSelectsAll</mark> ref function that selects
				an element's text on click, and{' '}
				<mark>getSelection</mark>/<mark>restoreSelection</mark>{' '}
				for round-tripping a <mark>Range</mark> (used
				internally by <a href="/use/bind">use:bind</a> to keep
				<mark>contenteditable</mark> cursors stable across
				re-renders).
			</Header>

			<Section title="Exports">
				<Code
					code={`import {
  // bare ref function
  clickSelectsAll,

  // imperative range helpers
  getSelection,
  restoreSelection,
} from 'pota/use/selection'`}
					render={false}
				/>
			</Section>

			<Section title="clickSelectsAll — copy-friendly snippets">
				<p>
					Attach <mark>clickSelectsAll</mark> via{' '}
					<mark>use:ref</mark> on any element you want
					users to be able to select-then-copy with one
					click. The window selection is set to the
					element's children — text inside descendants is
					included.
				</p>
				<Code url="/pages/@use/selection/snippet.jsx"></Code>
			</Section>

			<Section title="getSelection / restoreSelection">
				<p>
					<mark>getSelection()</mark> snapshots the current
					document selection as a <mark>Range</mark>, or{' '}
					<mark>null</mark> if nothing is selected.{' '}
					<mark>restoreSelection(range)</mark> applies a
					previously captured range. The pair is useful
					when you have to mutate text that the user is in
					the middle of editing.
				</p>
				<Code
					code={`import { getSelection, restoreSelection } from 'pota/use/selection'

const saved = getSelection()
// ... rewrite some text the user has selected ...
restoreSelection(saved)`}
					render={false}
				/>
			</Section>
		</>
	)
}
