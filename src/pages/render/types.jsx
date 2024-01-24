import { render, Pota } from 'pota'

const div = document.createElement('div')
div.textContent = 'Im a div! '

const doc = new DocumentFragment()
doc.append('doc frag1', 'doc frag2')

const toRender = [
  'a string',
  '',
  -1,
  0,
  -0,
  1,
  1000n,
  NaN,
  undefined,
  null,
  false,
  true,
  Symbol('hehe'),
  div,
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  new Set([12, 13, 14]),
  new Map().set(15, 15).set(16, 16).set(17, 17),
  <span>Im a span</span>,
  doc,
  function MyComponent() {
    return 'Hi! '
  },
  () => 'Test',
  new (class Something {
    toString(props) {
      return 'can I render too?'
    }
  })(),
  class Something extends Pota {
    render(props) {
      return 'do we render classes too!?'
    }
  },
  async function () {
    return 'no way, really?!'
  },
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('wow')
    }, 2_500)
  }),
  Date,
  {
    name: 'Bender',
    toString: function () {
      return 'Im back baby -- ' + this.name
    },
  },
]

for (const component of toRender) {
  const dispose = render(component)
  render(
    <button
      name="button"
      onClick={dispose}
    >
      dispose
    </button>,
  )
  render(document.createElement('hr'))
}
