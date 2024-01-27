import { addEventListener, removeEventListener } from 'pota'

const node = document.createElement('main')
const handler = () => console.log('handler')

// regular handlers

// remove the event listener with off()
const off = addEventListener(node, 'click', handler)

// add the event listener back with on()
const on = removeEventListener(node, 'click', handler)
