import { render } from 'pota'

function App() {
  return (
    <main>
      <div bool:name={true}>true</div>
      <div bool:name={1}>1</div>
      <div bool:name={'hola'}>hola</div>
      <div bool:name={''}>empty</div>
      <div bool:name={0}>0</div>
      <div bool:name={undefined}>undefined</div>
      <div bool:name={null}>null</div>
    </main>
  )
}

render(App)
