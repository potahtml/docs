import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Component">
				<mark>Component</mark> turns any value into a callable
				factory, useful for creating dynamic or untracked
				components. You can preset props at factory time; calling
				the factory with more props shallow-merges them over the
				presets (<em>later wins, key-by-key</em>).
			</Header>

			<Section title="Component">
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
							<td>fn | Element | tagName | object with toString</td>
							<td>
								what to turn into a factory. Strings become
								intrinsic elements (<mark>'div'</mark>); functions
								become user components; Elements are wrapped as-is;
								an object with a <mark>toString</mark> is coerced
								via that method (handy for third-party wrappers).
							</td>
						</tr>
						<tr>
							<td>[props]</td>
							<td>object</td>
							<td>
								preset props. Omitted entirely when you only want
								the factory. When the factory is later called with
								overrides, the two are shallow-merged as{' '}
								<mark>{'{ ...preset, ...override }'}</mark>.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Component as a Factory">
				<Code url="/pages/component/element.jsx">
					Component with default props
				</Code>
			</Section>

			<Section title="Component With Props Override">
				<Code url="/pages/component/element-override.jsx">
					Component with default props that change
				</Code>
			</Section>

			<Section title="Component With Empty Props">
				<Code url="/pages/component/factory.jsx">
					<mark>props</mark> argument may be omitted
				</Code>
			</Section>
		</>
	)
}
