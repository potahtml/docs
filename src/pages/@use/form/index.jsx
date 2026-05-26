import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="form">
				<mark>pota/use/form</mark> covers form ergonomics:
				four bare ref functions for common input behaviors,
				plus three imperative helpers for reading and writing
				form state (
				<mark>form2object</mark>, <mark>object2form</mark>,{' '}
				<mark>isDisabled</mark>) and a{' '}
				<mark>focusNextInput</mark> stepper.
			</Header>

			<Section title="Exports">
				<Code
					code={`import {
  // bare ref functions
  clickFocusChildrenInput,
  enterFocusNext,
  preventEnter,
  sizeToInput,

  // imperative helpers
  isDisabled,
  focusNextInput,
  form2object,
  object2form,
} from 'pota/use/form'`}
					render={false}
				/>
			</Section>

			<Section title="Ref functions">
				<ul>
					<li>
						<mark>clickFocusChildrenInput</mark> — clicking
						the element focuses the first focusable
						descendant (input / button / select / textarea
						/ contenteditable). Useful for clickable
						labels around a hidden input.
					</li>
					<li>
						<mark>enterFocusNext</mark> — pressing{' '}
						<mark>Enter</mark> moves focus to the next
						form element. The forms version of "Enter to
						submit" when you actually want "Enter to
						advance."
					</li>
					<li>
						<mark>preventEnter</mark> — blocks{' '}
						<mark>Enter</mark> from inserting a newline or
						submitting; calls <mark>preventDefault</mark>{' '}
						and <mark>stopPropagation</mark>.
					</li>
					<li>
						<mark>sizeToInput</mark> — makes a textarea
						grow/shrink to fit its content (and its
						parent's height) on{' '}
						<mark>input</mark>/<mark>focus</mark>/
						<mark>blur</mark>.
					</li>
				</ul>
				<Code url="/pages/@use/form/snippet.jsx"></Code>
			</Section>

			<Section title="form2object / object2form">
				<p>
					Round-trip a form to a plain object and back.{' '}
					<mark>form2object</mark> collects all fields via{' '}
					<mark>FormData</mark>, merging same-name fields
					into an array.{' '}
					<mark>object2form</mark> writes values back —
					handling text, number, checkbox (boolean), radio
					(by value match), and multi-select.
				</p>
				<Code url="/pages/@use/form/roundtrip.jsx"></Code>
			</Section>

			<Section title="isDisabled / focusNextInput">
				<p>
					<mark>isDisabled(node)</mark> returns{' '}
					<mark>true</mark> for elements that are{' '}
					<mark>:disabled</mark> — directly or via an
					ancestor <mark>{`<fieldset disabled>`}</mark>.{' '}
					<mark>focusNextInput(node, event)</mark> is the
					engine behind <mark>enterFocusNext</mark>;
					exported so you can wire your own key handlers.
				</p>
				<Code
					code={`import { isDisabled, focusNextInput } from 'pota/use/form'

isDisabled(input)         // boolean
focusNextInput(input, e)  // advance focus + preventDefault on success`}
					render={false}
				/>
			</Section>
		</>
	)
}
