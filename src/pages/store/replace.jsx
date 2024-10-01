import { render } from 'pota'
import { replace } from 'pota/store'

const target = { aa: true, q: [1, 2] }

const source = { bb: true, q: [3] }

replace(target, source)

render(<pre>{JSON.stringify(target, null, 2)}</pre>)
