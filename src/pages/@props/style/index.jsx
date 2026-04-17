import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="style:__">
				Several ways to set inline styles on an element. Each form
				can be a plain value or a function/signal. To remove a
				style, set its value to <mark>null</mark>,{' '}
				<mark>undefined</mark>, or <mark>false</mark>.
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
							<td>{`style:color="red"`}</td>
							<td>
								namespace form — sets a single property (supports
								custom properties too:{' '}
								<mark>{`style:--brand="red"`}</mark>)
							</td>
						</tr>
						<tr>
							<td>{`style="color:red"`}</td>
							<td>
								string form — assigned to <mark>style.cssText</mark>
								, replacing any existing inline style
							</td>
						</tr>
						<tr>
							<td>{`style={{ color: 'red' }}`}</td>
							<td>
								object form — each key becomes a single property
								set via{' '}
								<mark>style.setProperty</mark>
							</td>
						</tr>
						<tr>
							<td>{`style="color:var(--color)"`}</td>
							<td>strings can reference CSS custom properties</td>
						</tr>
						<tr>
							<td>{`style:my-ns={{ color: "red" }}`}</td>
							<td>
								nested object form — identical to the object form
								above; the <mark>my-ns</mark> part is ignored at
								runtime
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Object form caveat">
				<p>
					When you swap the object on a <mark>style={'{...}'}</mark>{' '}
					binding, properties that were on the previous object but
					not on the new one are <strong>not</strong> removed.
					Clear them explicitly by setting the value to{' '}
					<mark>null</mark>.
				</p>
			</Section>

			<Section title="CSS Styles">
				<p>Tests most of the ways</p>
				<Code url="/pages/@props/style/test.jsx"></Code>
			</Section>
		</>
	)
}
