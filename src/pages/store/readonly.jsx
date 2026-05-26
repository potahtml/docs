import { readonly } from 'pota/store'

const settings = readonly({
  api: { url: 'https://api.example.com', timeout: 5000 },
  flags: { betaUI: true },
})

// reading is fine
console.log(settings.api.url)

// any of these throws in strict mode (and TypeScript already complained)
try {
  settings.api.url = '...'
} catch (e) {
  console.log('blocked:', e.message)
}
