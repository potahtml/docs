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

const [read, write] = signal('lefta')

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
