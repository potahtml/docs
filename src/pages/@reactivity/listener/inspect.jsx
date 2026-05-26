import { effect, listener, signal } from 'pota'

const [value] = signal(1)

function read() {
  if (listener()) {
    console.log('tracked read')
  } else {
    console.log('untracked read')
  }
  return value()
}

read() // → "untracked read"
effect(() => read()) // → "tracked read"
