import { render } from 'pota'
import { A } from 'pota/web'

function Menu() {
	return (
		<>
			<h2>Variété</h2>
			<ul>
				<li>
					<A
						href="/:cat/:page"
						params={{ cat: 'variété', page: 'touché' }}
						replace={true}
					>
						/:cat/:page using `A`
					</A>
				</li>

				<li>
					<A
						href="#:cat/:page"
						params={{ cat: 'variété', page: 'touché' }}
						replace={false}
					>
						#:cat/:page
					</A>
				</li>
				<li>
					<A
						href=":cat/:page"
						params={{ cat: 'variété', page: 'touché' }}
						replace={false}
					>
						:cat/:page
					</A>
				</li>
				<li>
					<A
						href=":page"
						params={{ page: 'touché' }}
						replace={false}
					>
						:page
					</A>
				</li>
				<li>
					<A
						href=":nope"
						params={{ page: 'touché' }}
						replace={false}
					>
						:nope (it shouldnt replace :nope)
					</A>
				</li>
				<li>
					<A
						href="?something=:page&woot=:nope"
						params={{ page: 'touché' }}
						replace={false}
					>
						?something=:page&woot=:nope (it shouldnt replace :nope)
					</A>
				</li>
			</ul>
		</>
	)
}

render(Menu)
