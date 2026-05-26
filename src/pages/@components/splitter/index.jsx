import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'

export default function () {
	return (
		<>
			<Header title={<Tag>Splitter ...</Tag>}>
				A resizable handle you drop between two sibling
				elements inside a flex container. Dragging the handle
				resizes one of the siblings — width for a vertical
				splitter, height for a horizontal one. Optionally
				persists its size in <mark>localStorage</mark>.
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
							<td>orientation?</td>
							<td>'vertical' | 'horizontal'</td>
							<td>
								Default <mark>'vertical'</mark>. A vertical
								splitter is rendered as a vertical line and
								dragged horizontally to resize{' '}
								<mark>width</mark>; a horizontal splitter is
								the opposite. The value also writes to{' '}
								<mark>aria-orientation</mark>.
							</td>
						</tr>
						<tr>
							<td>target?</td>
							<td>'prev' | 'next'</td>
							<td>
								Which sibling to resize — defaults to{' '}
								<mark>'prev'</mark>. With{' '}
								<mark>'next'</mark>, dragging the handle the
								other direction grows the next sibling.
							</td>
						</tr>
						<tr>
							<td>min?</td>
							<td>number</td>
							<td>
								Minimum size in pixels. Default{' '}
								<mark>0</mark>.
							</td>
						</tr>
						<tr>
							<td>max?</td>
							<td>number</td>
							<td>
								Maximum size in pixels. Default{' '}
								<mark>Infinity</mark>.
							</td>
						</tr>
						<tr>
							<td>initial?</td>
							<td>number</td>
							<td>
								Initial size in pixels — overrides whatever
								size CSS would have produced. Overridden in
								turn by any value already in{' '}
								<mark>localStorage</mark> if{' '}
								<mark>persist</mark> is set.
							</td>
						</tr>
						<tr>
							<td>persist?</td>
							<td>string</td>
							<td>
								<mark>localStorage</mark> key. Reads on mount,
								writes on drag end. Omit to keep the splitter
								session-only.
							</td>
						</tr>
						<tr>
							<td>class?</td>
							<td>string</td>
							<td>
								Extra class applied to the handle element —
								on top of the component's own auto-generated
								class.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Vertical splitter">
				<p>
					Default orientation. The handle resizes the previous
					sibling's width — useful for sidebar / content
					layouts.
				</p>
				<Code url="/pages/@components/splitter/vertical.jsx"></Code>
			</Section>

			<Section title="Horizontal splitter with persistence">
				<p>
					Pass <mark>orientation="horizontal"</mark> for a
					handle that resizes height. With{' '}
					<mark>persist</mark>, the size is restored from{' '}
					<mark>localStorage</mark> the next time the page
					loads.
				</p>
				<Code url="/pages/@components/splitter/horizontal-persist.jsx"></Code>
			</Section>

			<Section title="No JSX (compiler-less)">
				<p>
					<mark>Splitter</mark> is built with{' '}
					<a href="/Component">Component</a> calls rather
					than JSX, so it works in compiler-less setups
					alongside the <a href="/XML">xml</a>{' '}
					tagged-template API. Same shape, no Babel preset
					required:
				</p>
				<Code
					code={`import { Component, render } from 'pota'
import { Splitter } from 'pota/components'

const App = () =>
  Component('div', {
    style: 'display: flex; height: 200px',
    children: [
      Component('aside', { style: 'width: 200px; background: #2a9d8f' }),
      Component(Splitter, { min: 100, max: 400 }),
      Component('main', { style: 'flex: 1; background: #264653' }),
    ],
  })

render(App)`}
					render={false}
				/>
			</Section>
		</>
	)
}
