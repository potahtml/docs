import { render } from 'pota'
import { Dynamic } from 'pota/components'

function Bold(props) {
  return <b>{props.children}</b>
}
function List(props) {
  return props.list.map(item => item + '!')
}

function Even(props) {
  return props.list.filter(item => item % 2 === 0)
}

function Example() {
  return (
    <main>
      <Dynamic component={Bold}>Hello</Dynamic>
      <hr />
      <Dynamic component="h2">Quack</Dynamic>
      <hr />
      <Dynamic
        component={List}
        list={[1, 2, 3]}
      >
        asdasd
      </Dynamic>
      <hr />
      <Dynamic
        component={Even}
        list={[1, 2, 3]}
      />
    </main>
  )
}

render(Example)
