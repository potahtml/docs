import { navigate } from 'pota/use/location'

function Example() {
	navigate('/somewhere/:cat/:page', {
		params: { cat: 'variété', page: 'touché' },
		scroll: false,
	})
}
