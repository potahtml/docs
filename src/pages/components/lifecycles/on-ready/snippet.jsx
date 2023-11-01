import { onReady, render } from 'pota'

function Component() {
  onReady(() => render('Component is ready'))

  return <main></main>
}
