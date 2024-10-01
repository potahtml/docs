import { render } from 'pota'
import { mutable } from 'pota/store'

const state = mutable({ deep: { count: 0 } })

setInterval(() => state.deep.count++, 1000)

render(<pre>{() => state.deep.count}</pre>)
