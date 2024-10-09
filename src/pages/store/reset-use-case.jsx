import { render } from 'pota'
import { mutable, reset } from 'pota/store'

const defaultState = {
	host:
		location.hostname === 'localhost'
			? 'localhost'
			: 'a.fake.ip.address',
	images: [],
	keyframes: [],
	toRemove: [],
	forcedKeyframes: [],
	result: false,
	sidebarExpanded: true,
	timeline: {},
}

const state = mutable(defaultState, true)

const toggleSidebar = () =>
	(state.sidebarExpanded = !state.sidebarExpanded)

function resetState() {
	const { host, result, sidebarExpanded, ...s } = defaultState
	reset(state, s)
}

function addMockData() {
	state.keyframes.push(Math.ceil(Math.random() * 100))
	state.keyframes = [
		...new Set(state.keyframes.toSorted((a, b) => a - b)),
	]
	state.forcedKeyframes = [state.keyframes[0]]
	state.toRemove = [state.keyframes.at(-1)]
	state.timeline = { currentTime: Date.now() }
	state.result = 'random data'
}

function App() {
	return (
		<div>
			<button onClick={toggleSidebar}>Toggle</button>
			<button onClick={addMockData}>Add</button>
			<button onClick={resetState}>Reset</button>
			<pre>{() => JSON.stringify(state, null, 2)}</pre>
		</div>
	)
}

render(App)