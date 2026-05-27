import { effect, signal } from 'pota'

const count = signal(0)

effect(() => {
  // runs once now, and again whenever `count` changes
  console.log(count.read())
})
