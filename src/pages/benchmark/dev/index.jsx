import { render, signal } from 'pota'
import { For } from 'pota/web'

import { useSelector } from 'pota/plugin/useSelector'

import { timing } from 'pota/plugin/useTime'

let idCounter = 1
const adjectives = [
		'pretty',
		'large',
		'big',
		'small',
		'tall',
		'short',
		'long',
		'handsome',
		'plain',
		'quaint',
		'clean',
		'elegant',
		'easy',
		'angry',
		'crazy',
		'helpful',
		'mushy',
		'odd',
		'unsightly',
		'adorable',
		'important',
		'inexpensive',
		'cheap',
		'expensive',
		'fancy',
	],
	colours = [
		'red',
		'yellow',
		'blue',
		'green',
		'pink',
		'brown',
		'purple',
		'brown',
		'white',
		'black',
		'orange',
	],
	nouns = [
		'table',
		'chair',
		'house',
		'bbq',
		'desk',
		'car',
		'pony',
		'cookie',
		'sandwich',
		'burger',
		'pizza',
		'mouse',
		'keyboard',
	]

function _random(max) {
	return Math.round(Math.random() * 1000) % max
}

function buildData(count) {
	const data = new Array(count)
	for (let i = 0; i < count; i++) {
		const label = signal(
			`elegant green keyboard ${idCounter++}`,
			/*  `${adjectives[_random(adjectives.length)]} ${
		colours[_random(colours.length)]
	  } ${nouns[_random(nouns.length)]} ${idCounter++}`,*/
		)
		label.id = idCounter
		// console.log({ ...label })
		data[i] = label
	}
	return data
}

const Button = ({ id, text, fn }) => (
	<div class="col-sm-6 smallpad">
		<button
			textContent={text}
			id={id}
			class="btn btn-primary btn-block"
			type="button"
			on:click={e => {
				e.stopPropagation()
				fn()
			}}
		/>
	</div>
)

const App = () => {
	const [data, setData, updateData] = signal([]),
		[selected, setSelected] = signal(),
		run = () => {
			// debugger
			setData(buildData(10))
		},
		runLots = () => {
			setData(buildData(10000))
		},
		bench = () => {
			//  console.clear()
			// warm
			// debugger

			let createLarge = []
			let clearLarge = []
			let createSmall = []
			let clearSmall = []

			let k = 0

			// debugger
			function run() {
				createSmall.push(timing(() => setData(buildData(1000))))
				clearSmall.push(timing(() => setData([])))

				if (k < 10) {
					k++
					setTimeout(run, 100)
				} else {
					k = 0
					function run() {
						createLarge.push(timing(() => setData(buildData(10000))))
						clearLarge.push(timing(() => setData([])))

						if (k < 10) {
							k++
							setTimeout(run, 100)
						} else {
							const sort = function (a, b) {
								return a - b
							}
							createLarge.sort(sort)
							clearLarge.sort(sort)
							createSmall.sort(sort)
							clearSmall.sort(sort)

							createLarge.splice(7, 3)
							clearLarge.splice(7, 3)
							createSmall.splice(7, 3)
							clearSmall.splice(7, 3)

							function display(arr) {
								return +(
									arr.reduce((accumulator, currentValue) => {
										return accumulator + currentValue
									}, 0) / arr.length
								).toFixed(1)
							}
							console.log(
								'large: create',
								display(createLarge),
								'clear',
								display(clearLarge),
							)
							console.log(
								'small: create',
								display(createSmall),
								'clear',
								display(clearSmall),
							)

							console.log('------------')
						}
					}
					setTimeout(run, 100)
				}
			}
			setTimeout(run, 100)
		},
		add = () => {
			updateData(d => [...d, ...buildData(1000)])
		},
		update = () => {
			const d = data()
			const len = d.length
			for (let i = 0; i < len; i += 10) d[i].update(l => l + ' !!!')
		},
		swapRows = () => {
			const d = [...data()]
			if (d.length > 998) {
				const tmp = d[1]
				d[1] = d[998]
				d[998] = tmp
				setData(d)
			}
		},
		clear = () => {
			setData([])
		},
		remove = id => {
			updateData(d => {
				const idx = d.findIndex(datum => datum.id === id)
				d.splice(idx, 1)
				return [...d]
			})
		},
		isSelected = useSelector(selected)

	return (
		<div class="container">
			<div class="jumbotron">
				<div class="row">
					<div class="col-md-6">
						<h1>pota Keyed</h1>
					</div>
					<div class="col-md-6">
						<div class="row">
							<Button
								id="run"
								text="Create 1,000 rows"
								fn={run}
							/>
							<Button
								id="runlots"
								text="Create 10,000 rows"
								fn={runLots}
							/>
							<Button
								id="add"
								text="Append 1,000 rows"
								fn={add}
							/>
							<Button
								id="update"
								text="Update every 10th row"
								fn={update}
							/>
							<Button
								id="clear"
								text="Clear"
								fn={clear}
							/>
							<Button
								id="swaprows"
								text="Swap Rows"
								fn={swapRows}
							/>
							<Button
								id="bench"
								text="bench"
								fn={bench}
							/>
						</div>
					</div>
				</div>
			</div>
			<table
				class="table table-hover table-striped test-data"
				on:click={e => {
					e.stopPropagation()
					const element = e.target
					if (element.selectRow !== undefined) {
						setSelected(element.selectRow)
					} else if (element.removeRow !== undefined) {
						remove(element.removeRow)
					}
				}}
			>
				<tbody>
					<For each={data}>
						{row => {
							const { id, read } = row

							return (
								<tr class:danger={isSelected(id)}>
									<td
										textContent={id}
										class="col-md-1"
									/>
									<td class="col-md-4">
										<a
											textContent={read}
											prop:selectRow={id}
										/>
									</td>
									<td class="col-md-1">
										<a>
											<span
												class="glyphicon glyphicon-remove"
												aria-hidden="true"
												prop:removeRow={id}
											/>
										</a>
									</td>
									<td class="col-md-6" />
								</tr>
							)
						}}
					</For>
				</tbody>
			</table>
			<span
				class="preloadicon glyphicon glyphicon-remove"
				aria-hidden="true"
			/>
		</div>
	)
}

render(App, document.getElementById('main'))
