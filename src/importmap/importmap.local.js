const request = new XMLHttpRequest()
request.open(
	'GET',
	'http://localhost:11433/importmap/importmap.local.json',
	false,
)
request.send(null)

const map = document.createElement('script')
map.setAttribute('type', 'importmap')
map.textContent = request.responseText
document.head.append(map)
