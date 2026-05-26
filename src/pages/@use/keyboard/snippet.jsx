import { render, signal } from 'pota'
import { shortcut, submitOnCtrlEnter } from 'pota/use/keyboard'

function App() {
  const [draft, setDraft, updateDraft] = signal('')
  const [last, setLast] = signal('')

  return (
    <form on:submit={e => e.preventDefault()}>
      <textarea
        rows="4"
        value={draft}
        on:input={e => setDraft(e.currentTarget.value)}
        use:ref={[
          shortcut('mod+b', () =>
            updateDraft(d => d + '**bold**'),
          ),
          submitOnCtrlEnter(() => setLast(draft())),
        ]}
      />
      <p>
        last submitted: <mark>{last}</mark>
      </p>
      <p>
        try <kbd>Ctrl/Cmd</kbd>+<kbd>B</kbd>, then{' '}
        <kbd>Ctrl/Cmd</kbd>+<kbd>Enter</kbd>
      </p>
    </form>
  )
}

render(App)
