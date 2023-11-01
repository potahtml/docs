import { addEventListener, removeEventListener } from 'pota'

const node = document.createElement('main')
const handler = () => console.log('handler')

// regular handlers

// remove the event listener with off()
const off = addEventListener(node, 'click', handler, true)

// add the event listener back with on()
const on = removeEventListener(node, 'click', handler, true)

// handlers with data

const handlerWithData = [handler, 1, 2, 3]

const off2 = addEventListener(node, 'click', handlerWithData, true)
const on2 = removeEventListener(node, 'click', handlerWithData, true)
