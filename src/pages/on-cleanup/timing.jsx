import { render, onCleanup } from 'pota'

function BeforeSibling() {
  onCleanup(() =>
    render(<div>onCleanup: BeforeSibling:component body</div>),
  )

  return (
    <section
      onUnmount={() =>
        render(<div>onUnmountNode: from BeforeSibling</div>)
      }
    />
  )
}
function AfterSibling() {
  onCleanup(() =>
    render(<div>onCleanup: AfterSibling:component body</div>),
  )

  return (
    <section
      onUnmount={() =>
        render(<div>onUnmountNode: from AfterSibling</div>)
      }
    />
  )
}
function Test() {
  onCleanup(() => render(<div>onCleanup: component body</div>))
  return (
    <main
      onUnmount={() =>
        render(<div>onUnmountNode: from container</div>)
      }
    >
      <section>
        <div>
          <div
            onUnmount={() => render(<div>onUnmountNode: deep 1</div>)}
          />
        </div>
      </section>
      <BeforeSibling />
      <section
        onUnmount={() =>
          render(<div>onUnmountNode: from inlined element</div>)
        }
      ></section>
      <AfterSibling />
      <section>
        <div>
          <div
            onUnmount={() => render(<div>onUnmountNode: deep 2</div>)}
          />
        </div>
      </section>
    </main>
  )
}

const dispose = render(Test)

dispose()
