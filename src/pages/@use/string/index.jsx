import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="string">
				<mark>pota/use/string</mark> collects the small string
				utilities that come up over and over when building UIs:
				case conversion, light validation, clipboard, hashing,
				and a multi-line <mark>diff</mark> used by{' '}
				<a href="/use/test">pota/use/test</a>.
			</Header>

			<Section title="Case / format">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>dashesToCamelCase(s)</td>
							<td>
								kebab-case → camelCase. <mark>'foo-bar'</mark>{' '}
								→ <mark>'fooBar'</mark>.
							</td>
						</tr>
						<tr>
							<td>capitalizeFirstLetter(s)</td>
							<td>
								uppercases the first char; rest untouched.
							</td>
						</tr>
						<tr>
							<td>label(s)</td>
							<td>
								slug → human label. Replaces{' '}
								<mark>-</mark> / <mark>_</mark> with spaces
								and collapses runs.
							</td>
						</tr>
						<tr>
							<td>short(s)</td>
							<td>
								truncates to 40 chars and appends{' '}
								<mark>…</mark>.
							</td>
						</tr>
						<tr>
							<td>ensureString(s)</td>
							<td>
								<mark>String(s || '')</mark> — coerce
								anything, falsy stays empty.
							</td>
						</tr>
						<tr>
							<td>toString(s, length=0)</td>
							<td>
								<mark>ensureString</mark> + trim, with
								optional max length (slice + trim again).
							</td>
						</tr>
						<tr>
							<td>wholeNumber(n)</td>
							<td>
								<mark>+n | 0</mark> — drop the fractional
								part, coerce <mark>NaN</mark> to <mark>0</mark>.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Validation">
				<table>
					<tbody>
						<tr>
							<td>validateEmail(s)</td>
							<td>
								lowercased trimmed email if it matches{' '}
								<mark>^[^@]+@[^@]+\.[^@]+$</mark>, else{' '}
								<mark>false</mark>.
							</td>
						</tr>
						<tr>
							<td>validatePassword(s)</td>
							<td>
								trimmed password if length ≥ 6, else{' '}
								<mark>false</mark>.
							</td>
						</tr>
						<tr>
							<td>isEmoji(s)</td>
							<td>
								<mark>true</mark> if the string contains
								emoji (full Unicode regex).
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Async / system">
				<Code
					code={`import { copyToClipboard, hash } from 'pota/use/string'

await copyToClipboard('hello')
const digest = await hash('hello')            // SHA-256 hex string
const md5    = await hash('hello', 'SHA-1')`}
					render={false}
				/>
				<p>
					<mark>copyToClipboard(s)</mark> calls{' '}
					<mark>navigator.clipboard.writeText</mark> and
					swallows errors. <mark>hash(value, algo='SHA-256')</mark>{' '}
					returns the WebCrypto digest as a lowercase hex
					string.
				</p>
			</Section>

			<Section title="diff(a, b)">
				<p>
					For multi-line strings, returns{' '}
					<mark>[markedA, markedB]</mark> where each line is
					prefixed with <mark>'  '</mark> (equal) or{' '}
					<mark>'-&gt;'</mark> at the first divergence.
					Non-string or single-line inputs are returned
					unchanged. Used by{' '}
					<a href="/use/test">pota/use/test</a> to display
					assertion failures.
				</p>
			</Section>
		</>
	)
}
