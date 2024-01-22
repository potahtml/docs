import { Code, Header, Section, Tag } from '#main'

export default function () {
	return (
		<>
			<Header title={<Tag>A ...</Tag>}>
				The <Tag mark={true}>A</Tag> component can be used to create
				links with special characters in the URL and/or with specific
				Router features. When the <mark>href</mark> is not absolute
				(thats it starting with <mark>/</mark>, <mark>#</mark> or{' '}
				<mark>http</mark>) it will make the link relative to the
				current route.
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
							<td>params?</td>
							<td>key-value pairs object</td>
							<td>
								used to replace params in the link href for the URI
								encoded equivalents.{' '}
								<mark>
									{'<'}A href="/some/:cat/:page" params={'{'}
									{'{'} cat: 'variété', page:'touché' {'}'}
									{'}'}
									{'>'}
									Touché
									{'<'}/A{'>'}
								</mark>{' '}
								will become{' '}
								<mark>
									{'<'}a href="/some/vari%C3%A9t%C3%A9/touch%C3%A9"
									{'>'}
									Touché{'</'}a{'>'}
								</mark>
							</td>
						</tr>
						<tr>
							<td>replace?</td>
							<td>boolean [false]</td>
							<td>
								replace the location to not add a history entry on the
								browser
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@components/router/link/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Params">
				<p>Testing params replacement</p>
				<Code url="/pages/@components/router/link/test.jsx"></Code>
			</Section>
		</>
	)
}
