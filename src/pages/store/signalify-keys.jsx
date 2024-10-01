import { render } from 'pota'
import { signalify } from 'pota/store'

const state2 = signalify({ count: 0, lala: 0 }, ['lala'])

setInterval(() => state2.count++, 1000)
render(<pre>{() => state2.count}</pre>)

setInterval(() => state2.lala++, 1000)
render(<pre>{() => state2.lala}</pre>)
