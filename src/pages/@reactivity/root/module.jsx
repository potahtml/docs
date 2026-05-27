import { effect, root, signal } from 'pota'

export const session = root(() => {
  const user = signal(null)

  effect(() => {
    if (user.read()) {
      document.documentElement.classList.add('logged-in')
    } else {
      document.documentElement.classList.remove('logged-in')
    }
  })

  return {
    user: user.read,
    login: u => user.write(u),
    logout: () => user.write(null),
  }
})
