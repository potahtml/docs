import { render } from 'pota'

function App() {
  return (
    <main>
      Unrelated elements arent removed on dispose
      <button
        name="button"
        on:click={() => dispose()}
      >
        dispose
      </button>
    </main>
  )
}
render(App)

function Test() {
  return <section>bye cruel world</section>
}

const dispose = render(Test, document.querySelector('main'))
