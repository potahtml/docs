import { render } from 'pota'

function App() {
  return (
    <main>
      <section id="section1"></section>
      <hr />
      <section id="section2"></section>
      <hr />
      <section id="section3"></section>

      <button
        name="button"
        onClick={() => dispose1()}
      >
        dispose 1
      </button>
      <button
        name="button"
        onClick={() => dispose2()}
      >
        dispose 2
      </button>
      <button
        name="button"
        onClick={() => dispose3()}
      >
        dispose 3
      </button>
      <button
        name="button"
        onClick={() => dispose()}
      >
        dispose all
      </button>
    </main>
  )
}

const dispose = render(App)

const handler = () => console.log('moving mouse')
// components
const section1 = () => <b onMouseMove={handler}>Im in section 1</b>
const section2 = () => <b onMouseMove={handler}>Im in section 2</b>
const section3 = () => <b onMouseMove={handler}>Im in section 3</b>

// render these to each section
const dispose2 = render(section2, document.getElementById('section2'))
const dispose1 = render(section1, document.getElementById('section1'))
const dispose3 = render(section3, document.getElementById('section3'))
