import { For } from 'pota/web'
import { JSX } from 'pota/jsx-runtime'

function typescript(): JSX.DOM<HTMLDivElement> {
	return (
		<div
			onClick={e => {
				console.log(e.currentTarget)
			}}
			aria-busy={''}
			aria-readonly={true}
			class:lalala={true}
			data-pathname={location.pathname}
			on:click={e => {
				console.log(e, e.currentTarget)
			}}
			onMount={eeeeee => {}}
		>
			<meta content="404 Not Found" />
			<svg
				onclick={e => {
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
		</div>
	)
}
