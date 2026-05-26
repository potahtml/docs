import { render } from 'pota'
import { lazyImage } from 'pota/use/intersection'

function Gallery() {
  const urls = [
    'https://picsum.photos/seed/a/600/300',
    'https://picsum.photos/seed/b/600/300',
    'https://picsum.photos/seed/c/600/300',
  ]
  return (
    <div>
      {urls.map(url => (
        <img
          data-src={url}
          alt=""
          width="600"
          height="300"
          style={{ display: 'block', margin: '2rem 0' }}
          use:ref={lazyImage({ rootMargin: '200px' })}
        />
      ))}
    </div>
  )
}

render(Gallery)
