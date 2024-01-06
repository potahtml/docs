import { render } from 'pota'

import { bind } from 'pota/plugins/bind'

function App() {
  const input = bind('email@gmail.com')
  const select = bind('1')
  const checkbox = bind(true)
  const radio = bind(2)
  const contentEditable = bind('editable')

  return (
    <main>
      <section>
        <input
          name="email"
          bind={input}
        />{' '}
        email: {input}
      </section>
      <section>
        <select bind={select}>
          <option>0</option>
          <option>1</option>
          <option>2</option>
        </select>
        select: {select}
      </section>
      <section>
        <input
          type="checkbox"
          bind={checkbox}
        />{' '}
        checkbox: {checkbox}
      </section>
      <section>
        <label>
          <input
            type="radio"
            bind={radio}
            name="lala"
            value="1"
          />{' '}
          one{' '}
        </label>{' '}
        <label>
          <input
            type="radio"
            bind={radio}
            name="lala"
            value="2"
          />{' '}
          two{' '}
        </label>
        {' - '}
        radio: {radio}
      </section>
      <section>
        <label>
          <span
            contentEditable="true"
            bind={contentEditable}
          ></span>
        </label>
        contentEditable: {contentEditable}
      </section>
    </main>
  )
}

render(App)
