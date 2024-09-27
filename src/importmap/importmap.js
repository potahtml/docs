const map = document.createElement('script')
map.setAttribute('type', 'importmap')

const request = new XMLHttpRequest()
request.open('GET', '/importmap/importmap.json', false)
request.send(null)

map.textContent = request.responseText
document.head.append(map)
