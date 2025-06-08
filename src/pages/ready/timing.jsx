import { render, ready } from 'pota'

function BeforeSibling() {
  ready(() => render(<div>ready: BeforeSibling:component body</div>))

  return (
    <section
      use:connected={() =>
        render(<div>connected: from BeforeSibling</div>)
      }
    />
  )
}
function AfterSibling() {
  ready(() => render(<div>ready: AfterSibling:component body</div>))

  return (
    <section
      use:connected={() =>
        render(<div>connected: from AfterSibling</div>)
      }
    />
  )
}
function Test() {
  ready(() => render(<div>ready: component body</div>))
  return (
    <main
      use:connected={() => render(<div>connected: from container</div>)}
    >
      <section>
        <div>
          <div
            use:connected={() => render(<div>connected: deep 1</div>)}
          />
        </div>
      </section>
      <BeforeSibling />
      <section
        use:connected={() =>
          render(<div>connected: from inlined element</div>)
        }
      ></section>
      <AfterSibling />
      <section>
        <div>
          <div
            use:connected={() => render(<div>connected: deep 2</div>)}
          />
        </div>
      </section>
    </main>
  )
}

ready(() => render(<div>ready: Top level before render</div>))

render(Test)

ready(() => render(<div>ready: Top level after render</div>))
