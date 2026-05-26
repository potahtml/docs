import { toHTML, signal } from 'pota'

const [label, setLabel] = signal('first')

const node = toHTML(<p>{label}</p>)
document.body.append(node)

// the existing <p> updates in place
setTimeout(() => setLabel('second'), 1000)
