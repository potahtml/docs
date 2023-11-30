import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="style:__">
				There are a variety of ways to set CSS Styles. To remove a
				style set it to <mark>null</mark> or <mark>undefined</mark>
			</Header>

			<Section title="List">
				<p>On where "red" could be changed for a reactive value</p>
				<table>
					<tbody>
						<tr>
							<td>{`style:color="red"`}</td>
						</tr>
						<tr>
							<td>{`style="color:red"`}</td>
						</tr>
						<tr>
							<td>{`style={{ color: 'red' }}`}</td>
						</tr>
						<tr>
							<td>{`style="color:var(--color)" var:color="red"`}</td>
						</tr>
						<tr>
							<td>{`style:my-ns={{ color: "red" }}`}</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Bugs">
				<ul>
					<li>
						When passing an object with the style properties as keys,
						it wont handle the removal of styles not present in the
						object. To remove a style set the value to falsy
					</li>
				</ul>
			</Section>

			<Section title="CSS Styles">
				<p>Test most? of the ways </p>
				<Code url="/pages/props/css/style/test.jsx"></Code>
			</Section>

			<Section title="Inline CSS">
				<p>Could be done just using JSX</p>
				<Code url="/pages/props/css/style/inline.jsx"></Code>
			</Section>
		</>
	)
}
