import { Code, Header, Section } from '#main'
import styles from '../../index.module.css'

export default function () {
	return (
		<>
			<Header title="render">
				It renders anything into Element. It creates a tracking scope
				using a root and returns a dispose function that when called
				will unmount the component.
			</Header>

			<p>
				What has been rendered will be disposed if the container cease
				to exist, but only if the container has been created by this
				lib, as it registers on <mark>onUnmount</mark>
			</p>

			<p>Rendering in a container won't clear the container</p>

			<Section title="Arguments">
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
							<td>children</td>
							<td>any</td>
							<td>the thing to render</td>
						</tr>
						<tr>
							<td>parent?</td>
							<td>Element [document.body]</td>
							<td>the target node where to render</td>
						</tr>
						<tr>
							<td>options?</td>
							<td>{'{clear:false, relative:false}'} </td>
							<td>
								<mark>clear</mark> controls if the target node should
								be cleared before inserting. <mark>relative</mark> to{' '}
								<mark>insertBefore</mark> the parent instead
							</td>
						</tr>
					</tbody>
				</table>
				<p>
					<b>Return Value:</b> Dispose function
				</p>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/rendering/render/render.jsx"></Code>
			</Section>

			<Section title="Important!">
				<p>
					If you are passing to render a function, do not run the
					function <b>before</b> passing it to render, else the
					function will run outside the root tracking scope.
				</p>

				<table>
					<tbody>
						<tr>
							<td>
								<mark>{'render(App())'}</mark>
							</td>
							<td>
								<span class={styles.warning}>
									<b>wrong!</b>
								</span>
							</td>
						</tr>
						<tr>
							<td>
								<mark>{'render(App)'}</mark>
							</td>
							<td>recommended</td>
						</tr>
						<tr>
							<td>
								<mark>{'render(<App/>)'}</mark>
							</td>
							<td>ok</td>
						</tr>
						<tr>
							<td>
								<mark>{'render(() => App)'}</mark>
							</td>
							<td>ok</td>
						</tr>
						<tr>
							<td>
								<mark>{'render(() => App())'}</mark>
							</td>
							<td>ok</td>
						</tr>
						<tr>
							<td>
								<mark>{'render(() => <App/>)'}</mark>
							</td>
							<td>ok</td>
						</tr>
						<tr>
							<td>
								<mark>{'render( <div/>)'}</mark>
							</td>
							<td>ok</td>
						</tr>
						<tr>
							<td>
								<mark>{'render(<><div/><div/></>)'}</mark>
							</td>
							<td>ok</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="App">
				<p>
					Render a component to the <mark>body</mark> (default
					Element)
				</p>

				<Code url="/pages/rendering/render/render.jsx"></Code>
			</Section>
			<Section title="Dispose">
				<p>
					Dispose what has been rendered. Calling dispose won't clear
					unrelated Elements from the same container
				</p>

				<Code url="/pages/rendering/render/dispose.jsx">
					Clicking dispose will unmount <mark>Test</mark> from{' '}
					<mark>main</mark>
				</Code>
			</Section>

			<Section title="Multi">
				<p>
					Render some elements into the body, then render some other
					components into these elements
				</p>

				<Code url="/pages/rendering/render/multi.jsx"></Code>
			</Section>

			<Section title="Types">
				<p>The render function can render pretty much anything</p>

				<Code url="/pages/rendering/render/types.jsx"></Code>
			</Section>

			<Section title="Clear">
				<p>Clear the target container before mounting</p>

				<Code url="/pages/rendering/render/clear.jsx"></Code>
			</Section>
		</>
	)
}
