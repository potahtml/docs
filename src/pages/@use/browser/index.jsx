import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="browser">
				<mark>pota/use/browser</mark> exposes two simple
				user-agent booleans evaluated once at module load.
				Convenient guards for tiny per-browser branches; for
				anything richer reach for a real UA-parsing library.
			</Header>

			<Section title="API">
				<Code
					code={`import { isMobile, isFirefox } from 'pota/use/browser'

if (isMobile) { /* ... */ }
if (isFirefox) { /* ... */ }`}
					render={false}
				/>
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
							<td>isMobile</td>
							<td>boolean</td>
							<td>
								<mark>true</mark> when{' '}
								<mark>navigator.userAgent</mark> matches{' '}
								<em>mobile / iphone / ipod / ios / ipad /
								android</em>.
							</td>
						</tr>
						<tr>
							<td>isFirefox</td>
							<td>boolean</td>
							<td>
								<mark>true</mark> when the user agent
								contains <em>firefox</em>.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>
		</>
	)
}
