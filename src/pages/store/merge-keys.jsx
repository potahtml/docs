import { render } from 'pota'
import { merge } from 'pota/store'

const target = {
	a: true,
	q: [{ id: 0 }, { id: 1, name: 'Quack' }],
}

const source = {
	b: true,
	q: [{ id: 1, lastName: 'Murci' }, { id: 2 }],
}

const ref = target.q[1]

merge(target, source, { q: { key: 'id' } })

render(ref === target.q[1])

render(<pre>{JSON.stringify(target, null, 2)}</pre>)