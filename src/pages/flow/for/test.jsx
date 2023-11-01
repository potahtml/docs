import { render, signal, For, Show } from 'pota'

function Example() {
  const [showing, setShowing] = signal(true)
  setInterval(() => setShowing(!showing()), 5_000)

  const [value, setValue] = signal([1, 2])
  let a = value().length + 1
  const content = () => a++

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
      <section class="testing">
        <For each={value}>
          {(item, index) => {
            return (
              <>
                <div class="render">
                  <b>{item}</b>
                </div>
                <Show when={showing}>e</Show>
                <br />
              </>
            )
          }}
        </For>
      </section>
      <hr /> simple value
      <section>
        <For each={value}>{item => item}</For>
      </section>
      <hr />
      <section>
        should dispose:
        <Show when={showing}>
          <For each={value}>
            {item => <b class="render">{item}</b>}
          </For>
        </Show>
      </section>
      <hr />
      <section>
        BEFORE
        <For each={value}>{item => <b class="render">{item}</b>}</For>
        AFTER
      </section>
      <hr />
      <section>
        <For each={value}>
          B{item => <b class="render">{item}</b>}A
        </For>
      </section>
      <hr />
      <section>
        <For each={value}>
          {item => (
            <>
              <br />
              BEFORE
              <br />
              <Show when={showing}>#0-</Show>
              <For each={value}>
                {item => (
                  <>
                    <b class="render">{item}</b>
                  </>
                )}
              </For>
              <Show when={showing}>-#N</Show>
              <br />
              AFTER
            </>
          )}
        </For>
      </section>
      <hr />
      <section>
        <For each={value}>
          <hr />
          before
          <br />
          {(item, index) => {
            return (
              <>
                <div class="render">
                  <b>{item}</b>
                </div>
                <Show when={showing}>e</Show>
                <br />
              </>
            )
          }}
          {(item, index) => ''}
          after
        </For>
      </section>
    </main>
  )
}

render(Example)

function Buttons(props) {
  let { value, setValue, content } = props

  let arr
  return (
    <>
      push:
      <button
        onClick={() => {
          arr = value()
          arr.push(content())
          setValue([...arr])
        }}
      >
        push - add
      </button>
      <button
        onClick={() => {
          arr = value()
          arr.push(content())
          arr.shift()
          setValue([...arr])
        }}
      >
        push+shift - add+remove
      </button>
      <button
        onClick={() => {
          arr = value()
          arr.pop()
          arr.push(content())
          setValue([...arr])
        }}
      >
        pop+push - remove+add
      </button>
      <hr />
      unshift:
      <button
        onClick={() => {
          arr = value()
          arr.unshift(content())
          setValue([...arr])
        }}
      >
        unshift - add
      </button>
      <button
        onClick={() => {
          arr = value()
          arr.unshift(content())
          arr.pop()
          setValue([...arr])
        }}
      >
        unshift+pop - add+remove
      </button>
      <button
        onClick={() => {
          arr = value()
          arr.unshift(content())
          arr.unshift(content())
          arr.unshift(content())
          setValue([...arr])
        }}
      >
        unshift 3 - add 3
      </button>
      <hr />
      removal:
      <button
        onClick={() => {
          arr = value()
          arr.pop()
          setValue([...arr])
        }}
      >
        pop - remove
      </button>
      <button
        onClick={() => {
          arr = value()
          arr.shift()
          setValue([...arr])
        }}
      >
        shift - remove
      </button>
      <button
        onClick={() => {
          arr = value()
          arr.shift()
          arr.pop()
          setValue([...arr])
        }}
      >
        shift+pop - remove
      </button>
      <hr />
      swap:
      <button
        onClick={() => {
          arr = value()
          if (arr.length < 1) return
          let a = arr[1]
          arr[1] = arr[0]
          arr[0] = a
          setValue([...arr])
        }}
      >
        1/2 = 2/1
      </button>
      <button
        onClick={() => {
          arr = value()
          if (arr.length < 2) return
          let a = arr[arr.length - 1]
          arr[arr.length - 1] = arr[0]
          arr[0] = a
          setValue([...arr])
        }}
      >
        first/last
      </button>
      <button
        onClick={() => {
          arr = value()
          if (arr.length < 3) return
          let a = arr[arr.length - 2]
          arr[arr.length - 2] = arr[1]
          arr[1] = a
          setValue([...arr])
        }}
      >
        first next/last prev
      </button>
      <button
        onClick={() => {
          arr = value()
          if (arr.length < 3) return
          let pos = (arr.length / 2) | 0
          let a = arr[pos]
          let b = arr[pos - 1]
          arr[pos] = b
          arr[pos - 1] = a
          setValue([...arr])
        }}
      >
        middle
      </button>
      <button
        onClick={() => {
          arr = value()
          if (arr.length < 3) return
          let pos = (arr.length / 3) | 0
          let a = arr[pos]
          let b = arr[pos - 1]
          arr[pos] = b
          arr[pos - 1] = a
          pos += pos
          a = arr[pos]
          b = arr[pos - 1]
          arr[pos] = b
          arr[pos - 1] = a
          setValue([...arr])
        }}
      >
        middle of middle
      </button>
      <hr />
      insertion:
      <button
        onClick={() => {
          arr = value()
          arr.splice((arr.length / 2) | 0, 0, content())
          setValue([...arr])
        }}
      >
        insert in middle
      </button>
      <button
        onClick={() => {
          arr = value()
          let position = (arr.length / 2) | 0
          arr.splice(position++, 0, content())
          arr.splice(position++, 0, content())
          arr.splice(position++, 0, content())
          setValue([...arr])
        }}
      >
        insert in middle many
      </button>
      <hr />
      random:
      <button
        onClick={() => {
          arr = value()
          arr.reverse()
          setValue([...arr])
        }}
      >
        reverse
      </button>
      <button
        onClick={() => {
          function shuffle(array) {
            let currentIndex = array.length,
              randomIndex

            // While there remain elements to shuffle.
            while (currentIndex != 0) {
              // Pick a remaining element.
              randomIndex = Math.floor(Math.random() * currentIndex)
              currentIndex--

              // And swap it with the current element.
              ;[array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
              ]
            }

            return array
          }

          setValue([...shuffle(value())])
        }}
      >
        shuffle
      </button>
      <button
        onClick={() => {
          let a = 1
          content = () => a++
          setValue([])
        }}
      >
        clear
      </button>
    </>
  )
}
