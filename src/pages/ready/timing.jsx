import { render, ready } from 'pota'

function BeforeSibling() {
  ready(() => render(<div>ready: BeforeSibling:component body</div>))

  return (
    <section
      on:mount={() => render(<div>on:mount: from BeforeSibling</div>)}
    />
  )
}
function AfterSibling() {
  ready(() => render(<div>ready: AfterSibling:component body</div>))

  return (
    <section
      on:mount={() => render(<div>on:mount: from AfterSibling</div>)}
    />
  )
}
function Test() {
  ready(() => render(<div>ready: component body</div>))
  return (
    <main
      on:mount={() => render(<div>on:mount: from container</div>)}
    >
      <section>
        <div>
          <div on:mount={() => render(<div>on:mount: deep 1</div>)} />
        </div>
      </section>
      <BeforeSibling />
      <section
        on:mount={() =>
          render(<div>on:mount: from inlined element</div>)
        }
      ></section>
      <AfterSibling />
      <section>
        <div>
          <div on:mount={() => render(<div>on:mount: deep 2</div>)} />
        </div>
      </section>
    </main>
  )
}

ready(() => render(<div>ready: Top level before render</div>))

render(Test)

ready(() => render(<div>ready: Top level after render</div>))
