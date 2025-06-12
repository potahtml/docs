import { render } from 'pota'
import { css } from 'pota/use/css'

function App() {
  return (
    <main>
      {css`
        .orange {
          color: orange;
        }
        .red {
          color: red;
        }
      `}

      <div class="orange"> orange</div>

      <div class={{ orange: true }}>orange: true</div>
      <div class:orange={true}>orange: true</div>
      <div class:my-ns={{ orange: true }}>
        class:my-ns= object orange:true
      </div>

      <div class={{ orange: false }}>orange: false</div>
      <div class:orange={false}>orange: false</div>
      <div class:my-ns={{ orange: false }}>
        class:my-ns= object orange:false
      </div>

      <div class="undefined">class="undefined" this is ok</div>
      <div class={undefined}>class=undefined</div>
      <div
        class="orange"
        class:orange={undefined}
      >
        class:orange:undefined
      </div>
      <div
        class="orange"
        class:orange={null}
      >
        class:orange:null
      </div>
      <div
        class="orange"
        class:red={true}
      >
        class:orange: red=true
      </div>
    </main>
  )
}

render(App)
