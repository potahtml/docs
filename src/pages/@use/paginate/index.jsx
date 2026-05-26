import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="paginate">
				<mark>pota/use/paginate</mark> turns a fetch function
				(or a reactive iterable) into a paged view: a slice
				of items, current page state, total pages, and{' '}
				<mark>next</mark> / <mark>previous</mark> controls.
				Backed by <mark>memo</mark> / <mark>derived</mark>, so
				it reacts to changes in <mark>numPerPage</mark>,{' '}
				<mark>numItems</mark>, or an external <mark>page</mark>{' '}
				accessor.
			</Header>

			<Section title="Exports">
				<Code
					code={`import {
  paginate,        // paginate(fetch, options) → PaginatePage
  paginateValues,  // paginateValues(items, numPerPage, page?) → PaginatePage
} from 'pota/use/paginate'`}
					render={false}
				/>
			</Section>

			<Section title="Shape">
				<p>Both functions return the same object:</p>
				<Code
					code={`{
  items,         // Derived<unknown[]> — the current slice (Promise-aware)
  page,          // Derived<number>    — writable raw cursor
  currentPage,   // signal accessor    — clamped to [1, totalPages]
  totalPages,    // signal accessor
  hasNext,       // () => boolean
  hasPrevious,   // () => boolean
  next,          // () => void
  previous,      // () => void
}`}
					render={false}
				/>
				<p>
					<mark>currentPage</mark> is what you render;{' '}
					<mark>page</mark> is the raw cursor — writes to it
					(by <mark>next</mark> / <mark>previous</mark> or
					externally) are preserved across changes to{' '}
					<mark>numItems</mark> /{' '}
					<mark>numPerPage</mark>, but the clamped{' '}
					<mark>currentPage</mark> is what slices the items.
				</p>
			</Section>

			<Section title="paginateValues — paginate an in-memory iterable">
				<p>
					Pass anything with <mark>.values()</mark> (Array,
					Map, Set, a reactive store …) and a per-page
					count. The slice updates whenever any of those
					change.
				</p>
				<Code url="/pages/@use/paginate/values.jsx"></Code>
			</Section>

			<Section title="paginate — async fetch">
				<p>
					Use <mark>paginate</mark> when the data lives behind
					a request: pass a <mark>fetch(start, end)</mark>{' '}
					that returns an array <em>or</em> a Promise of one,
					plus accessors for <mark>numPerPage</mark> and{' '}
					<mark>numItems</mark>. <mark>items</mark> is a{' '}
					<a href="/Reactivity/derived">Derived</a>, so it reports{' '}
					<mark>nothing</mark> while pending and the resolved
					array afterwards.
				</p>
				<Code
					code={`import { paginate } from 'pota/use/paginate'

const { items, currentPage, totalPages, next, previous } = paginate(
  (start, end) =>
    fetch(\`/api/rows?from=\${start}&to=\${end}\`).then(r => r.json()),
  {
    numPerPage: () => 20,
    numItems:   () => 1_000,
  },
)`}
					render={false}
				/>
			</Section>

			<Section title="External page source">
				<p>
					Pass <mark>options.page</mark> (an accessor) when
					the current page lives in a URL search param or
					some other tracked source. Updates from that source
					clobber any prior <mark>next</mark> /{' '}
					<mark>previous</mark> writes — the external source
					becomes the authority.
				</p>
				<Code
					code={`import { paginate } from 'pota/use/paginate'
import { location } from 'pota/use/location'

const page = () => Number(location.searchParams.page) || 1

const { items, currentPage, hasNext, next } = paginate(fetch, {
  numPerPage: () => 25,
  numItems:   () => total(),
  page,
})`}
					render={false}
				/>
			</Section>
		</>
	)
}
