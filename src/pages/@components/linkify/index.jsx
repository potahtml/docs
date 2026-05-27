import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="Linkify">
				<mark>&lt;Linkify/&gt;</mark> is an inline formatter for
				chat-style text. It renders lightweight Markdown-ish
				markers, recognises media URLs, optionally substitutes{' '}
				<mark>:emoji:</mark> shortcodes, and can highlight a
				search term.
			</Header>

			<Section title="Import">
				<Code
					code={`import { Linkify } from 'pota/components'

<Linkify text="hello *world*, see https://pota.quack.uy/" />`}
					render={false}
				/>
			</Section>

			<Section title="Markers">
				<ul>
					<li>
						<mark>*bold*</mark> — <b>bold</b>
					</li>
					<li>
						<mark>/italic/</mark> — <em>italic</em>
					</li>
					<li>
						<mark>_underline_</mark> — <u>underline</u>
					</li>
					<li>
						<mark>-strike-</mark> — <s>strike</s>
					</li>
					<li>
						<mark>|spoiler|</mark> — hidden until clicked
					</li>
					<li>
						<mark>`code`</mark> — inline <code>code</code>,
						click to copy
					</li>
				</ul>
				<p>
					A leading <mark>&gt;</mark> wraps the block in{' '}
					<mark>&lt;q&gt;</mark>; a leading <mark>/ </mark>{' '}
					italicises the whole block. Markers may nest;
					whitespace inside a marker is preserved.
				</p>
			</Section>

			<Section title="Props">
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
							<td>text?</td>
							<td>string</td>
							<td>the input to render</td>
						</tr>
						<tr>
							<td>trim?</td>
							<td>boolean</td>
							<td>
								trim each line before joining. The outer
								string is always trimmed.
							</td>
						</tr>
						<tr>
							<td>mark?</td>
							<td>string | false</td>
							<td>
								highlight occurrences of this term
								(case-insensitive) — useful for search
								result rendering.
							</td>
						</tr>
						<tr>
							<td>emoji?</td>
							<td>boolean</td>
							<td>
								substitute <mark>:shortcodes:</mark> with
								unicode emoji.
							</td>
						</tr>
						<tr>
							<td>guessType?</td>
							<td>boolean</td>
							<td>
								for media URLs with ambiguous extensions,
								HEAD the URL to learn its{' '}
								<mark>Content-Type</mark> and pick the
								renderer accordingly. Wrapped in{' '}
								<mark>&lt;Suspense&gt;</mark>.
							</td>
						</tr>
						<tr>
							<td>scroll?</td>
							<td>() =&gt; void</td>
							<td>
								called when media loads — handy to pin a
								chat view to the bottom as images /
								videos resolve their natural size.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Media URLs">
				<p>
					Bare <mark>http(s)://</mark>, <mark>blob:</mark>,
					and <mark>data:</mark> URLs are turned into the
					appropriate native media element (image / audio /
					video) when the extension or MIME type is
					recognised. Everything else becomes a regular
					anchor. <mark>data:</mark> URIs are wrapped in an
					object URL so the rendered <mark>src</mark> stays
					compact; the object URL is revoked when the
					surrounding scope tears down.
				</p>
			</Section>
		</>
	)
}
