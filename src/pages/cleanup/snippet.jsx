import { cleanup, render } from 'pota'

function Component() {
  cleanup(() => render('Component was disposed'))

  return <main></main>
}
