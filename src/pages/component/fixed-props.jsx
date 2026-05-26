import { Component, render } from 'pota'

const PrimaryButton = Component('button', {
  class: 'btn primary',
  type: 'button',
})

function App() {
  return (
    <div>
      <PrimaryButton on:click={() => alert('hi')}>save</PrimaryButton>
      <PrimaryButton on:click={() => alert('cancel')}>
        cancel
      </PrimaryButton>
    </div>
  )
}

render(App)
