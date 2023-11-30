import { effect, ref, render } from 'pota'

function App() {
  const button = ref()

  effect(() => {
    console.log(button())
  })

  return (
    <button
      name="button"
      ref={button}
      onClick={() => console.log(button())}
    >
      button
    </button>
  )
}

render(App)
