import { CheatSheet } from '../lib/components/cheatsheet.jsx'
import { Code } from '../lib/components/code/code.jsx'
import { Header } from '../lib/components/header.jsx'
import { Section } from '../lib/components/section.jsx'

import { CompilerLess } from './html/compiler-less.jsx'

export default function Home() {
	return (
		<>
			<Header>
				<h1
					id="pota"
					flair="row center"
				>
					pota
					<span flair="grow" />
					<img
						src="/assets/logo-small.png"
						height="53"
						width="53"
						alt="Pota Logo"
					/>
				</h1>
				<p>
					<b>pota</b> is a <em>small</em> and pluggable Reactive Web
					Renderer. It's compiler-less, includes an <mark>html</mark>{' '}
					function, and a optimized babel preset in case you fancy
					JSX.
				</p>
			</Header>

			<section>
				<p> XML</p>
				<p>&lt;svg../&gt; + xlink</p>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
				>
					...
					<image
						width="100"
						height="100"
						xlink:href="/assets/quack.png"
					></image>
					...
				</svg>
				<hr />
				<p>&lt;kilo:svg../&gt;</p>
				<kilo:svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
				>
					<kilo:path d="M10 10.5h1.5v3H10zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 15H6v-4.5H4.5V9h3v6zm5.5-1c0 .55-.45 1-1 1H9.5c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1H12c.55 0 1 .45 1 1v4zm6.5 1h-1.75L16 12.75V15h-1.5V9H16v2.25L17.75 9h1.75l-2.25 3 2.25 3z"></kilo:path>
				</kilo:svg>
				<hr />
				<p>&lt;fancy:svg../&gt; + xlink:</p>
				<fancy:svg
					viewBox="0 0 160 40"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
				>
					<a
						href="https://developer.mozilla.org/"
						xmlns:xlink="http://www.w3.org/1999/xlink"
					>
						<text
							x="10"
							y="25"
						>
							MDN Web Docs
						</text>
					</a>
				</fancy:svg>
				<hr />
				<p>&lt;math../&gt;</p>
				<math xmlns="http://www.w3.org/1998/Math/MathML">
					<mfrac>
						<msup>
							<mi>v</mi>
							<mn>2</mn>
						</msup>
						<mn>2</mn>
					</mfrac>
					<mo>+</mo>
					<mi>g</mi>
					<mi>z</mi>
					<mo>+</mo>
					<mfrac>
						<mi>p</mi>
						<mi>ρ</mi>
					</mfrac>
					<mo>=</mo>
					<mtext>constant</mtext>
				</math>
			</section>

			<p>
				The API and base components are <em>heavily</em> inspired by{' '}
				<a href="https://www.solidjs.com/">Solid</a>, albeit things
				differ to an extent based on personal preferences.
			</p>

			<p>
				The reactive library in use used to be pluggable, included{' '}
				<a href="https://github.com/vobyjs/oby">oby</a>,{' '}
				<a href="https://github.com/fabiospampinato/flimsy">flimsy</a>{' '}
				among other attempts at implementations. The main idea was to
				support all signal libraries, but subtle differences and lack
				of owners/context made the task difficult and time consuming.
				It required dedication that I rather put on the renderer.
			</p>

			<Section title="The Gist">
				<Code
					code={`

import { render, signal } from 'pota'

function Counter() {
  const [count, setCount, updateCount] = signal(1)
  const increment = () => updateCount(count => count + 1)

  return (
    <label>
      <button
        name="button"
        onClick={increment}
      >
        {count}
      </button>
    </label>
  )
}

render(Counter)
`}
				>
					The signal is used as function <mark>{'{count}'}</mark>{' '}
					rather than as a value <mark>{'{count()}'}</mark>.
				</Code>
			</Section>
			<Section title="Compiler-less">
				<CompilerLess />
			</Section>
			<Section title="Key Points">
				<ol>
					<li>
						Reactivity that is easy to understand. If something is a
						function, it can be reactive; if it is not a function,
						it's not reactive
					</li>
					<li>
						Doesn't use prop getters, or any getters; you can
						destructure function arguments and objects
					</li>
					<li>
						Renders any kind of XML, including custom namespaces
					</li>
					<li>
						Provides a <mark>propsPlugin</mark> function for using
						custom props on any element
					</li>
					<li>
						Allows multiple callbacks on components like{' '}
						<mark>Show</mark> and <mark>For</mark>
					</li>
					<li>Functions are tracked, regardless of nesting depth</li>
					<li>Renders objects, promises, maps, sets, etc</li>

					<li>
						Supports <mark>Class</mark> components with automatic
						method registration for <mark>ready</mark> and{' '}
						<mark>cleanup</mark>
					</li>
					<li>
						<mark>Portal</mark> does not wrap children in a{' '}
						<mark>div</mark>
					</li>
					<li>
						Includes a simple but full featured <mark>Route</mark>{' '}
						component
					</li>
					<li>Does not include server side rendering (SSR)</li>
					<li>
						<s>Does not include stores (possibly in the future)</s>.
						See <a href="/Reactivity/">Reactivity</a>
					</li>
				</ol>
			</Section>

			<Section
				title="All In One"
				style="height:250px;overflow:scroll"
			>
				<CheatSheet />
			</Section>
			<Section title="Why">
				<p>
					To understand reactivity better, and learn the inner bits of
					an automatic dependency tracking reactive renderer. The{' '}
					<a
						target="_blank"
						href="https://github.com/potahtml/pota"
					>
						Source code
					</a>{' '}
					is small and readable. Prioritizes consistency and is
					subjectively easy to understand. Its driven by developer
					needs, not benchmarks.
				</p>
			</Section>

			<Section title="Next">
				<p>
					Personally, this library adapts better to my expectations.
					The purpose of this page is to have a place to see it in
					action, test and document the renderer, its different
					components and behaviors.
				</p>
			</Section>

			<Section title="Logo">
				<p>
					Logo kindly provided by{' '}
					<a href="https://github.com/boredofnames">@boredofnames</a>
				</p>
			</Section>
			<footer>
				<small>-- Tito</small>
			</footer>
		</>
	)
}
