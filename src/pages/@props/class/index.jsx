import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="class:__">
				Several ways to set CSS classes on an element. Each form
				can be a plain value or a function/signal — class bindings
				are reactive. To remove a class, set it to{' '}
				<mark>false</mark>, <mark>null</mark> or{' '}
				<mark>undefined</mark>.
			</Header>

			<Section title="Forms">
				<table>
					<thead>
						<tr>
							<th>form</th>
							<th>what it does</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{'class="a b"'}</td>
							<td>
								sets the whole <mark>class</mark> attribute to the
								string (replaces any existing value)
							</td>
						</tr>
						<tr>
							<td>{'class={["a", cond && "b"]}'}</td>
							<td>
								array form — falsy entries are dropped, the rest
								are added
							</td>
						</tr>
						<tr>
							<td>{'class={{ a: true, b: false }}'}</td>
							<td>object form — adds keys with truthy values</td>
						</tr>
						<tr>
							<td>{'class:a={truthy}'}</td>
							<td>
								namespace form — toggles just the{' '}
								<mark>a</mark> class based on the value
							</td>
						</tr>
						<tr>
							<td>{'class:my-ns={{ a: true }}'}</td>
							<td>
								nested object form — identical behaviour to the
								object form above; the <mark>my-ns</mark> part is
								ignored at runtime and only there so you can
								organise multi-class bindings
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Object form caveat">
				<p>
					When you swap the object on a <mark>class={'{...}'}</mark>{' '}
					binding, classes that were on the previous object but not
					on the new one are <strong>not</strong> removed —
					object forms add and update, they don't sweep. To
					clear a class, set its value to <mark>false</mark>{' '}
					explicitly.
				</p>
			</Section>

			<Section title="CSS classes">
				<p>The different ways to set CSS classes</p>
				<Code url="/pages/@props/class/test.jsx"></Code>
			</Section>
		</>
	)
}
