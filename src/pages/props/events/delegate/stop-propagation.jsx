import { render } from 'pota'

function App(props) {
  return (
    <main>
      <section>
        <b>Delegated Events</b>
        <p>
          On delegate events <mark>stopPropagation</mark> doesnt work
          as expected
        </p>
        <div
          onMount={element => {
            element.addEventListener('click', () => {
              render(<div>div native</div>)
            })
          }}
          onClick={() => {
            render(<div>div</div>)
          }}
        >
          <button
            onClick={event => {
              event.stopPropagation()
              render(<div>button</div>)
            }}
          >
            button
          </button>
        </div>
      </section>
      <hr />
      <section>
        <b>Native Events</b>
        <p>
          On the other hand, on native events{' '}
          <mark>stopPropagation</mark> works as expected
        </p>

        <div
          onMount={element => {
            element.addEventListener('click', () => {
              render(<div>div native</div>)
            })
          }}
          on:click={() => {
            render(<div>div</div>)
          }}
        >
          <button
            on:click={event => {
              event.stopPropagation()
              render(<div>button</div>)
            }}
          >
            button
          </button>
        </div>
      </section>
    </main>
  )
}

render(App)
