import { ref, render } from 'pota'
import { For } from 'pota/web'

/** this is wrong, I am just testing
 *
 *
 */

function typescript(): Component<HTMLDivElement> {
	return (
		<div
			onclick={e => {
				console.log(e.currentTarget)
			}}
			onClick={}
			ondblclick={eeeeeeee => {}}
			aria-busy={''}
			flair="row grow"
			offsetHeight={}
			aria-readonly={true}
			class:lalala={true}
			data-pathname={location.pathname}
			on:click={e => {
				console.log(e, e.currentTarget)
			}}
			onMount={eeeeee => {}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox=""
				onclick={e => {
					console.log(e.currentTarget)
					console.log(e.target)
				}}
			>
				<path d="" />
			</svg>
			<my-component />
			<my-component />
			<For
				each={() => {
					return [1, 2, 3]
				}}
			></For>
			<span
				lala=""
				onMount={e => {
					console.log(e)
				}}
			></span>
		</div>
	)
}

const div = typescript()
div.render(typescript)
