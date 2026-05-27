import { toHTML, signal } from 'pota'

const label = signal('first')

const node = toHTML(<p>{label.read}</p>)
document.body.append(node)

// the existing <p> updates in place
setTimeout(() => label.write('second'), 1000)
