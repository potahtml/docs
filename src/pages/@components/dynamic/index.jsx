import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Dynamic ...</Tag>}>
				Renders a component chosen at runtime. The{' '}
				<mark>component</mark> prop is read once when{' '}
				<mark>&lt;Dynamic/&gt;</mark> is created — it is{' '}
				<em>not</em> reactive, so passing a signal or a function
				that returns a component won't swap the rendered output.
				To drive the component choice reactively, mount{' '}
				<mark>&lt;Dynamic/&gt;</mark> inside a{' '}
				<a href="/Components/Show">Show</a> or{' '}
				<a href="/Components/Switch">Switch</a> that toggles
				which one is shown. All other props are forwarded to the
				rendered component. For the JavaScript equivalent see{' '}
				<a href="/Component">Component</a>.
			</Header>

			<Section title="Attributes">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>type</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>component</td>
							<td>tagName | fn | Pota class | Element</td>
							<td>what to render — read once, not reactive</td>
						</tr>
						<tr>
							<td>…rest</td>
							<td>any</td>
							<td>forwarded as props to the rendered component</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Using dynamic">
				<p>Simple test</p>
				<Code url="/pages/@components/dynamic/test.jsx"></Code>
			</Section>
		</>
	)
}
