import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="favicon">
				<mark>pota/use/favicon</mark> draws a notification badge
				on top of the document favicon. Useful for unread-count
				indicators, build-status dots, and "you have a message"
				cues that show up in the tab even when the user has
				switched away.
			</Header>

			<Section title="Exports">
				<Code
					code={`import {
  setFaviconBadge,   // (badge?, opts?) → Promise<void>  — one-shot
  useFaviconBadge,   // (badge | accessor, opts?) → void — reactive
} from 'pota/use/favicon'`}
					render={false}
				/>
			</Section>

			<Section title="How it works">
				<p>
					The module snapshots the page's{' '}
					<mark>{`<link rel="icon">`}</mark> the first time it's
					called and draws every subsequent badge over that
					snapshot — so repeated calls don't bake earlier
					badges into the base image. The icon is rasterized
					into a 16×16 canvas; <mark>toDataURL()</mark> sets{' '}
					<mark>link.href</mark>.
				</p>
				<p>
					No-op when no <mark>{`<link rel="icon">`}</mark> is
					present, when the icon fails to load, or when the
					canvas is tainted (cross-origin icon without CORS) —
					the existing favicon is left untouched rather than
					throwing.
				</p>
			</Section>

			<Section title="setFaviconBadge — one-shot">
				<p>
					Pass a string or number to draw the badge; pass{' '}
					<mark>null</mark> / <mark>undefined</mark> / empty
					string to redraw the icon without one. Returns a
					promise that resolves once the icon swap is applied,
					so you can <mark>await</mark> it when sequencing UI
					feedback.
				</p>
				<Code
					code={`import { setFaviconBadge } from 'pota/use/favicon'

setFaviconBadge(unread)                        // "3"
setFaviconBadge(unread, { background: 'red' }) // override colors
setFaviconBadge(null)                          // clear`}
					render={false}
				/>
			</Section>

			<Section title="useFaviconBadge — reactive">
				<p>
					Pass an accessor (or signal's <mark>.read</mark>) and
					the favicon updates whenever the value changes;
					static values apply once. Does <em>not</em> clear the
					badge on scope dispose — favicons are page-global
					state, so call <mark>setFaviconBadge(null)</mark>{' '}
					from your own cleanup if you want it gone.
				</p>
				<Code
					code={`import { useFaviconBadge } from 'pota/use/favicon'

const unread = signal(0)
useFaviconBadge(() => unread.read() || null, { background: '#0a84ff' })`}
					render={false}
				/>
			</Section>

			<Section title="Options">
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
							<td>background?</td>
							<td>string</td>
							<td>
								badge fill color (default{' '}
								<mark>'red'</mark>)
							</td>
						</tr>
						<tr>
							<td>color?</td>
							<td>string</td>
							<td>
								badge text color (default{' '}
								<mark>'white'</mark>)
							</td>
						</tr>
					</tbody>
				</table>
			</Section>
		</>
	)
}
