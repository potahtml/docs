import { render, lazy, Lazy } from 'pota'

function asyncFunctionReject() {
	return new Promise((resolve, reject) => setTimeout(reject, 3000))
}

async function asyncFunction() {
	return 'This promise resolved successfully!'
}

async function asyncFunctionWithProps() {
	return props => {
		return props.test
	}
}

const ComponentPromise = lazy(asyncFunctionWithProps)

function App() {
	return (
		<main>
			<div>
				{lazy(asyncFunctionReject, {
					onLoading: 'promise is loading',
					onError: 'promise fallback',
					onLoad: () => console.log('promise loaded!'),
				})}
			</div>

			<div>
				<Lazy
					children={asyncFunctionReject}
					onLoading="Lazy as component is loading"
					onError="Lazy as component fallback"
					onLoad={() => console.log('promise loaded!')}
				/>
			</div>

			<div>{lazy(asyncFunction)}</div>

			<div>
				<Lazy children={asyncFunction} />
			</div>

			<div>
				<ComponentPromise test="Wahoa!" />
			</div>
		</main>
	)
}

render(App)
