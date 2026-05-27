import { Code } from '../../../lib/components/code/code.jsx'
import { Header } from '../../../lib/components/header.jsx'
import { Section } from '../../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="test">
				<mark>pota/use/test</mark> is the tiny in-browser test
				runner the pota test suite is built on. A{' '}
				<mark>test</mark> function with an{' '}
				<mark>expect</mark>-like API, plus DOM-introspection,
				timing, and selector shorthands. There's no CLI — tests
				log to the console and assertions reject promises on
				failure.
			</Header>

			<Section title="test(title, fn, stopTesting?)">
				<p>
					Runs <mark>fn(expect)</mark> and collects every
					assertion's promise. Returns a{' '}
					<mark>Promise.all</mark> of them, so{' '}
					<mark>await</mark>-ing the test waits for async
					assertions. Pass <mark>stopTesting: true</mark> to
					stop the module's subsequent <mark>test()</mark>{' '}
					calls from running — useful when one failure makes
					later assertions meaningless.{' '}
					<mark>test.reset()</mark> resets the numbering /
					stop flag (test-runner hook).
				</p>
				<Code
					code={`import { test } from 'pota/use/test'

test('signal round-trip', expect => {
  const s = signal(1)
  expect(s.read()).toBe(1)
  s.write(2)
  expect(s.read()).toBe(2)
})`}
					render={false}
				/>
			</Section>

			<Section title="expect">
				<p>
					The <mark>expect(value)</mark> object exposes{' '}
					<mark>toBe</mark> (strict <mark>===</mark>),{' '}
					<mark>toEqual</mark> (deep, sorted JSON compare),{' '}
					<mark>toInclude</mark>, <mark>toThrow</mark>,{' '}
					<mark>toMatch(regex)</mark>, plus a{' '}
					<mark>.not</mark> namespace mirroring all of them.{' '}
					<mark>toEqual</mark>, <mark>toInclude</mark>, and{' '}
					<mark>toThrow</mark> run inside an{' '}
					<a href="/Reactivity/untrack">untrack</a> so reading
					signals during compare doesn't create
					subscriptions.
				</p>
			</Section>

			<Section title="DOM introspection">
				<table>
					<tbody>
						<tr>
							<td>body()</td>
							<td>
								<mark>document.body.innerHTML.trim()</mark>.
							</td>
						</tr>
						<tr>
							<td>head()</td>
							<td>
								<mark>document.head.innerHTML.trim()</mark>.
							</td>
						</tr>
						<tr>
							<td>childNodes(node?)</td>
							<td>
								<mark>node.childNodes.length</mark>, defaults
								to <mark>document.body</mark>.
							</td>
						</tr>
						<tr>
							<td>$ / $$</td>
							<td>
								<mark>querySelector</mark> /{' '}
								<mark>querySelectorAll</mark>{' '}
								(spread into a real <mark>Array</mark>).
								Element type is inferred from the selector's
								leading tag, so{' '}
								<mark>{`$('input[name="x"]')`}</mark> typechecks
								as <mark>HTMLInputElement | null</mark>.
							</td>
						</tr>
						<tr>
							<td>isProxy(value)</td>
							<td>
								<mark>true</mark> when <mark>value</mark>{' '}
								is a <mark>Proxy</mark>. Implemented by
								wrapping the global <mark>Proxy</mark>{' '}
								constructor — only proxies created after this
								module loads are tracked.
							</td>
						</tr>
						<tr>
							<td>rerenders()</td>
							<td>
								adopts a stylesheet that flashes every
								element with a blue background on each
								render. Drop-in visualiser for render
								thrashing.
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Timing">
				<table>
					<tbody>
						<tr>
							<td>microtask()</td>
							<td>
								<mark>Promise.resolve()</mark>.
							</td>
						</tr>
						<tr>
							<td>macrotask()</td>
							<td>
								<mark>setTimeout(_, 0)</mark>.
							</td>
						</tr>
						<tr>
							<td>sleep(ms=0)</td>
							<td>
								<mark>setTimeout(_, ms)</mark> as a promise.
							</td>
						</tr>
						<tr>
							<td>sleepLong()</td>
							<td>
								<mark>sleep(300)</mark> — single tunable
								wait used by router / location tests where a
								macrotask isn't enough (e.g.{' '}
								<mark>history.back()</mark>).
							</td>
						</tr>
					</tbody>
				</table>
			</Section>
		</>
	)
}
