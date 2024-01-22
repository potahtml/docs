import { navigate } from 'pota/router'

function Example() {
	navigate('/somewhere/:cat/:page', {
		params: { cat: 'variété', page: 'touché' },
		scroll: false,
	})
}
