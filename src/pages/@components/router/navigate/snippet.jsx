import { Navigate } from 'pota/plugin/useLocation'

function Example() {
	return (
		<Navigate
			href="/somewhere/:cat/:page"
			params={{ cat: 'variété', page: 'touché' }}
			scroll={false}
		/>
	)
}
