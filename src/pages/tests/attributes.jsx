import { render } from 'pota'
import { html } from 'pota/html'

class MyEl extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const div = html`
      <div
        foo="hello"
        .foo="${'hi'}"
        foo2="${'hey'}"
        .foo2="howdy"
        ?bar=""
        ?baz="true"
        ?lorem="false"
        ?doh="${true}"
        ?dah="${false}"
        foo-Bar="yo"
        .foo-Bar="sup"
        .foo-Bar2="${'word'}"
      >
        Hello, ${this.doesNotExist}!
      </div>
    `

    div.forEach(n =>
      this.shadowRoot.append(typeof n === 'function' ? n() : n),
    )
  }
}

customElements.define('my-el', MyEl)

const parent = new MyEl()
document.body.append(parent)

const el = parent.shadowRoot.children[0]

console.log('A ------------')
console.log(el.getAttribute('foo')) // "hello"
console.log(el.foo) // "hi"
console.log(el.getAttribute('foo2')) // "hey"
console.log(el.foo2) // "howdy"
console.log(el.getAttribute('bar')) // null (expect "" similar to `bar=""`?)
console.log(el.getAttribute('baz')) // ""
console.log(el.getAttribute('lorem')) // ""
console.log(el.getAttribute('doh')) // "" (truthy, so it exists)
console.log(el.getAttribute('dah')) // null (falsy, so it doesn't exist)

// Pota treats the static expressions in a more intuitive way than Lit
console.log('B ------------')
console.log(el.getAttribute('.foo2')) // null (good, the property was set instead)
console.log(el.getAttribute('?bar')) // null (good, boolean handling for `bar` not a `?bar` attribute)
console.log(el.getAttribute('?baz')) // null (good, boolean handling for `baz` not a `?baz` attribute)
console.log(el.getAttribute('?lorem')) // null (good, boolean handling for `lorem` not a `?lorem` attribute)

//
console.log('C ------------')
console.log(el.getAttribute('foo-bar')) // "yo"
console.log(el['foo-Bar']) // undefined, expected "sup"
console.log(el['foo-Bar2']) // undefined, expected "word"
// Pota currently camelCases them:
console.log(el.fooBar) // "sup"
console.log(el.fooBar2) // "word"
