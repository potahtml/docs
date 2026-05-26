import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="keyboard">
				<mark>pota/use/keyboard</mark> exports ref factories
				for keyboard chords. <mark>shortcut</mark> scopes to
				the element, <mark>globalShortcut</mark> listens on
				the document, and <mark>submitOnCtrlEnter</mark> is a
				convenience for textareas.
			</Header>

			<p>
				Chords are a <mark>+</mark>-separated list of
				modifiers — <mark>ctrl</mark>, <mark>meta</mark>,{' '}
				<mark>alt</mark>, <mark>shift</mark>, plus the alias{' '}
				<mark>mod</mark> (<mark>ctrl</mark> on non-Mac,{' '}
				<mark>meta</mark> on Mac) — followed by a single key.
				Matching is strict: <mark>ctrl+s</mark> does <em>not</em>{' '}
				fire on <mark>ctrl+shift+s</mark>. The handler is
				called with the <mark>KeyboardEvent</mark>;{' '}
				<mark>preventDefault</mark> is applied automatically
				when the chord matches.
			</p>

			<Section title="Exports">
				<Code
					code={`import {
  shortcut,            // shortcut(combo, fn)             → (node) => void
  globalShortcut,      // globalShortcut(combo, fn)       → () => void
  submitOnCtrlEnter,   // submitOnCtrlEnter(fn)           → (node) => void
} from 'pota/use/keyboard'`}
					render={false}
				/>
			</Section>

			<Section title="Element-scoped shortcut">
				<p>
					Element-scoped chords only fire when the element
					(or one of its descendants) has focus. Use this for
					editor commands inside a contenteditable, or for
					form-local submit shortcuts.
				</p>
				<Code url="/pages/@use/keyboard/snippet.jsx"></Code>
			</Section>

			<Section title="Document-scoped shortcut (`mod`)">
				<p>
					<mark>globalShortcut</mark> attaches the listener
					to <mark>document</mark>. Use <mark>mod</mark> for
					the platform-appropriate primary modifier — it
					translates to <mark>ctrl</mark> on non-Mac and{' '}
					<mark>meta</mark> on Mac.
				</p>
				<Code url="/pages/@use/keyboard/palette.jsx"></Code>
			</Section>
		</>
	)
}
