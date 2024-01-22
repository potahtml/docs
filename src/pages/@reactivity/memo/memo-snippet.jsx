import { memo } from 'pota'

const lazy = memo(() => {
  console.log('Will run only when called')
})
