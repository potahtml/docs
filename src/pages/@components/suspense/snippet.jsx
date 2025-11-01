import { Suspense } from 'pota/components'

function Component() {
  return (
    <Suspense fallback="Loading..">
      {new Promise(r => setTimeout(() => r('loaded a'), 1000))}
      {new Promise(r => setTimeout(() => r('loaded b'), 1500))}
    </Suspense>
  )
}
