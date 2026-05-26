import { context } from 'pota'

const Theme = context('light')

console.log(Theme()) // 'light'

const result = Theme('dark', () => {
  return Theme('contrast', () => Theme())
})

console.log(result) // 'contrast'
console.log(Theme()) // 'light' — restored
