import { render } from 'pota'
import { pasteText } from 'pota/use/clipboard'

function App() {
  return (
    <main>
      <section>
        <p>
          paste rich text from anywhere — formatting, fonts, and
          colors are stripped to plain text
        </p>
        <input
          placeholder="paste here"
          use:ref={pasteText()}
          style={{ width: '100%' }}
        />
      </section>

      <section>
        <p>
          with a handler, the default insertion is skipped — uppercase
          the pasted text first
        </p>
        <textarea
          rows={4}
          style={{ width: '100%' }}
          use:ref={pasteText((text, e, node) => {
            const start = node.selectionStart ?? node.value.length
            const end = node.selectionEnd ?? node.value.length
            node.setRangeText(text.toUpperCase(), start, end, 'end')
            node.dispatchEvent(new Event('input', { bubbles: true }))
          })}
        />
      </section>
    </main>
  )
}

render(App)
