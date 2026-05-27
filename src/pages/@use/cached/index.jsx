import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="cached">
				<mark>cached(url, opts?)</mark> from{' '}
				<mark>pota/use/cached</mark> is a three-layer{' '}
				<mark>fetch</mark> wrapper: in-flight dedup, the browser
				Cache API with per-entry TTL, then a real network
				request. Returns a <mark>Promise</mark> — drop it into{' '}
				<a href="/Reactivity/derived">derived</a> and you get a
				Suspense-friendly reactive value with zero retry
				bookkeeping.
			</Header>

			<ul>
				<li>
					<mark>ttl</mark> — milliseconds a cached response
					stays fresh. Default <mark>Infinity</mark>. After
					expiry the next call re-fetches and re-stamps.
				</li>
				<li>
					<mark>cacheName</mark> — Cache API bucket name.
					Default <mark>'pota-cache-v1'</mark>. Bump it when
					you ship a breaking response shape — old entries
					stay isolated and eventually get evicted.
				</li>
				<li>
					<mark>parse</mark> — applied to the cached or
					freshly-fetched <mark>Response</mark>. Default{' '}
					<mark>r =&gt; r.json()</mark>; pass{' '}
					<mark>r =&gt; r.text()</mark>,{' '}
					<mark>r =&gt; r.blob()</mark>, etc. to opt out.
				</li>
			</ul>

			<Section title="Reactive fetch with derived">
				<p>
					<a href="/Reactivity/derived">derived</a> calls{' '}
					<mark>cached</mark> whenever the URL changes; both
					layers handle their own deduplication, so flipping
					between two ids never fires the same request twice.
				</p>
				<Code url="/pages/@use/cached/snippet.jsx"></Code>
			</Section>

			<Section title="TTL">
				<p>
					Entries are stamped with an internal{' '}
					<mark>x-cached-at</mark> header, so TTL works
					without a sidecar index — the Cache API itself is
					the source of truth. Concurrent callers within the
					TTL window share one Promise; the next call past
					expiry fetches once and refreshes the entry for
					everyone.
				</p>
				<Code url="/pages/@use/cached/ttl.jsx"></Code>
			</Section>

			<Section title="Non-JSON responses">
				<p>
					Provide your own <mark>parse</mark> to pull text,
					blobs, or anything else off the <mark>Response</mark>.
					The cache still stores the bytes; the parser only
					runs on the value you receive.
				</p>
				<Code url="/pages/@use/cached/text.jsx"></Code>
			</Section>
		</>
	)
}
