import { render, signal } from 'pota'

function App() {
  const [randomColor, setRandomColor] = signal()
  setInterval(() => {
    setRandomColor(
      '#' + Math.floor(Math.random() * 16777215).toString(16),
    )
  }, 1_000)

  return (
    <main>
      <div style="color:red"> red</div>
      <div style="color:blue;padding:4px">blue with padding</div>
      <div style={{ color: 'orange' }}>orange from object</div>
      <div
        style={{
          color: 'orange',
          'border-left': '1px solid grey',
          padding: '3px',
        }}
      >
        orange with border from object
      </div>
      <div style:color="yellow">yellow namespaced</div>
      <div
        style="color:var(--color)"
        var:color="purple"
      >
        purple from var
      </div>
      <div
        style:my-ns={{
          color: randomColor,
        }}
      >
        random color from signal + namespaced + object
      </div>
      <div style:color={randomColor}>
        random color from signal + namespace
      </div>
      <div
        style="color:var(--color)"
        var:color={randomColor}
      >
        random color from signal + var
      </div>
      <div style={() => 'color:' + randomColor()}>
        cssText + signal
      </div>
      <div style={undefined}>undefined</div>
      <div style={null}>null</div>
      <div style:color={undefined}>style:colorundefined</div>
      <div style:color={null}>style:colornull</div>
      <div
        style:my-ns={{
          undefined: undefined,
          [undefined]: undefined,
          null: null,
          [null]: null,
        }}
      >
        my-ns:object
      </div>
      <div
        style={{
          undefined: undefined,
          [undefined]: undefined,
          null: null,
          [null]: null,
        }}
      >
        object
      </div>
      <div
        style="color:var(--color)"
        var:color={undefined}
      >
        var:color=undefined
      </div>
      <div
        style="color:var(--color)"
        var:color={null}
      >
        var:color=null
      </div>
    </main>
  )
}

render(App)
