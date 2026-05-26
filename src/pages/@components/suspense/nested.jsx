import { derived, render } from 'pota'
import { Suspense } from 'pota/components'

const profile = derived(
  () =>
    new Promise(r => setTimeout(() => r({ name: 'Ada' }), 300)),
)
const feed = derived(
  () =>
    new Promise(r =>
      setTimeout(
        () =>
          r([
            { id: 1, text: 'first' },
            { id: 2, text: 'second' },
          ]),
        1500,
      ),
    ),
)

function App() {
  return (
    <Suspense fallback={<p>loading shell…</p>}>
      <header>welcome, {() => profile().name}</header>

      <Suspense fallback={<p>loading feed…</p>}>
        <ul>
          {() => feed().map(item => <li>{item.text}</li>)}
        </ul>
      </Suspense>
    </Suspense>
  )
}

render(App)
