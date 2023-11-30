import { Code, Header, Section, Tag } from '#main'

export default function () {
	return (
		<>
			<Header
				title={
					<>
						navigate / <Tag>Navigate ...</Tag>
					</>
				}
			>
				Used to navigate or change the location.{' '}
				<Tag mark={true}>Navigate</Tag> tag is just the same as{' '}
				<mark>navigate</mark> function exported as a component for
				convenience.
			</Header>

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
							<td>href</td>
							<td>url</td>
							<td>
								When the <mark>href</mark> is not absolute (thats it
								starting with <mark>/</mark>, <mark>#</mark> or{' '}
								<mark>http</mark>) it will navigate relative to{' '}
								<mark>window.location.href</mark>.
							</td>
						</tr>
						<tr>
							<td>params?</td>
							<td>key-value pairs object </td>
							<td>
								used to replace params in the href for the URI encoded
								equivalents.{' '}
								<mark>
									{'<'}Navigate href="/some/:cat/:page" params={'{{'}{' '}
									cat: 'variété', page: 'touché' {'}}'}/{'>'}
								</mark>
								will navigate to{' '}
								<mark>/some/vari%C3%A9t%C3%A9/touch%C3%A9</mark>. Same
								with the function version,{' '}
								<mark>
									navigate("/some/:cat/:page", {'{'}params: cat:
									'variété', page: 'touché' {'}'})
								</mark>
							</td>
						</tr>
						<tr>
							<td>replace?</td>
							<td>boolean [false]</td>
							<td>to replace the browser history entry</td>
						</tr>
						<tr>
							<td>scroll?</td>
							<td>boolean [true]</td>
							<td>to scroll to the top of the page</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section
				title={
					<>
						<Tag mark={true}>Navigate</Tag> Tag
					</>
				}
			>
				<p>Example using params</p>
				<Code
					url="/pages/router/navigate/snippet.jsx"
					render={false}
				></Code>
			</Section>
			<Section title="Navigate Function">
				<p>Example using params</p>
				<Code
					url="/pages/router/navigate/snippet-function.jsx"
					render={false}
				></Code>
			</Section>
		</>
	)
}
