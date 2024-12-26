import { effect, ref, render } from 'pota'

function App() {
  const button = ref()

  effect(() => {
    if (button()) {
      console.log(button())
    }
  })

  return (
    <button
      name="button"
      ref={button}
      on:click={() => console.log(button())}
    >
      button
    </button>
  )
}

render(App)
