import { derived, signal } from 'pota'

const base = signal(10)

const doubled = derived(() => base.read() * 2)

doubled() // read
doubled(50) // override (until base changes again)
