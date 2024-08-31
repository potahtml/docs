import { navigate } from 'pota/plugin/useLocation'

function Example() {
	navigate('/somewhere/:cat/:page', {
		params: { cat: 'variété', page: 'touché' },
		scroll: false,
	})
}
