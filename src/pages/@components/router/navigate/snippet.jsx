import { Navigate } from 'pota/router'

function Example() {
	return (
		<Navigate
			href="/somewhere/:cat/:page"
			params={{ cat: 'variété', page: 'touché' }}
			scroll={false}
		/>
	)
}
