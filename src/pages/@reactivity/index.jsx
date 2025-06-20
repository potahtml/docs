import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Reactivity">
				Reactive primitives are introduced as needed through a clean
				and abstracted API. It currently leverages a customized
				version of the SolidJS Core, refactored to classes.
			</Header>

			<Section title="Snippet">
				<Code
					code={`
						import {
							asyncEffect,
							batch,
							cleanup,
							effect,
							Lazy,
							lazy,
							map,
							memo,
							on,
							owned,
							ref,
							resolve,
							root,
							signal,
							syncEffect,
							untrack,
							withValue,
							writable,
						} from 'pota'
					`}
					render={false}
				></Code>
			</Section>

			<Section title="Reactive Functions">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>arguments</th>
							<th>returns</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>signal</td>
							<td>
								(initialValue, {'{equals:false/(a,b)=>a===b}'}){' '}
							</td>
							<td>
								<mark>
									[read, write, update] |{' '}
									{
										'{read:()=>value, write:(newValue)=>boolean, update:(prev)=>nextValue}'
									}
								</mark>
							</td>
							<td>
								tuple to read and write values from/to a signal. Use
								<mark>update</mark> for running a function that
								receives the previous value and return to set a new
								value. When using <mark>update</mark> the signal
								doesnt track.
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/memo">memo</a>
							</td>
							<td>fn</td>
							<td>signal</td>
							<td>
								read-only signal that will update when the return
								value of the function changes, memos are lazy
							</td>
						</tr>

						<tr>
							<td>writable</td>
							<td>fn</td>
							<td>signal</td>
							<td>
								like a memo but the function wont run unless is used
								(lazy), and if you write to the return value it will
								get that as a value
							</td>
						</tr>
						<tr>
							<td>root</td>
							<td>fn</td>
							<td>dispose function</td>
							<td>creates a new tracking scope</td>
						</tr>
						<tr>
							<td>effect</td>
							<td>fn</td>
							<td>void</td>

							<td>function to re-run when dependencies change</td>
						</tr>
						<tr>
							<td>on</td>
							<td>fn, fn</td>
							<td>void</td>
							<td>like effect but only the first function tracks</td>
						</tr>
						<tr>
							<td>syncEffect</td>
							<td>fn</td>
							<td>void</td>
							<td>
								function to re-run when dependencies change. the
								difference with an effect is that an effect may run at
								a later point in time while a syncEffect is garanteed
								to run right away after your call.
							</td>
						</tr>
						<tr>
							<td>asyncEffect</td>
							<td>{`(currentRunningEffect: Promise<any>) => any`}</td>
							<td>any</td>

							<td>
								for when you need to run effects one after another you
								can await the previous running effect with the
								parameter that the callback receives.
							</td>
						</tr>
						<tr>
							<td>batch</td>
							<td>fn</td>
							<td>void</td>

							<td>batches changes</td>
						</tr>
						<tr>
							<td>cleanup</td>
							<td>fn</td>
							<td>void</td>

							<td>
								cleanup callback for when the reactive context is
								disposed
							</td>
						</tr>

						<tr>
							<td>owned</td>
							<td>fn</td>
							<td>owned function</td>
							<td>
								returns a function that holds the owner on the scope.
								If you call it will run the function you passed
								initialy with that owner
							</td>
						</tr>
						<tr>
							<td>withValue</td>
							<td>withValue(value, fn) => fn(value)</td>
							<td>void</td>
							<td>
								given a <mark>value</mark> and a <mark>function</mark>
								, if the value is a function then it will create an
								effect that unwraps the value and pass it to the
								function you defined
							</td>
						</tr>
						<tr>
							<td>
								<a href="/Reactivity/map">map</a>
							</td>
							<td>map(Iterable, callback)</td>
							<td>void</td>
							<td>
								reactive version of <mark>array.map</mark> for
								iterables
							</td>
						</tr>
					</tbody>
				</table>
			</Section>
		</>
	)
}
