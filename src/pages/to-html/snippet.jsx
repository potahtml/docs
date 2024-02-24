import { render, signal, toHTML } from 'pota'

function Menu(props) {
	const children = toHTML(props.children)
	console.log(children)
	return <ul>{children}</ul>
}

function App() {
	const [read, write] = signal(0)
	setInterval(() => write(value => value + 1), 1000)
	return (
		<Menu>
			<li>uno</li>
			<li>dos</li>
			<li>tres</li>
			<li>{read}</li>
			<li>{2 * 2 + 1}</li>
		</Menu>
	)
}

render(App)
