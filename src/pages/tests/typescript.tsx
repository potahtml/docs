import { For } from 'pota/web'
import { Pota, signal } from 'pota'
import type { JSX } from 'pota/jsx-runtime'

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

// 💥 This breaks, as we omitted type
  const z = <Button2 type="button">Hi</Button>


// required

type MakeRequired<T, K extends keyof T> = Omit<T, K> &
  Required<{ [P in K]: T[P] }>;


type ImgProps
  = MakeRequired<
    JSX.IntrinsicElements["img"],
    "alt" | "src"
  >;

export function Img({ alt, ...allProps }: ImgProps) {
  return <img alt={alt} {...allProps} />;
}

const zz = <Img alt="..." src="..." />;

// re-writes a prop

type ControlledProps =
  Omit<JSX.IntrinsicElements["input"], "value"> & {
    value?: string;
  };


function typescript(props) {
	return (
		<span
			onClick={read}
			aria-busy={true}
			aria-readonly={true}
			what-what="aer"
			class:lalala={true}
			data-pathname={location.pathname}
			on:click={e => {
				console.log(e, e.currentTarget)
			}}
			onMount={eeeeee => {}}
		>
			<Button style:stroke="antiquewhite" />
			<Card title="lala">lala</Card>
			<LoginMsg name="name" />
			<span
				ref={element => {
					console.log(element)
				}}
				onMount={e => e}
				onClick={e => {
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
					onMount={e => e}
					color="red"
					onClick={e => {
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
				<span
					flair=""
					onMount={e => {
						console.log(e)
					}}
				></span>
			</span>
		</span>
	)
}

typescript({})
