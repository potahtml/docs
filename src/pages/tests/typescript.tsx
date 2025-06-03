import { For } from 'pota/web'
import { Pota, signal } from 'pota'
import type { JSX } from 'pota'

declare module 'pota' {
	namespace JSX {
		interface IntrinsicElements {
			lala: {
				testing: boolean
			}
		}
	}
}

class MyComponent extends Pota {
	props = {
		what: 'true',
	}
	render(props) {
		return 'lala'
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

type ButtonProps = JSX.IntrinsicElements['button']

function Button({ ...allProps }: ButtonProps) {
	return <button {...allProps} />
}

// disallowing a type

type ButtonProps2 = Omit<JSX.IntrinsicElements['button'], 'type'>

function Button2({ ...allProps }: ButtonProps2) {
	return (
		<button
			type="button"
			{...allProps}
		/>
	)
}

// 💥 This works, we omitted type so its a type error
const z = <Button2 type="button">Hi</Button2>

// required

type MakeRequired<T, K extends keyof T> = Omit<T, K> &
	Required<{ [P in K]: T[P] }>

type ImgProps = MakeRequired<
	JSX.IntrinsicElements['img'],
	'alt' | 'src'
>

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

type ControlledProps = Omit<
	JSX.IntrinsicElements['input'],
	'value'
> & {
	value?: string
}

const Div = () => <div />
const Div2 = <div />

declare module 'pota' {
	namespace JSX {
		interface IntrinsicElements {
			'some-element': HTMLAttributes<HTMLElement>
		}
		interface NSAttributes<Element> {
			'prop:bla'?: boolean
		}
	}
}

function Test() {
	return <some-element on:error={e => console.log(e)} />
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
			on:mount={e => {}}
		>
			<lala></lala>
			<Button style:stroke="antiquewhite" />
			<Card title="lala">lala</Card>
			<LoginMsg name="name" />
			<Div />
			{Div2}
			<span
				ref={element => {
					console.log(element)
				}}
				on:mount={e => e}
				on:click={e => {
					e.target
					e.currentTarget
				}}
			>
				<TestArrow />
				{/*<StringObject />*/}
				<MyFactoryFunction lala="true" />
				<MyComponent
					what="content"
					javier="243"
				/>

				<meta content="404 Not Found" />
				<svg
					href="ss"
					on:mount={e => e}
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
					on:mount={e => {
						console.log(e)
					}}
				></span>
				<dialog tabindex="-1" />
				<div tabindex="-1" />
			</span>
		</span>
	)
}

typescript({})
