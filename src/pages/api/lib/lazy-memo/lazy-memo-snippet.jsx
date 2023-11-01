import { lazyMemo } from 'pota'

const lazy = lazyMemo(() => {
  console.log('Will run only when called')
})
