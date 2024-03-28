import { memo } from 'pota'

const lazyMemo = memo(() => {
  console.log('Will run only when called')
})
