import { render, onReady } from 'pota'

function BeforeSibling() {
  onReady(() =>
    render(<div>onReady: BeforeSibling:component body</div>),
  )

  return (
    <section
      onMount={() => render(<div>onMount: from BeforeSibling</div>)}
    />
  )
}
function AfterSibling() {
  onReady(() =>
    render(<div>onReady: AfterSibling:component body</div>),
  )

  return (
    <section
      onMount={() => render(<div>onMount: from AfterSibling</div>)}
    />
  )
}
function Test() {
  onReady(() => render(<div>onReady: component body</div>))
  return (
    <main onMount={() => render(<div>onMount: from container</div>)}>
      <section>
        <div>
          <div onMount={() => render(<div>onMount: deep 1</div>)} />
        </div>
      </section>
      <BeforeSibling />
      <section
        onMount={() =>
          render(<div>onMount: from inlined element</div>)
        }
      ></section>
      <AfterSibling />
      <section>
        <div>
          <div onMount={() => render(<div>onMount: deep 2</div>)} />
        </div>
      </section>
    </main>
  )
}

onReady(() => render(<div>onReady: Top level before render</div>))

render(Test)

onReady(() => render(<div>onReady: Top level after render</div>))
