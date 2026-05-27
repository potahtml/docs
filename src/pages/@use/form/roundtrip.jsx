import { ref, render, signal } from 'pota'
import { form2object, object2form } from 'pota/use/form'

function App() {
  const formRef = ref()
  const snapshot = signal({})

  return (
    <div>
      <form
        use:ref={formRef}
        on:submit={e => {
          e.preventDefault()
          snapshot.write(form2object(e.currentTarget))
        }}
      >
        <p>
          <input name="title" value="hello" />
        </p>
        <p>
          <label>
            <input type="checkbox" name="published" checked /> published
          </label>
        </p>
        <p>
          <label>
            <input type="radio" name="kind" value="article" checked /> article
          </label>
          <label style={{ 'margin-left': '1rem' }}>
            <input type="radio" name="kind" value="note" /> note
          </label>
        </p>
        <button>snapshot</button>
        <button
          type="button"
          on:click={() =>
            object2form(formRef(), {
              title: 'restored',
              published: false,
              kind: 'note',
            })
          }
        >
          restore preset
        </button>
      </form>

      <pre>{() => JSON.stringify(snapshot.read(), null, 2)}</pre>
    </div>
  )
}

render(App)
