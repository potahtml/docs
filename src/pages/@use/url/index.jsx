import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="url">
				<mark>pota/use/url</mark> bundles small URL string
				helpers — protocol / origin checks, a safe{' '}
				<mark>decodeURIComponent</mark>, and the{' '}
				<mark>replaceParams</mark> primitive used internally by{' '}
				the <a href="/Components/Route/A">&lt;A/&gt;</a> route
				builder.
			</Header>

			<Section title="Protocol / origin checks">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>returns</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>isFileProtocol(href)</td>
							<td>boolean</td>
							<td>
								<mark>href.startsWith('file://')</mark>.
							</td>
						</tr>
						<tr>
							<td>hasProtocol(href)</td>
							<td>boolean</td>
							<td>
								matches <mark>scheme://</mark>, including
								nested ones like{' '}
								<mark>blob:http://...</mark>.
							</td>
						</tr>
						<tr>
							<td>isAbsolute(href)</td>
							<td>boolean</td>
							<td>
								starts with <mark>/</mark> or has a
								protocol.
							</td>
						</tr>
						<tr>
							<td>isRelative(href)</td>
							<td>boolean</td>
							<td>
								<mark>!isAbsolute</mark>.
							</td>
						</tr>
						<tr>
							<td>isHash(url)</td>
							<td>boolean</td>
							<td>
								starts with <mark>#</mark>.
							</td>
						</tr>
						<tr>
							<td>isExternal(href)</td>
							<td>boolean</td>
							<td>
								<mark>true</mark> when the URL isn't
								under <mark>window.location.origin</mark>.
								Guards against{' '}
								<mark>example.net</mark> vs.{' '}
								<mark>example.net.ha.com</mark>.
							</td>
						</tr>
						<tr>
							<td>removeNestedProtocol(href)</td>
							<td>string</td>
							<td>
								<mark>blob:http://...</mark> →{' '}
								<mark>http://...</mark>.
							</td>
						</tr>
						<tr>
							<td>cleanLink(href)</td>
							<td>string</td>
							<td>
								strips trailing <mark>.</mark>,{' '}
								<mark>,</mark>, <mark>"</mark> often
								picked up when links are copied from prose.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Encoding helpers">
				<p>
					<mark>encodeURIComponent</mark> is a passthrough of
					the platform function.{' '}
					<mark>decodeURIComponent</mark> is a safe variant
					that returns the original string instead of throwing
					on malformed sequences — important when decoding
					user-pasted URLs.
				</p>
			</Section>

			<Section title="replaceParams(href, params)">
				<p>
					Replaces named placeholders (matched by{' '}
					<mark>paramsRegExp</mark> →{' '}
					<mark>{`/\\:([a-z0-9_\\-]+)/gi`}</mark>) with
					URL-encoded values from <mark>params</mark>. Missing
					keys are left intact, so you can do partial
					substitution. This is the same primitive{' '}
					<a href="/Components/Route/A">&lt;A/&gt;</a> uses
					internally.
				</p>
				<Code
					code={`import { replaceParams } from 'pota/use/url'

replaceParams('/users/:id/posts/:page', { id: 7, page: 'latest' })
// '/users/7/posts/latest'`}
					render={false}
				/>
			</Section>
		</>
	)
}
