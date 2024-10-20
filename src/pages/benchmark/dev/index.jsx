import { batch, render, signal } from 'pota'
import { useSelector } from 'pota/plugin/useSelector'
import { timing } from 'pota/plugin/useTime'
import { For } from 'pota/web'

let idCounter = 1
const adjectives = [
    'pretty',
    'large',
    'big',
    'small',
    'tall',
    'short',
    'long',
    'handsome',
    'plain',
    'quaint',
    'clean',
    'elegant',
    'easy',
    'angry',
    'crazy',
    'helpful',
    'mushy',
    'odd',
    'unsightly',
    'adorable',
    'important',
    'inexpensive',
    'cheap',
    'expensive',
    'fancy',
  ],
  colours = [
    'red',
    'yellow',
    'blue',
    'green',
    'pink',
    'brown',
    'purple',
    'brown',
    'white',
    'black',
    'orange',
  ],
  nouns = [
    'table',
    'chair',
    'house',
    'bbq',
    'desk',
    'car',
    'pony',
    'cookie',
    'sandwich',
    'burger',
    'pizza',
    'mouse',
    'keyboard',
  ]

function _random(max) {
  return Math.round(Math.random() * 1000) % max
}

function buildData(count) {
  let data = new Array(count)
  for (let i = 0; i < count; i++) {
    const [label, setLabel, updateLabel] = signal(
      `elegant green keyboard ${idCounter++}`,
      /*  `${adjectives[_random(adjectives.length)]} ${
        colours[_random(colours.length)]
      } ${nouns[_random(nouns.length)]} ${idCounter++}`,*/
    )
    data[i] = {
      id: idCounter,
      label,
      updateLabel,
    }
  }
  return data
}

const Button = ({ id, text, fn }) => (
  <div class="col-sm-6 smallpad">
    <button
      id={id}
      class="btn btn-primary btn-block"
      type="button"
      onClick={fn}
    >
      {text}
    </button>
  </div>
)

const App = () => {
  const [data, setData, updateData] = signal([]),
    [selected, setSelected] = signal(null),
    run = () => {
      // debugger
      setData(buildData(10))
    },
    runLots = () => {
      setData(buildData(10000))
    },
    bench = () => {
      //  console.clear()
      // warm
      for (let k = 0; k < 5; k++) {
        setData(buildData(10000))
        setData([])
      }

      let createLarge = 0
      let clearLarge = 0
      let createSmall = 0
      let clearSmall = 0
      for (let k = 0; k < 10; k++) {
        createLarge += timing(() => setData(buildData(10000)))
        clearLarge += timing(() => setData([]))
        console.log(
          k + ' createLarge',
          createLarge / (k + 1),
          k + ' clearLarge',
          clearLarge / (k + 1),
        )
      }
      console.log('------------')
      for (let k = 0; k < 10; k++) {
        createSmall += timing(() => setData(buildData(1000)))
        clearSmall += timing(() => setData([]))
        console.log(
          k + ' createSmall',
          createSmall / (k + 1),
          k + ' clearSmall',
          clearSmall / (k + 1),
        )
      }
    },
    add = () => updateData(d => [...d, ...buildData(1000)]),
    update = () =>
      batch(() => {
        for (let i = 0, d = data(), len = d.length; i < len; i += 10)
          d[i].updateLabel(l => l + ' !!!')
      }),
    swapRows = () => {
      const d = data().slice()
      if (d.length > 998) {
        let tmp = d[1]
        d[1] = d[998]
        d[998] = tmp
        setData(d)
      }
    },
    clear = () => setData([]),
    remove = id =>
      updateData(d => {
        const idx = d.findIndex(datum => datum.id === id)
        d.splice(idx, 1)
        return [...d]
      }),
    isSelected = useSelector(selected)

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>pota Keyed</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button
                id="run"
                text="Create 1,000 rows"
                fn={run}
              />
              <Button
                id="runlots"
                text="Create 10,000 rows"
                fn={runLots}
              />
              <Button
                id="add"
                text="Append 1,000 rows"
                fn={add}
              />
              <Button
                id="update"
                text="Update every 10th row"
                fn={update}
              />
              <Button
                id="clear"
                text="Clear"
                fn={clear}
              />
              <Button
                id="swaprows"
                text="Swap Rows"
                fn={swapRows}
              />
              <Button
                id="bench"
                text="bench"
                fn={bench}
              />
            </div>
          </div>
        </div>
      </div>
      <table
        class="table table-hover table-striped test-data"
        onClick={e => {
          const element = e.target
          const { selectRow, removeRow } = element
          if (selectRow !== undefined) {
            setSelected(selectRow)
          } else if (removeRow !== undefined) {
            remove(removeRow)
          }
        }}
      >
        <tbody>
          <For each={data}>
            {row => {
              const { id, label } = row

              return (
                <tr class={{ danger: isSelected(id) }}>
                  <td
                    class="col-md-1"
                    textContent={id}
                  />
                  <td class="col-md-4">
                    <a
                      textContent={label}
                      prop:selectRow={id}
                    />
                  </td>
                  <td class="col-md-1">
                    <a>
                      <span
                        class="glyphicon glyphicon-remove"
                        aria-hidden="true"
                        prop:removeRow={id}
                      />
                    </a>
                  </td>
                  <td class="col-md-6" />
                </tr>
              )
            }}
          </For>
        </tbody>
      </table>
      <span
        class="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      />
    </div>
  )
}

render(App, document.getElementById('main'))
