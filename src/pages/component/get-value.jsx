import { getValue, signal } from 'pota'

const [a] = signal(1)
const b = () => a() * 2

console.log(getValue(42)) // 42 (plain)
console.log(getValue(a)) // 1 (signal)
console.log(getValue(b)) // 2 (memo-style)
console.log(getValue(() => () => () => 'deep')) // 'deep'
