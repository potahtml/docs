import { ready, render } from 'pota'

function Component() {
  ready(() => render('Component is ready'))

  return <main></main>
}
