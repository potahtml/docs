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
      on:mount={button}
      on:click={() => console.log(button())}
    >
      button
    </button>
  )
}

render(App)
