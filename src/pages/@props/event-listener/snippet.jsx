import { addEvent, removeEvent } from 'pota'

const node = document.createElement('main')
const handler = () => console.log('handler')

// regular handlers

// remove the event listener with off()
const off = addEvent(node, 'click', handler)

// add the event listener back with on()
const on = removeEvent(node, 'click', handler)
