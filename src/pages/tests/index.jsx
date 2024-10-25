import { Pota, render } from 'pota'

class MyComponent extends Pota {
	props = { some: 'lala' }

	ready() {
		render(<div>ready callback!</div>)
	}
	cleanup() {
		render(<div>cleanup callback!</div>)
	}
	render(props) {
		return (
			<main>
				{props.children} {props.some}
			</main>
		)
	}
}

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
		/*onClick={dispose}*/
	>
		{/*<Lala />*/}
	</button>,
)
