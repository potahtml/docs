import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'
import { Tag } from '../../../lib/components/tag.jsx'
import { Suspense } from 'pota/components'

export default function () {
	const offset = Date.now()

	function fetchTimeIn2Seconds() {
		return new Promise(res =>
			setTimeout(
				() => res(((Date.now() - offset) / 1000).toFixed(2)),
				2000,
			),
		)
	}

	const count = { A: 0, B: 0, C: 0 }

	function A() {
		count.A++
		const a = fetchTimeIn2Seconds

		return (
			<div class="box">
				A (rendered: {count.A}x) - complete in: {a()}s
				<B />
			</div>
		)
	}

	function B() {
		count.B++
		const b = fetchTimeIn2Seconds

		return (
			<div class="box">
				B (rendered: {count.B}x) - complete in: {b()}s
				<C />
			</div>
		)
	}

	function C() {
		count.C++
		const c = fetchTimeIn2Seconds

		return (
			<div class="box">
				C (rendered: {count.C}x) - complete in: {c()}s
			</div>
		)
	}

	function Aa() {
		const async = () =>
			new Promise(r => setTimeout(() => r(time()), 1000))

		return (
			<Suspense fallback={<p>Loading 1...</p>}>
				<p>A {async()}</p>
				<Bb wait={1000} />
				<p>A {async()}</p>
				<Suspense fallback={<p>Loading 2 ...</p>}>
					<p>A {async()}</p>
					<Bb wait={1000} />
					<p>A {async()}</p>
					<Bb wait={2000} />
				</Suspense>
			</Suspense>
		)
	}

	function Bb(props) {
		const async = () =>
			new Promise(r => setTimeout(() => r(time()), props.wait))

		return (
			<>
				<p>Bb {async()}</p>
				<Cc wait={1000} />
			</>
		)
	}

	function Cc(props) {
		const async = () =>
			new Promise(r => setTimeout(() => r(time()), props.wait))

		return <p>C {async()}</p>
	}

	const start = Date.now()
	const time = () => Date.now() - start

	return (
		<>
			{/*<Aa />
			<Suspense fallback="Loading...">
				<A />
			</Suspense>
			<Suspense fallback="Loadingaaa..">
				{new Promise(r => setTimeout(() => r('loaded a'), 1000))}
			</Suspense>*/}

			<Header title={<Tag>Suspense ...</Tag>}>
				Provides a fallback till children promises resolve
				(recursively)
			</Header>

			<Section title="Suspense Attributes">
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
							<td>fallback</td>
							<td>any</td>
							<td>
								show <mark>fallback</mark> while awaiting
							</td>
						</tr>
						<tr>
							<td>children</td>
							<td>children</td>
							<td>children to render</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Snippet">
				<Code
					url="/pages/@components/suspense/snippet.jsx"
					render={false}
				></Code>
			</Section>

			<Section title="Chained components demo">
				<Code url="/pages/@components/suspense/test.jsx"></Code>
			</Section>
		</>
	)
}
