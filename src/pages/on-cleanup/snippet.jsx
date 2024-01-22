import { onCleanup, render } from 'pota'

function Component() {
  onCleanup(() => render('Component was disposed'))

  return <main></main>
}
