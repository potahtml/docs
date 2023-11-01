import { context, render } from 'pota'

// creating a context with a default value

const useContext = context({ myValue: 1 })

// getting the value of the context

const myValue = useContext()

// setting a new value
useContext({ myValue: 2 }, () => {
	render(
		<div>
			myValue should be 2, myValue is: {useContext().myValue}
		</div>,
	)
	// setting a new value
	useContext({ myValue: 3 }, () => {
		render(
			<div>
				myValue should be 3, myValue is: {useContext().myValue}
			</div>,
		)
	})
	render(
		<div>
			myValue should be 2, myValue is: {useContext().myValue}
		</div>,
	)
})

// should be 1
render(
	<div>myValue should be 1, myValue is: {useContext().myValue}</div>,
)

// IN JSX

// creating a context with a default value
const Context = context({ myValue: 1 })

function Something() {
	return (
		<>
			<hr />
			<DisplayContextValue shouldbe="1" />
			<Context.Provider value={{ myValue: 2 }}>
				<DisplayContextValue shouldbe="2" />
			</Context.Provider>
			<DisplayContextValue shouldbe="1" />
		</>
	)
}

function DisplayContextValue(props) {
	const myValue = Context().myValue
	return (
		<div>
			myValue in jsx should be {props.shouldbe}, is: {myValue}
		</div>
	)
}

render(Something)
