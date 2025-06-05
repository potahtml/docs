import { render, cleanup } from 'pota'

function BeforeSibling() {
  cleanup(() =>
    render(<div>cleanup: BeforeSibling:component body</div>),
  )

  return (
    <section
      connected={() =>
        render(<div>connected Node: from BeforeSibling</div>)
      }
    />
  )
}
function AfterSibling() {
  cleanup(() =>
    render(<div>cleanup: AfterSibling:component body</div>),
  )

  return (
    <section
      connected={() =>
        render(<div>connected Node: from AfterSibling</div>)
      }
    />
  )
}
function Test() {
  cleanup(() => render(<div>cleanup: component body</div>))
  return (
    <main
      connected={() =>
        render(<div>connected Node: from container</div>)
      }
    >
      <section>
        <div>
          <div
            connected={() =>
              render(<div>connected Node: deep 1</div>)
            }
          />
        </div>
      </section>
      <BeforeSibling />
      <section
        connected={() =>
          render(<div>connected Node: from inlined element</div>)
        }
      ></section>
      <AfterSibling />
      <section>
        <div>
          <div
            connected={() =>
              render(<div>connected Node: deep 2</div>)
            }
          />
        </div>
      </section>
    </main>
  )
}

const dispose = render(Test)

dispose()
