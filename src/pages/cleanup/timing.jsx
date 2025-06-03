import { render, cleanup } from 'pota'

function BeforeSibling() {
  cleanup(() =>
    render(<div>cleanup: BeforeSibling:component body</div>),
  )

  return (
    <section
      on:unmount={() =>
        render(<div>on:unmount Node: from BeforeSibling</div>)
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
      on:unmount={() =>
        render(<div>on:unmount Node: from AfterSibling</div>)
      }
    />
  )
}
function Test() {
  cleanup(() => render(<div>cleanup: component body</div>))
  return (
    <main
      on:unmount={() =>
        render(<div>on:unmount Node: from container</div>)
      }
    >
      <section>
        <div>
          <div
            on:unmount={() =>
              render(<div>on:unmount Node: deep 1</div>)
            }
          />
        </div>
      </section>
      <BeforeSibling />
      <section
        on:unmount={() =>
          render(<div>on:unmount Node: from inlined element</div>)
        }
      ></section>
      <AfterSibling />
      <section>
        <div>
          <div
            on:unmount={() =>
              render(<div>on:unmount Node: deep 2</div>)
            }
          />
        </div>
      </section>
    </main>
  )
}

const dispose = render(Test)

dispose()
