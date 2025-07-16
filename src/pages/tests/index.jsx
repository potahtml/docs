import { render } from 'pota'

/*const dispose = render(
	<MyComponent some="prop test">hello from class!</MyComponent>,
)
*/
const Lala = function () {
	return 'lala'
}

render(
	<button
		name="button"
		/*on:click={dispose}*/
	>
		{/*<Lala />*/}
	</button>,
)
