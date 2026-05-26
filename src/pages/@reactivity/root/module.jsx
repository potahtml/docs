import { effect, root, signal } from 'pota'

export const session = root(() => {
  const [user, setUser] = signal(null)

  effect(() => {
    if (user()) {
      document.documentElement.classList.add('logged-in')
    } else {
      document.documentElement.classList.remove('logged-in')
    }
  })

  return {
    user,
    login: u => setUser(u),
    logout: () => setUser(null),
  }
})
