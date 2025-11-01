import { render } from 'pota'

import { Suspense } from 'pota/components'

const waitFor = 1000

function A() {
  const start = performance.now()
  const async = () =>
    new Promise(r =>
      setTimeout(() => r(performance.now() - start), waitFor),
    )

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <p>A {async()}</p>
      <B start={start} />
    </Suspense>
  )
}

function B(props) {
  const async = () =>
    new Promise(r =>
      setTimeout(() => r(performance.now() - props.start), waitFor),
    )

  return (
    <>
      <p>B {async()}</p>
      <C start={props.start} />
    </>
  )
}

function C(props) {
  const async = () =>
    new Promise(r =>
      setTimeout(() => r(performance.now() - props.start), waitFor),
    )

  return <p>C {async()}</p>
}

render(A)
