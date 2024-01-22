import { Code, Header, Section } from '#main'

export default function () {
	return (
		<>
			<Header title="class:__">
				There are a variety of ways to set CSS Classes. To remove a
				class set it to <mark>undefined</mark>, <mark>null</mark> or
				<mark>false</mark>
			</Header>

			<Section title="List">
				<p>
					On where the <mark>className</mark> could be changed for a
					reactive value
				</p>
				<table>
					<tbody>
						<tr>
							<td>{'class="className"'}</td>
						</tr>
						<tr>
							<td>{'class="className1 className2"'}</td>
						</tr>
						<tr>
							<td>{'class={{ className: falsy/truthy }}'}</td>
						</tr>
						<tr>
							<td>{'class:className={falsy/truthy}'}</td>
						</tr>
						<tr>
							<td>{'class:my-ns={{ className: falsy/truthy }}'}</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Bugs">
				<ul>
					<li>
						When passing an object with the classNames as keys, it
						wont handle the removal of classes not present in the
						object. To remove a class set the value to falsy
					</li>
				</ul>
			</Section>

			<Section title="CSS classes">
				<p>The different ways to set CSS classes</p>
				<Code url="/pages/@props/class/test.jsx"></Code>
			</Section>
		</>
	)
}
