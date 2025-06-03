import { A } from 'pota/components'

function Menu() {
	return (
		<>
			<h2>Variété</h2>
			<A
				href="/:cat/:page"
				params={{ cat: 'variété', page: 'touché' }}
				replace={true}
			>
				Touché using `A`
			</A>
			<Link
				href="/:cat/:page"
				params={{ cat: 'variété', page: 'touché' }}
				replace={true}
			>
				Touché using `Link`
			</Link>
		</>
	)
}
