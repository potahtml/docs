import { render } from 'pota'
import { mutable } from 'pota/store'

// we keep the reference to m1 (default behaviour)

const m1 = {}

const s1 = mutable([m1])

render(s1.includes(m1))

// we lose the reference to m2

const m2 = {}

const s2 = mutable([m2], true)

render(s2.includes(m2))
