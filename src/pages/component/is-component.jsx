import { isComponent, markComponent, render } from 'pota'

const Greeting = markComponent(() => <p>hello!</p>)
const counter = () => Math.random()

console.log(isComponent(Greeting)) // true
console.log(isComponent(counter)) // false

function Wrapper(props) {
  return (
    <div>
      {isComponent(props.body) ? props.body() : <p>{props.body}</p>}
    </div>
  )
}

render(<Wrapper body={Greeting} />)
