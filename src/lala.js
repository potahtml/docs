import { render, propsPlugin, addEvent, effect, batch } from 'pota'

import { mutable, replace, reset } from 'pota/store'

function App() {
  const data = mutable({
    checkbox: true,
    lala: '2',
    email: 'test@test.com',
    selectNumbers: '2',
  })

  return (
    <form
      use:formdata={data}
      on:submit={e => e.preventDefault()}
    >
      <section>
        <input name="email" /> email: {() => data.email}
        <button on:click={() => (data.email = 'email2@example.net')}>
          select email2@example.net
        </button>
      </section>
      <section>
        <select name="selectNumbers">
          <option>0</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
        select: {() => data.selectNumbers}
        <button on:click={() => (data.selectNumbers = '3')}>
          select three
        </button>
      </section>
      <section>
        <input
          type="checkbox"
          name="checkbox"
        />{' '}
        checkbox: {() => data.checkbox}
        <button on:click={() => (data.checkbox = !data.checkbox)}>
          toggle checked
        </button>
      </section>
      <section>
        <label>
          <input
            type="radio"
            name="lala"
            value="1"
          />{' '}
          one{' '}
        </label>{' '}
        <label>
          <input
            type="radio"
            name="lala"
            value="2"
          />{' '}
          two{' '}
        </label>
        {' - '}
        radio: {() => data.lala}
        <button on:click={() => (data.lala = '2')}>set 2</button>
      </section>
      <section>
        <label>
          <span
            contenteditable="true"
            name="editable"
          ></span>
        </label>
        {' - '}
        {() => data.editable}
        {' - '}
        <button on:click={() => (data.editable = '')}>clear</button>
      </section>
    </form>
  )
}

propsPlugin('use:formdata', (node, propName, propValue, props) => {
  effect(() => object2form(node, propValue))
  addEvent(node, 'input', e => {
    // TODO JUST CHANGE WHAT CHANGED AND NOT ALL MAYBE
    replace(propValue, {})
    batch(() => form2object(node, propValue))
  })
})

function form2object(form, object = {}) {
  const formData = new FormData(form)
  for (const [key, value] of formData) {
    if (object.hasOwnProperty(key)) {
      const entry = object[key]
      Array.isArray(entry)
        ? entry.push(value)
        : (object[key] = [object[key], value])
    } else {
      object[key] = value
    }
  }

  return object
}

function object2form(form, object) {
  for (const id in object) {
    const name = id
    const value = object[id]

    const fields = form.querySelectorAll('[name=' + name + ']')

    for (const field of fields) {
      switch (field.type) {
        case 'checkbox':
          field.checked = !!value
          break
        case 'radio':
          field.checked = field.value === value
          break
        default: {
          if (field.options) {
            for (const option of field.options) {
              if (value.indexOf(option.value) !== -1)
                option.selected = true
            }
          } else {
            field.value = value
          }
        }
      }
    }
  }
}

render(App)
