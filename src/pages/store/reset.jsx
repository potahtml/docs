import { render } from 'pota'
import { reset } from 'pota/store'

const target = {
	aa: true,
	q: [1, 2],
	w: { nope: 'ok', hola: [1, 2, 3] },
}

const source = { q: [], w: { hola: [], bb: false } }

reset(target, source)

render(<pre>{JSON.stringify(target, null, 2)}</pre>)
