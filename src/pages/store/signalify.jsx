import { render } from 'pota'
import { signalify } from 'pota/store'

const state = signalify({ count: 0 })

setInterval(() => state.count++, 1000)

render(<pre>{() => state.count}</pre>)
