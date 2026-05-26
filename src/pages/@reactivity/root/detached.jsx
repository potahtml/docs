import { effect, root, signal } from 'pota'

const dispose = root(dispose => {
  const [ticks, , updateTicks] = signal(0)

  effect(() => {
    document.title = `ticks: ${ticks()}`
  })

  const id = setInterval(() => updateTicks(n => n + 1), 1000)

  // when the caller disposes the root, stop the timer too
  return () => {
    clearInterval(id)
    dispose()
  }
})

// later, e.g. on hot-reload or page teardown:
// dispose()
