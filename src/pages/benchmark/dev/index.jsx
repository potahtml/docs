import { render, signal } from 'pota'
import { For } from 'pota/components'

import { useSelector } from 'pota/use/selector'

import { timing } from 'pota/use/time'

let idCounter = 1

function _random(max) {
	return Math.round(Math.random() * 1000) % max
}

function buildData(count) {
	const data = new Array(count)
	for (let i = 0; i < count; i++) {
		data[i] = signal('elegant green keyboard')
		data[i].id = idCounter++
	}
	return data
}

const Button = ({ id, text, fn }) => (
	<div class="col-sm-6 smallpad">
		<button
			prop:textContent={text}
			id={id}
			type="button"
			class="btn btn-primary btn-block"
			on:click={fn}
		/>
	</div>
)

const App = () => {
	const [data, setData, updateData] = signal([]),
		[selected, setSelected] = signal(null),
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
			for (let k = 0; k < 5; k++) {
				setData(buildData(1))
				setData([])
			}

			let createLarge = 0
			let clearLarge = 0
			let createSmall = 0
			let clearSmall = 0
			const results = []
			for (let k = 0; k < 10; k++) {
				createLarge += timing(() => setData(buildData(10000)))
				clearLarge += timing(() => setData([]))
				results.push(`
					createLarge ${createLarge / (k + 1)} clearLarge ${clearLarge / (k + 1)}
				`)
			}
			for (let k = 0; k < 10; k++) {
				createSmall += timing(() => setData(buildData(1000)))
				clearSmall += timing(() => setData([]))
				results.push(`
					createSmall ${createSmall / (k + 1)} clearSmall ${clearSmall / (k + 1)}
				`)
			}
			for (const item of results) console.log(item.trim())
			console.log('------------')
		},
		add = () => {
			updateData(d => [...d, ...buildData(1000)])
		},
		update = () => {
			const d = data()
			for (let i = 0; i < d.length; i += 10)
				d[i].update(l => l + ' !!!')
		},
		swapRows = () => {
			const d = [...data()]
			const tmp = d[1]
			d[1] = d[998]
			d[998] = tmp
			setData(d)
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
			<table class="table table-hover table-striped test-data">
				<tbody
					on:click={e => {
						const element = e.target
						if (element.selectRow !== undefined) {
							setSelected(element.selectRow)
						} else if (element.removeRow !== undefined) {
							remove(element.removeRow)
						}
					}}
				>
					<For each={data}>
						{row => {
							const { id, read } = row

							return (
								<tr class:danger={isSelected(id)}>
									<td
										prop:textContent={id}
										class="col-md-1"
									/>
									<td class="col-md-4">
										<a
											prop:selectRow={id}
											prop:textContent={read}
										/>
									</td>
									<td class="col-md-1">
										<a>
											<span
												prop:removeRow={id}
												aria-hidden="true"
												class="glyphicon glyphicon-remove"
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
				aria-hidden="true"
				class="preloadicon glyphicon glyphicon-remove"
			/>
		</div>
	)
}

render(App, document.getElementById('main'))
