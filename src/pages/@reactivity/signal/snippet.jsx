import { signal } from 'pota'

const [count, setCount, updateCount] = signal(0)

count() // read
setCount(5) // write
updateCount(n => n + 1) // update from previous, untracked
