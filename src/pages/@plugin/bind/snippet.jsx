import { render } from 'pota'

import { bind } from 'pota/plugin/bind'

function App() {
	const input = bind('email@example.net')
	const select = bind('1')
	const checkbox = bind(true)
	const radio = bind(2)
	const contentEditable = bind('editable')

	return (
		<main>
			<section>
				<input
					name="email"
					bind={input}
				/>{' '}
				email: {input}
				<button onClick={() => input('email2@example.net')}>
					select email2@example.net
				</button>
			</section>
			<section>
				<select bind={select}>
					<option>0</option>
					<option>1</option>
					<option>2</option>
					<option>3</option>
				</select>
				select: {select}
				<button onClick={() => select(3)}>select three</button>
			</section>
			<section>
				<input
					type="checkbox"
					bind={checkbox}
				/>{' '}
				checkbox: {checkbox}
				<button onClick={() => checkbox(true)}>set checked</button>
			</section>
			<section>
				<label>
					<input
						type="radio"
						bind={radio}
						name="lala"
						value="1"
					/>{' '}
					one{' '}
				</label>{' '}
				<label>
					<input
						type="radio"
						bind={radio}
						name="lala"
						value="2"
					/>{' '}
					two{' '}
				</label>
				{' - '}
				radio: {radio}
				<button onClick={() => radio(2)}>set 2</button>
			</section>
			<section>
				<label>
					<span
						contentEditable="true"
						bind={contentEditable}
					></span>
				</label>
				{' - '}
				{contentEditable}
				{' - '}
				<button onClick={() => contentEditable('')}>clear</button>
			</section>
		</main>
	)
}

render(App)
