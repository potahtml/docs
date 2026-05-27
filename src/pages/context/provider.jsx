import { context, render, signal } from 'pota'

const Context = context()

function Component(props) {
	const value = signal(0)

	setInterval(() => {
		value.update(num => (num += 1))
	}, 1_000)

	return (
		<Context.Provider value={{ myValue: value.read }}>
			<b>children: </b>
			{props.children}

			<b>QueryContext:</b>
			<QueryContext />
		</Context.Provider>
	)
}

function QueryContext() {
	const value = Context()
	return <p>{value.myValue}</p>
}

function App() {
	return (
		<Component>
			<QueryContext />
		</Component>
	)
}

render(App)
