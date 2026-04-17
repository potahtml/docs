import { Code } from '../../lib/components/code/code.jsx'
import { Header } from '../../lib/components/header.jsx'
import { Section } from '../../lib/components/section.jsx'

export default function () {
	return (
		<>
			<Header title="TypeScript">
				<p>
					pota ships a set of ambient component-utility types in{' '}
					<mark>pota/typescript/jsx/components.d.ts</mark>. Once
					your tsconfig has <mark>"jsxImportSource": "pota"</mark>
					, these types are globally available — no import line
					needed.
				</p>
			</Header>

			<Section title="Utility types at a glance">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>shape</th>
							<th>what it's for</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<mark>Component&lt;P&gt;</mark>
							</td>
							<td>(props: P) =&gt; JSX.Element</td>
							<td>any function component taking props P</td>
						</tr>
						<tr>
							<td>
								<mark>ParentComponent&lt;P&gt;</mark>
							</td>
							<td>Component&lt;P &amp; {'{ children? }'}&gt;</td>
							<td>
								component that accepts children — the typical
								layout/wrapper component
							</td>
						</tr>
						<tr>
							<td>
								<mark>VoidComponent&lt;P&gt;</mark>
							</td>
							<td>Component&lt;P&gt;</td>
							<td>
								component that explicitly does not accept children
							</td>
						</tr>
						<tr>
							<td>
								<mark>FlowComponent&lt;P, C&gt;</mark>
							</td>
							<td>
								Component&lt;P &amp; {'{ children?: C }'}&gt;
							</td>
							<td>
								flow-control component (Show, For, Switch) where{' '}
								<mark>C</mark> is a render-callback type
							</td>
						</tr>
						<tr>
							<td>
								<mark>ComponentType&lt;P&gt;</mark>
							</td>
							<td>
								Component&lt;P&gt; | (new (props: P) =&gt;
								JSX.ElementClass)
							</td>
							<td>
								anything that can be rendered as a component —
								function or class
							</td>
						</tr>
						<tr>
							<td>
								<mark>Children&lt;C&gt;</mark>
							</td>
							<td>C | (C | JSX.Element)[]</td>
							<td>
								mixed list of render callbacks and elements —
								useful for callback-style children (Show, For)
							</td>
						</tr>
						<tr>
							<td>
								<mark>ComponentProps&lt;T&gt;</mark>
							</td>
							<td>
								props of a component function or intrinsic tag
							</td>
							<td>
								extracts props from a component reference or tag
								name (<mark>'button'</mark>,{' '}
								<mark>typeof MyButton</mark>)
							</td>
						</tr>
					</tbody>
				</table>
			</Section>

			<Section title="Typing props">
				<p>
					The simplest component is a function that receives a
					typed <mark>props</mark> object. You don't need any of
					the utility types for this — an inline object type is
					enough. Any prop you omit with a default is still
					available to callers.
				</p>
				<Code
					code={`
import { render } from 'pota'

function Greeting({ name = 'Quack' }: { name?: string }) {
	return <p>Hi {name}</p>
}

render(<Greeting />)
					`}
				/>
			</Section>

			<Section title="Component">
				<p>
					<mark>Component&lt;P&gt;</mark> is an alias for{' '}
					<mark>(props: P) =&gt; JSX.Element</mark>. Reach for it
					when you want the component's type to be visible at the
					declaration (useful for reassignment, overriding{' '}
					<mark>defaultProps</mark> patterns, or handing the
					component to a higher-order function). The annotation
					also forces the return type to be a JSX element, which
					catches accidental <mark>void</mark> returns early.
				</p>
				<Code
					code={`
import { render } from 'pota'

type GreetingProps = { name?: string }

const Greeting: Component<GreetingProps> = ({ name = 'Quack' }) => (
	<p>Hi {name}</p>
)

render(<Greeting name="world" />)
					`}
				/>
			</Section>

			<Section title="ParentComponent">
				<p>
					A <em>parent</em> component is one that renders
					children inside itself — cards, layouts, providers.{' '}
					<mark>ParentComponent&lt;P&gt;</mark> adds a{' '}
					<mark>children?: JSX.Element</mark> prop on top of{' '}
					<mark>P</mark> so you don't have to type it yourself.
					Callers get autocomplete for <mark>children</mark>{' '}
					without the component author having to reach for{' '}
					<mark>JSX.Element</mark> explicitly.
				</p>
				<Code
					code={`
import { render } from 'pota'

const Card: ParentComponent<{ title: string }> = props => (
	<section class="card">
		<h2>{props.title}</h2>
		{props.children}
	</section>
)

render(
	<Card title="Hello">
		<p>inside the card</p>
	</Card>,
)
					`}
				/>
			</Section>

			<Section title="VoidComponent">
				<p>
					The opposite of <mark>ParentComponent</mark>:{' '}
					<mark>VoidComponent&lt;P&gt;</mark> is a component that
					must not be passed children. Useful for self-closing
					leaf elements like icons, avatars, or form primitives —
					catching stray children at compile time prevents bugs
					where passed content would be silently ignored.
				</p>
				<Code
					code={`
import { render } from 'pota'

const Avatar: VoidComponent<{ src: string; alt: string }> = props => (
	<img src={props.src} alt={props.alt} width="64" height="64" />
)

render(
	<Avatar
		src="https://pota.quack.uy/assets/logo-small.png"
		alt="pota logo"
	/>,
)

// <Avatar src="…" alt="…">oops</Avatar>  ← type error
					`}
				/>
			</Section>

			<Section title="FlowComponent">
				<p>
					Flow-control components receive children as a function
					(or array of functions) that are invoked with a value —
					the pattern <mark>&lt;Show/&gt;</mark>,{' '}
					<mark>&lt;For/&gt;</mark>, <mark>&lt;Switch/&gt;</mark>{' '}
					use internally.{' '}
					<mark>FlowComponent&lt;P, C&gt;</mark> lets you type the
					callback shape explicitly, so callers get parameter
					inference on their render function and can't pass plain
					JSX where a callback is expected.
				</p>
				<Code
					code={`
import { render, signal } from 'pota'

const Counter: FlowComponent<
	{ start?: number },
	(count: Accessor<number>) => JSX.Element
> = props => {
	const [count, , updateCount] = signal(props.start ?? 0)
	return (
		<>
			<button on:click={() => updateCount(n => n + 1)}>+1</button>
			{props.children?.(count)}
		</>
	)
}

render(
	<Counter start={10}>
		{count => <p>clicks: {count}</p>}
	</Counter>,
)
					`}
				/>
			</Section>

			<Section title="ComponentType">
				<p>
					<mark>ComponentType&lt;P&gt;</mark> is the union of a
					function component and a component class — anything
					pota knows how to render. Use it for generic code that
					works with either flavour: higher-order components, or
					prop types that take "a component" without caring which
					kind.
				</p>
				<Code
					code={`
import { render } from 'pota'

function withBorder<P>(Inner: ComponentType<P>): Component<P> {
	return props => (
		<div style="border: 1px solid currentColor; padding: .5em">
			<Inner {...props} />
		</div>
	)
}

const Greeting: Component<{ name: string }> = props => (
	<p>Hi {props.name}</p>
)

const Bordered = withBorder(Greeting)

render(<Bordered name="world" />)
					`}
				/>
			</Section>

			<Section title="Children">
				<p>
					<mark>Children&lt;C&gt;</mark> widens a single callback
					type <mark>C</mark> into "either one <mark>C</mark>, or
					a mixed array of <mark>C</mark> and plain JSX elements".
					It's the shape <mark>&lt;Show/&gt;</mark> and{' '}
					<mark>&lt;Switch/&gt;</mark> accept for their children,
					so users can interleave render callbacks with
					straightforward JSX without extra wrappers.
				</p>
				<Code
					code={`
import { render, signal } from 'pota'
import { Show } from 'pota/components'

type Renderer<T> = (value: T) => JSX.Element

const MyShow: FlowComponent<
	{ when: unknown },
	Children<Renderer<unknown>>
> = props => (
	<Show when={props.when}>{props.children}</Show>
)

const [value] = signal('hello')

render(
	<MyShow when={value}>
		{v => <p>first callback: {v}</p>}
		<hr />
		{v => <p>second callback: {v}</p>}
	</MyShow>,
)
					`}
				/>
			</Section>

			<Section title="ComponentProps">
				<p>
					<mark>ComponentProps&lt;T&gt;</mark> pulls the props
					type out of any function component (<mark>typeof Foo</mark>
					) or intrinsic tag (<mark>'button'</mark>,{' '}
					<mark>'a'</mark>, …). It's how you build a wrapper that
					forwards every prop the wrapped thing accepts, without
					having to maintain a parallel prop list as the
					underlying type changes.
				</p>
				<Code
					code={`
import { render } from 'pota'

const PrimaryButton: Component<ComponentProps<'button'>> = props => (
	<button
		{...props}
		style="background:#2563eb;color:#fff;padding:.3em .7em"
	/>
)

render(
	<PrimaryButton on:click={() => alert('clicked')}>
		click me
	</PrimaryButton>,
)
					`}
				/>
			</Section>

			<Section title="Disallowing a prop">
				<p>
					Wrap the underlying props with{' '}
					<mark>Omit&lt;T, K&gt;</mark> when you want the wrapper
					to control a particular prop itself. Callers that try
					to pass the omitted key get a compile error, making the
					intended usage visible at the type level.
				</p>
				<Code
					code={`
import { render } from 'pota'

type SafeButtonProps = Omit<ComponentProps<'button'>, 'type'>

const SafeButton: Component<SafeButtonProps> = props => (
	<button type="button" {...props} />
)

render(<SafeButton>Safe</SafeButton>)

// <SafeButton type="submit"/>  ← type error
					`}
				/>
			</Section>

			<Section title="Requiring a prop">
				<p>
					Most DOM props are optional by default. To force one
					required, subtract it with <mark>Omit</mark> and add it
					back through <mark>Required&lt;Pick&lt;…&gt;&gt;</mark>.
					Handy for accessibility-critical props like an{' '}
					<mark>&lt;img&gt;</mark>'s <mark>alt</mark> text.
				</p>
				<Code
					code={`
import { render } from 'pota'

type ImgProps = Omit<ComponentProps<'img'>, 'alt' | 'src'> &
	Required<Pick<ComponentProps<'img'>, 'alt' | 'src'>>

const Img: Component<ImgProps> = props => <img {...props} />

render(
	<Img
		src="https://pota.quack.uy/assets/logo-small.png"
		alt="pota logo"
		width="64"
		height="64"
	/>,
)

// <Img src="…"/>  ← type error: alt missing
					`}
				/>
			</Section>

			<Section title="use:* plugin props">
				<p>
					Plugins registered with{' '}
					<a href="/props/propsPlugin">propsPlugin</a> add a new
					prop every element accepts. Tell TypeScript about it
					by merging into <mark>JSX.ElementAttributes&lt;Element&gt;</mark>
					inside a <mark>declare module 'pota'</mark> block. The{' '}
					<mark>Element</mark> generic is threaded through by
					pota so callback props can be typed against the element
					they're attached to (e.g.{' '}
					<mark>(node: Element) =&gt; void</mark> for a ref-style
					callback).
				</p>
				<Code
					code={`
import type { JSX } from 'pota'

declare module 'pota' {
	namespace JSX {
		interface ElementAttributes<Element> {
			'use:tooltip'?: {
				position: { x: number; y: number }
				text: string
			}
		}
	}
}

// now every element accepts the prop:
// <button use:tooltip={{ position: { x: 0, y: 0 }, text: 'Hi' }}/>
					`}
					render={false}
				/>
				<p>
					For a prop that accepts both a plain value and a signal,
					widen the type with <mark>| (() =&gt; T)</mark> — same
					pattern as intrinsic attributes.
				</p>
			</Section>

			<Section title="Custom Element">
				<p>
					Declaring a custom element in TypeScript has two parts:
					tell the compiler the tag exists, and describe its
					attributes. You do that by merging into{' '}
					<mark>JSX.IntrinsicElements</mark> with a{' '}
					<mark>declare module 'pota'</mark> block. To allow a
					signal as an attribute value, widen the type with{' '}
					<mark>() =&gt; T</mark> — that matches pota's
					runtime acceptance of function values.
				</p>
				<Code
					code={`
import type { JSX } from 'pota'
import { render, signal } from 'pota'

declare module 'pota' {
	namespace JSX {
		interface IntrinsicElements {
			'some-element': JSX.HTMLAttributes<HTMLElement> & {
				'some-string'?: string
				'some-number'?: number
				'some-other'?: number | (() => number)
			}
		}
	}
}

const [read, , update] = signal(0)

render(
	<>
		<p>count: {read}</p>
		<some-element
			some-string="quack"
			some-number={1}
			some-other={read}
		/>
		<button on:click={() => update(n => n + 1)}>increment</button>
	</>,
)
					`}
				/>
			</Section>
		</>
	)
}
