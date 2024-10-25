import { render } from 'pota'
import { signalify } from 'pota/store'

const state = signalify({ count: 0, lala: 0 }, ['lala'])

setInterval(() => state.count++, 1000)
render(<pre>{() => state.count}</pre>)

setInterval(() => state.lala++, 1000)
render(<pre>{() => state.lala}</pre>)
