import { insert, render, signal } from 'pota'

const host = document.createElement('aside')
host.style.cssText = 'border:1px dashed #888; padding:.5rem'
document.body.append(host)

function App() {
  const [message] = signal('hello from outside')

  // insert is owned by App's scope — its content disposes with App
  insert(<p>{message}</p>, host)

  return <p>main app</p>
}

render(App)
