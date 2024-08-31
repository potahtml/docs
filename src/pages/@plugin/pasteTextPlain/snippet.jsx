import { render } from 'pota'

import 'pota/plugin/pasteTextPlain'

function App() {
  return (
    <main>
      <div contentEditable>try to paste here some html</div>
      <div
        contentEditable
        pasteTextPlain
      >
        now try the same here, it has pasteTextPlain
      </div>
    </main>
  )
}

render(App)
