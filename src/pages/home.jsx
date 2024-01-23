import { CheatSheet } from '../lib/components/cheatsheet.jsx'
import { Code } from '../lib/components/code/code.jsx'
import { Header } from '../lib/components/header.jsx'
import { Section } from '../lib/components/section.jsx'

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
						src="/assets/logo.svg"
						height="52"
						width="52"
						alt="Pota Logo"
					/>
				</h1>
				<p>
					<b>pota</b> is a <em>small</em> and pluggable Reactive Web
					Renderer. Although its compiler-less, it includes a babel
					preset for transforming JSX.
				</p>
			</Header>

			<p>
				It doesn't include any <em>compiler magic</em>. Its abstracted
				API and components, allow you to switch between reactive
				libraries at any time. The API and base components are{' '}
				<em>heavily</em> inspired by{' '}
				<a href="https://www.solidjs.com/">Solid</a>, albeit things
				differ to an extent based on personal preferences.
			</p>

			<Section title="The Gist">
				<Code
					code={`
				// pota + solid reactivity - counter example

import { render, signal } from 'pota'

function Counter() {
  const [count, setCount] = signal(1)
  const increment = () => setCount(count => count + 1)

  return (
    <label>
      I heard you like to click counters
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

			<Section title="All In One">
				<CheatSheet />
			</Section>
			<Section title="Why">
				<p>
					To understand reactivity better, and learn the inner bits of
					an automatic dependency tracking reactive renderer. The{' '}
					<a
						target="_blank"
						href="https://github.com/potaorg/pota"
					>
						Source code
					</a>{' '}
					is small and readable. Prioritizes consistency and is
					subjectively easy to understand. Its driven by developer
					needs, not benchmarks.
				</p>
			</Section>

			<Section title="Key Points">
				<ol>
					<li>
						Reactivity that is easy to understand. If something is a
						function, it can be reactive; if it is not a function,
						it's not reactive
					</li>
					<li>
						Doesn't use prop getters, or any getters; you may use
						destructuring
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
						<mark>addEventListener</mark> and{' '}
						<mark>removeEventListener</mark> works as expected.
						Delegated events are cleaned
					</li>
					<li>
						Supports <mark>class</mark> components with automatic
						method registration for <mark>onReady</mark> and{' '}
						<mark>onCleanup</mark>
					</li>
					<li>
						<mark>Portal</mark> does not wrap children in a `div`
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
