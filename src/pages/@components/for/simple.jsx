import { render, signal } from 'pota'
import { For } from 'pota/components'

function Example() {
  const [value, setValue] = signal([1, 2])
  const content = () => value().length + 1

  return (
    <main>
      <section class="buttons">
        <Buttons
          setValue={setValue}
          value={value}
          content={content}
        />
      </section>
      <hr />
      <For each={value}>
        {item => (
          <>
            <div class="render">
              <For each={value}>
                <>{item => <span class="render">{item}</span>}</>
              </For>
            </div>
          </>
        )}
      </For>
    </main>
  )
}

render(Example)

function Buttons(props) {
  let { value, setValue, content } = props

  let arr
  return (
    <>
      <button
        name="button"
        on:click={() => {
          arr = value()
          arr.splice((arr.length / 2) | 0, 0, content())
          setValue([...arr])
        }}
      >
        insert in middle
      </button>
      <button
        name="button"
        on:click={() => {
          arr = value()
          arr.push(content())
          arr.shift()
          setValue([...arr])
        }}
      >
        push+shift - add+remove
      </button>
    </>
  )
}
