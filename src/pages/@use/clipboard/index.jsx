import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="clipboard">
				<mark>pota/use/clipboard</mark> ships three ref
				factories: <mark>clipboard(value)</mark> copies on
				click, <mark>pasteText(handler?)</mark> intercepts
				paste and strips formatting, and{' '}
				<mark>pasteFiles(handler)</mark> captures pasted
				images and files.
			</Header>

			<ul>
				<li>
					<mark>function</mark> — invoked with the click
					event; its return value is copied
				</li>
				<li>
					<mark>string</mark> or <mark>number</mark> — that
					literal value is copied
				</li>
				<li>
					<mark>true</mark> — the element's own{' '}
					<mark>innerText</mark> is copied
				</li>
			</ul>

			<Section title="Three value shapes">
				<p>
					Pass <mark>true</mark> to copy the element's own{' '}
					<mark>innerText</mark>, a string to copy that
					literal text, or a function{' '}
					<mark>(event) =&gt; string</mark> to compute it on
					the fly.
				</p>
				<Code url="/pages/@use/clipboard/copy.jsx"></Code>
			</Section>

			<Section title="Snippet">
				<Code url="/pages/@use/clipboard/snippet.jsx"></Code>
			</Section>

			<Section title="pasteText — strip formatting on paste">
				<p>
					<mark>pasteText()</mark> with no handler intercepts{' '}
					<mark>paste</mark> events on{' '}
					<mark>&lt;input&gt;</mark>,{' '}
					<mark>&lt;textarea&gt;</mark>, and{' '}
					<mark>contenteditable</mark> hosts and inserts only
					the clipboard's <mark>text/plain</mark> portion at
					the caret — no rich-text styles, fonts, colors, or
					embedded images leak in. A synthetic{' '}
					<mark>input</mark> event is dispatched so{' '}
					<a href="/use/bind">bind</a> and other input
					listeners pick up the programmatic edit.
				</p>
				<p>
					Pass a <mark>(text, event, node)</mark> handler to
					massage the text first; the default insertion is
					skipped when a handler is provided.
				</p>
				<Code url="/pages/@use/clipboard/paste-text.jsx"></Code>
			</Section>

			<Section title="pasteFiles — capture pasted files">
				<p>
					<mark>pasteFiles(handler)</mark> fires only when at
					least one <mark>File</mark> is present in the
					clipboard (pasted images, files copied from the OS
					file manager, etc.).{' '}
					<mark>preventDefault()</mark> runs so the host
					doesn't also receive a textual representation.
				</p>
				<Code url="/pages/@use/clipboard/paste-files.jsx"></Code>
			</Section>
		</>
	)
}
