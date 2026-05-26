import { copy } from 'pota/store'

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  get magnitude() {
    return Math.hypot(this.x, this.y)
  }
}

const a = new Point(3, 4)
const b = copy(a)

console.log(b instanceof Point) // true
console.log(b.x, b.y, b.magnitude) // 3 4 5
console.log(a === b) // false

const cyclic = { name: 'self' }
cyclic.me = cyclic
const c = copy(cyclic)
console.log(c.me === c) // true — cycle preserved
