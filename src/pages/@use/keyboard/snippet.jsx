import { render, signal } from 'pota'
import { shortcut, submitOnCtrlEnter } from 'pota/use/keyboard'

function App() {
  const draft = signal('')
  const last = signal('')

  return (
    <form on:submit={e => e.preventDefault()}>
      <textarea
        rows="4"
        value={draft.read}
        on:input={e => draft.write(e.currentTarget.value)}
        use:ref={[
          shortcut('mod+b', () =>
            draft.update(d => d + '**bold**'),
          ),
          submitOnCtrlEnter(() => last.write(draft.read())),
        ]}
      />
      <p>
        last submitted: <mark>{last.read}</mark>
      </p>
      <p>
        try <kbd>Ctrl/Cmd</kbd>+<kbd>B</kbd>, then{' '}
        <kbd>Ctrl/Cmd</kbd>+<kbd>Enter</kbd>
      </p>
    </form>
  )
}

render(App)
