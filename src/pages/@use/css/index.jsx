import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="css">
				<mark>pota/use/css</mark> ships the building blocks for
				constructable stylesheets: a tagged-template{' '}
				<mark>css</mark> and a cached{' '}
				<mark>sheet(string)</mark> factory that both return a{' '}
				<mark>CSSStyleSheet</mark>, plus document /
				shadow-root <mark>adoptedStyleSheets</mark> helpers.
				This is the low-level surface the{' '}
				<a href="/props/css">css / use:css</a> prop is built
				on.
			</Header>

			<Section title="Tagged template and sheet()">
				<Code
					code={`import { css, sheet } from 'pota/use/css'

const styles = css\`
  :host { display: block }
  button { color: tomato }
\`

// equivalent — sheet() caches by string, so identical inputs share one CSSStyleSheet
const same = sheet(':host { display: block }')`}
					render={false}
				/>
				<p>
					<mark>css</mark> is just a thin wrapper over{' '}
					<mark>String.raw</mark> that calls{' '}
					<mark>sheet()</mark>. It's there so editors that
					recognise <mark>css\`...\`</mark> highlight your
					styles. <mark>sheet()</mark> is memoised — the same
					source string always returns the same{' '}
					<mark>CSSStyleSheet</mark> instance, so adopting it
					on many documents is cheap.
				</p>
			</Section>

			<Section title="addAdoptedStyleSheet / removeAdoptedStyleSheet">
				<p>
					Add or remove a single sheet on a document or shadow
					root. <mark>add</mark> is idempotent — adding the
					same sheet twice leaves a single entry.{' '}
					<mark>adoptedStyleSheets</mark> (a default-pre-bound{' '}
					<mark>document.adoptedStyleSheets</mark>) is also
					re-exported for direct access.
				</p>
				<Code
					code={`import {
  sheet,
  addAdoptedStyleSheet,
  removeAdoptedStyleSheet,
} from 'pota/use/css'

const s = sheet('body { background: black }')
addAdoptedStyleSheet(document, s)
// ...later
removeAdoptedStyleSheet(document, s)`}
					render={false}
				/>
			</Section>

			<Section title="addStyleSheets / addStyleSheetExternal">
				<p>
					<mark>addStyleSheets(doc, sheets)</mark> accepts a
					mixed array of <mark>CSSStyleSheet</mark> instances
					and strings. Strings starting with <mark>http</mark>{' '}
					are fetched (cached, so one request services every
					custom element that wants the same URL), parsed into
					a sheet, and adopted; plain CSS strings are passed
					through <mark>sheet()</mark>.{' '}
					<mark>addStyleSheetExternal(doc, url|text)</mark> is
					the single-entry version of that fetch-or-parse
					path.
				</p>
			</Section>
		</>
	)
}
