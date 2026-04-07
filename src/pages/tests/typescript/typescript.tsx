/** @jsxImportSource pota */

import { Dynamic, For } from 'pota/components'
import { Pota, signal } from 'pota'
import type { JSX } from 'pota'

declare module 'pota' {
	namespace JSX {
		interface IntrinsicElements {
			lala: {
				testing: boolean
			}
			'some-element': HTMLAttributes<HTMLElement>
			'my-component': {
				lala?: string
			} & HTMLAttributes<HTMLElement>
		}
	}
}

function MyFactoryFunction() {
	return {
		render: (props: { what: 'havier' }) => {
			return props.what
		},
	}
}

const TestArrow = () => 1

const StringObject = {
	toString() {
		return 'test'
	},
}

function test() {
	return 'left' as const
}

const [read, write] = signal('lefta' as const)

// default props test
type LoginMsgProps = {
	name?: string
}

function LoginMsg({ name = 'Guest' }: LoginMsgProps) {
	return <p>Logged in as {name}</p>
}

// with children

type WithChildren<T = {}> = T & { children?: JSX.Element }

type CardProps = {
	title: string
} & WithChildren

function Card({ title, children }: CardProps) {
	return (
		<section class="cards">
			<h2>{title}</h2>
			{children}
		</section>
	)
}

// spread

type ButtonProps = JSX.Elements['button']

function Button({ ...allProps }: ButtonProps) {
	return <button {...allProps} />
}

// disallowing a type

type ButtonProps2 = Omit<JSX.Elements['button'], 'type'>

function Button2({ ...allProps }: ButtonProps2) {
	return (
		<button
			type="button"
			{...allProps}
		/>
	)
}

// 💥 This works, we omitted `type` so its a type error
const z = <Button2 type="button">Hi</Button2>

// required

type MakeRequired<T, K extends keyof T> = Omit<T, K> &
	Required<{ [P in K]: T[P] }>

type ImgProps = MakeRequired<JSX.Elements['img'], 'alt' | 'src'>

export function Img({ alt, ...allProps }: ImgProps) {
	return (
		<img
			alt={alt}
			{...allProps}
		/>
	)
}

// 💥 This works, we missing `alt` so its a type error

const zz = <Img src="..." />

// re-writes a prop

type ControlledProps = Omit<JSX.Elements['input'], 'value'> & {
	value?: string
}

const Div = () => <div />
const Div2 = <div />

declare module 'pota' {
	namespace JSX {
		interface HTMLSpanElementAttributes<Element> {
			'prop:bla'?: boolean
		}
	}
}

function Test() {
	return <some-element on:error={e => console.log(e)} />
}

// classes

class MyComponent extends Pota {
	props = { some: 'lala' }

	ready() {
		// render(<div>ready callback!</div>)
	}
	cleanup() {
		// render(<div>cleanup callback!</div>)
	}
	render(props) {
		return (
			<main>
				{props.children} {props.some}
			</main>
		)
	}
}

function typescript(props) {
	return (
		<span
			on:click={read}
			aria-busy={'true'}
			aria-readonly={'true'}
			what-what="aer"
			class:lalala={true}
			prop:bla={true}
			data-pathname={location.pathname}
			on:click={e => {
				console.log(e, e.currentTarget)
			}}
			use:connected={e => {}}
		>
			<div
				prop:bla="should error"
				prop:contentEditable={'true'}
			/>

			<lala testing={true}></lala>
			<data
				value="asd"
				prop:value="good"
			/>
			<Button style:stroke="antiquewhite" />
			<Card title="lala">lala</Card>
			<LoginMsg name="name" />
			<Div />
			{Div2}
			<span
				use:bind={signal}
				use:ref={element => {
					console.log(element)
				}}
				use:connected={e => e}
				on:click={e => {
					e.target
					e.currentTarget
				}}
			>
				<TestArrow />
				<StringObject />
				<MyFactoryFunction lala="true" />
				<MyComponent
					some="content"
					javier="243"
				/>

				<meta content="404 Not Found" />
				<svg
					href="ss"
					use:connected={e => e}
					color="red"
					on:click={e => {
						console.log(e.currentTarget)
						console.log(e.target)
					}}
				>
					<path />
				</svg>
				<my-component lala="true" />
				<my-component />
				<For
					each={() => {
						return [1, 2, 3]
					}}
				></For>
				<For each={[1, 2, 3]}></For>
				<span
					flair=""
					use:connected={e => {
						console.log(e)
					}}
				></span>
				<dialog tabindex="should error" />
				<div tabindex="-1" />
				<div use:clickoutside={(e, node) => {}} />
				<Dynamic
					component="h2"
					hola=""
				/>
				<Dynamic
					component={Card}
					hola=""
				/>
			</span>
		</span>
	)
}

typescript({})
