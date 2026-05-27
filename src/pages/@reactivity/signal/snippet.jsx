import { signal } from 'pota'

const count = signal(0)

count.read() // read
count.write(5) // write
count.update(n => n + 1) // update from previous, untracked
