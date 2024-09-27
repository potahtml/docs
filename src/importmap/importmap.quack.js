const request = new XMLHttpRequest()
request.open(
	'GET',
	'https://pota.quack.uy/importmap/importmap.quack.json',
	false,
)
request.send(null)

const map = document.createElement('script')
map.setAttribute('type', 'importmap')
map.textContent = request.responseText
document.head.append(map)
