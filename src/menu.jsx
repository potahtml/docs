import { A, navigate } from 'pota/router'

export default function Menu() {
	return (
		<>
			<h2
				onClick={() => navigate('/')}
				flair="cursor-hand"
			>
				pota docs
			</h2>
			<ul>
				<li>
					<a href="/docs/usage">Usage</a>
				</li>

				<li>
					<a href="/playground">Playground</a>
				</li>
			</ul>

			<h3>Rendering</h3>
			<ul>
				<li>
					<a href="/rendering/render">render</a>
				</li>
				<li>
					<a href="/rendering/create">create</a>
				</li>
				<li>
					<a href="/rendering/template">template</a>
				</li>
				<li>
					<h4>Children</h4>
					<ul>
						<li>
							<a href="/rendering/children/resolve">resolve</a>
						</li>
						<li>
							<a href="/rendering/children/toHTML">toHTML</a>
						</li>
					</ul>
				</li>
			</ul>
			<h3>API</h3>
			<ul>
				<li>
					<a href="/api/reactivity">Reactivity</a>
				</li>
				<li>
					<a href="/api/Context">Context</a>
				</li>
				<li>
					<a href="/api/directory">Directory</a>
				</li>
			</ul>

			<h3>Components</h3>
			<ul>
				<li>
					<a href="/components/Classes">Classes</a>
				</li>
				<li>
					<a href="/components/lazy">lazy</a>
				</li>
				<li>
					<h4>Lifecycles</h4>
					<ul>
						<li>
							<a href="/components/lifecycles/onReady">onReady</a>
						</li>
						<li>
							<a href="/components/lifecycles/onCleanup">onCleanup</a>
						</li>
					</ul>
				</li>
				<li>
					<h4>Flow</h4>
					<ul>
						<li>
							<A
								href="/flow/:page"
								params={{ page: '<Show/>' }}
								children="<Show/>"
							/>
						</li>
						<li>
							<A
								href="/flow/:page"
								params={{ page: '<Collapse/>' }}
								children="<Collapse/>"
							/>
						</li>
						<li>
							<A
								href="/flow/:page"
								params={{ page: '<Switch/>' }}
								children="<Switch/>"
							/>
						</li>
						<li>
							<A
								href="/flow/:page"
								params={{ page: '<For/>' }}
								children="<For/>"
							/>
						</li>
						<li>
							<A
								href="/flow/:page"
								params={{ page: '<Portal/>' }}
								children="<Portal/>"
							/>
						</li>
						<li>
							<A
								href="/flow/:page"
								params={{ page: '<Head/>' }}
								children="<Head/>"
							/>
						</li>
						<li>
							<A
								href="/flow/:page"
								params={{ page: '<Dynamic/>' }}
								children="<Dynamic/>"
							/>
						</li>
						<li>
							<A
								href="/flow/:page"
								params={{ page: '<Promised/>' }}
								children="<Promised/>"
							/>
						</li>
					</ul>
					<h4>Router</h4>
					<ul>
						<li>
							<A
								href="/router/:page"
								params={{ page: '<Route/>' }}
								children="<Route/>"
							/>
						</li>
						<li>
							<A
								href="/router/:page"
								params={{ page: '<A/>' }}
								children="<A/>"
							/>
						</li>
						<li>
							<A
								href="/router/:page"
								params={{ page: 'navigate / <Navigate/>' }}
							>
								navigate
							</A>
						</li>

						<li>
							<A
								href="/router/:page"
								params={{ page: 'useLocation' }}
							>
								useLocation
							</A>
						</li>
						{/*<li>
							<A
								href="/router/:page"
								params={{ page: 'useParams' }}
							>
								<s>useParams</s>
							</A>
						</li>*/}
						<li>
							<A
								href="/router/:page"
								params={{ page: 'useBeforeLeave' }}
							>
								useBeforeLeave
							</A>
						</li>
					</ul>
				</li>
			</ul>
			<h3>Props</h3>
			<ul>
				<li>
					<A
						href="/props/:page"
						params={{ page: 'ref' }}
					>
						ref
					</A>
				</li>
				<li>
					<A
						href="/props/:page"
						params={{ page: 'bind' }}
					>
						bind
					</A>
				</li>
				<li>
					<A
						href="/props/:page"
						params={{ page: 'ns:__ / xmlns' }}
					>
						ns:__ / xmlns
					</A>
				</li>
				<li>
					<A
						href="/props/:page"
						params={{ page: 'propsSplit' }}
					>
						propsSplit
					</A>
				</li>
				<li>
					<A
						href="/props/:page"
						params={{ page: 'propsPlugin' }}
					>
						propsPlugin
					</A>
				</li>

				<li>
					<h4>Lifecycles</h4>
					<ul>
						<li>
							<a href="/props/lifecycles/onMount">onMount</a>
						</li>
						<li>
							<a href="/props/lifecycles/onUnmount">onUnmount</a>
						</li>
					</ul>
				</li>

				<li>
					<h4>Attributes</h4>
					<ul>
						<li>
							<A
								href="/props/attributes/:page"
								params={{ page: 'prop:__' }}
							>
								prop:__
							</A>
						</li>
						<li>
							<A
								href="/props/attributes/:page"
								params={{ page: 'attr:__' }}
							>
								attr:__
							</A>
						</li>
					</ul>
				</li>
				<li>
					<h4>CSS</h4>
					<ul>
						<li>
							<A
								href="/props/css/:page"
								params={{ page: 'style:__' }}
							>
								style:__
							</A>
						</li>
						<li>
							<A
								href="/props/css/:page"
								params={{ page: 'class:__' }}
							>
								class:__
							</A>
						</li>
					</ul>
				</li>

				<li>
					<h4>Events</h4>
					<ul>
						<li>
							<a href="/props/events/on__">on__</a>
						</li>
						<li>
							<A
								href="/props/events/:page"
								params={{ page: 'on:__' }}
							>
								on:__
							</A>
						</li>
						<li>
							<A
								href="/props/events/:page"
								params={{
									page: 'addEventListener / removeEventListener',
								}}
							>
								add / remove
							</A>
						</li>
					</ul>
				</li>
			</ul>
		</>
	)
}
