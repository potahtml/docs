import { batch, render, signal } from 'pota'
import { html } from 'pota/html'
import { useSelector } from 'pota/plugin/useSelector'
import { timing } from 'pota/plugin/useTime'

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
    const [label, setLabel] = signal(
      `${adjectives[_random(adjectives.length)]} ${
        colours[_random(colours.length)]
      } ${nouns[_random(nouns.length)]}`,
    )
    data[i] = {
      id: idCounter++,
      label,
      setLabel,
    }
  }
  return data
}

const bbutton = ({ id, text, fn }) =>
  html`<div class="col-sm-6 smallpad">
    <button
      id="${id}"
      class="btn btn-primary btn-block"
      type="button"
      on:click="${fn}"
    >
      ${text}
    </button>
  </div>`

const App = () => {
  const [data, setData, updateData] = signal([])
  const [selected, setSelected] = signal([])
  const run = () => setData(buildData(1000))
  const runLots = () => {
    setData(buildData(10000))
  }
  const bench = () => {
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
  }
  const add = () => updateData(d => [...d, ...buildData(1000)])
  const update = () =>
    batch(() => {
      for (let i = 0, d = data(), len = d.length; i < len; i += 10)
        d[i].setLabel(l => l + ' !!!')
    })
  const swapRows = () => {
    const d = data().slice()
    if (d.length > 998) {
      let tmp = d[1]
      d[1] = d[998]
      d[998] = tmp
      setData(d)
    }
  }
  const clear = () => setData([])
  const remove = id =>
    updateData(d => {
      const idx = d.findIndex(datum => datum.id === id)
      d.splice(idx, 1)
      return [...d]
    })
  const isSelected = useSelector(selected)

  html.define({ bbutton })

  return html`<div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>pota Keyed</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <bbutton
              id="run"
              text="Create 1,000 rows"
              fn="${run}"
            />
            <bbutton
              id="runlots"
              text="Create 10,000 rows"
              fn="${runLots}"
            />
            <bbutton
              id="add"
              text="Append 1,000 rows"
              fn="${add}"
            />
            <bbutton
              id="update"
              text="Update every 10th row"
              fn="${update}"
            />
            <bbutton
              id="clear"
              text="Clear"
              fn="${clear}"
            />
            <bbutton
              id="swaprows"
              text="Swap Rows"
              fn="${swapRows}"
            />
            <bbutton
              id="bench"
              text="bench"
              fn="${bench}"
            />
          </div>
        </div>
      </div>
    </div>
    <table
      class="table table-hover table-striped test-data"
      on:click="${e => {
        const element = e.target
        if (element.setSelected !== undefined) {
          setSelected(element.setSelected)
        } else if (element.removeRow !== undefined) {
          remove(element.removeRow)
        }
      }}"
    >
      <tbody>
        <For each="${data}">
          ${row => {
            const { id, label } = row

            return html`<tr class:danger="${isSelected(id)}">
              <td class="col-md-1">${id}</td>
              <td class="col-md-4">
                <a prop:setSelected="${id}">${label}</a>
              </td>
              <td class="col-md-1">
                <a>
                  <span
                    class="glyphicon glyphicon-remove"
                    aria-hidden="true"
                    prop:removeRow="${id}"
                  />
                </a>
              </td>
              <td class="col-md-6" />
            </tr>`
          }}
        </For>
      </tbody>
    </table>
    <span
      class="preloadicon glyphicon glyphicon-remove"
      aria-hidden="true"
    />
  </div>`
}

render(App, document.getElementById('main'))
