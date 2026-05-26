import { ready, ref, render } from 'pota'

function App() {
  const localRef = ref()
  const externalRef = ref()

  ready(() => {
    console.log('local sees', localRef().tagName)
    console.log('external sees', externalRef().tagName)
    console.log('same node?', localRef() === externalRef())
  })

  return (
    <input
      use:ref={[localRef, externalRef]}
      placeholder="bound to two refs"
    />
  )
}

render(App)
