import { render, ready } from 'pota'

function BeforeSibling() {
  ready(() => render(<div>ready: BeforeSibling:component body</div>))

  return (
    <section
      onMount={() => render(<div>onMount: from BeforeSibling</div>)}
    />
  )
}
function AfterSibling() {
  ready(() => render(<div>ready: AfterSibling:component body</div>))

  return (
    <section
      onMount={() => render(<div>onMount: from AfterSibling</div>)}
    />
  )
}
function Test() {
  ready(() => render(<div>ready: component body</div>))
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

ready(() => render(<div>ready: Top level before render</div>))

render(Test)

ready(() => render(<div>ready: Top level after render</div>))
