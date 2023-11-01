import { context, render } from 'pota'

// IN JS

// creating a context with a default value
const useContext = context({ myValue: 1 })

// getting the value of the context
const myValue = useContext() // { myValue: 1 }

// setting a new value
useContext({ myValue: 2 }, () => {
	render(
		<div>
			myValue should be 2, myValue is: {useContext().myValue}
		</div>,
	)
})

// IN JSX

// creating a context with a default value
const Context = context({ myValue: 1 })

function Something() {
	return (
		<Context.Provider value={{ myValue: 2 }}>
			<DisplayContextValue />
		</Context.Provider>
	)
}

function DisplayContextValue() {
	const myValue = Context().myValue
	return myValue
}
