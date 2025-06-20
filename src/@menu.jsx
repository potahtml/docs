import { A } from 'pota/components'

export default function Menu() {
	return (
		<>
			<a href="/">
				<h2 flair="cursor-hand">pota docs</h2>
			</a>
			<ul>
				<li>
					<a href="/Usage">Usage</a>
				</li>

				<li>
					<a href="/typescript">TypeScript</a>
				</li>

				<li>
					<a href="/playground">Playground</a>
				</li>
			</ul>
			<h3>Rendering</h3>
			<ul>
				<li>
					<a href="/render">render</a>
				</li>

				<li>
					<a href="/XML">XML</a>
				</li>

				<li>
					<h4>Children</h4>
					<ul>
						<li>
							<a href="/resolve">resolve</a>
						</li>
						<li>
							<a href="/toHTML">toHTML</a>
						</li>
					</ul>
				</li>
			</ul>
			<h3>API</h3>
			<ul>
				<li>
					<a href="/Reactivity/">Reactivity</a>
				</li>
				<li>
					<a href="/Store">Store</a>
				</li>
				<li>
					<a href="/Context">Context</a>
				</li>
			</ul>
			<h3>Components</h3>
			<ul>
				<li>
					<h4>API</h4>
					<ul>
						<li>
							<a href="/Component">Component</a>
						</li>
						<li>
							<a href="/Classes">Classes</a>
						</li>
						<li>
							<a href="/lazy">lazy</a>
						</li>
					</ul>
				</li>
				<ul>
					<li>
						<h4>Lifecycles</h4>
						<ul>
							<li>
								<a href="/ready">ready</a>
							</li>
							<li>
								<a href="/cleanup">cleanup</a>
							</li>
						</ul>
					</li>
				</ul>
				<li>
					<h4>Flow</h4>
					<ul>
						<li>
							<A
								href="/Components/:page"
								params={{ page: 'Show' }}
								children="<Show/>"
							/>
						</li>
						<li>
							<A
								href="/Components/:page"
								params={{ page: 'Collapse' }}
								children="<Collapse/>"
							/>
						</li>
						<li>
							<A
								href="/Components/:page"
								params={{ page: 'Switch' }}
								children="<Switch/>"
							/>
						</li>
						<li>
							<A
								href="/Components/:page"
								params={{ page: 'For' }}
								children="<For/>"
							/>
						</li>
						<li>
							<A
								href="/Components/:page"
								params={{ page: 'Range' }}
								children="<Range/>"
							/>
						</li>
						<li>
							<A
								href="/Components/:page"
								params={{ page: 'Portal' }}
								children="<Portal/>"
							/>
						</li>
						<li>
							<A
								href="/Components/:page"
								params={{ page: 'Head' }}
								children="<Head/>"
							/>
						</li>
						<li>
							<A
								href="/Components/:page"
								params={{ page: 'Dynamic' }}
								children="<Dynamic/>"
							/>
						</li>
					</ul>
					<h4>Route</h4>
					<ul>
						<li>
							<A
								href="/Components/Route/:page"
								params={{ page: 'Route' }}
								children="<Route/>"
							/>
						</li>
						<li>
							<A
								href="/Components/Route/:page"
								params={{ page: 'A' }}
								children="<A/>"
							/>
						</li>
						<li>
							<A
								href="/use/:page"
								params={{ page: 'location' }}
							>
								location
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
						params={{ page: 'attributes-properties' }}
					>
						attributes / properties
					</A>
				</li>

				<li>
					<h4>Lifecycles</h4>
					<ul>
						<li>
							<A
								href="/use/:page"
								params={{ page: 'ref' }}
							>
								use:ref
							</A>
						</li>
						<li>
							<A
								href="/use/:page"
								params={{ page: 'connected' }}
							>
								use:connected
							</A>
						</li>
						<li>
							<A
								href="/use/:page"
								params={{ page: 'disconnected' }}
							>
								use:disconnected
							</A>
						</li>
					</ul>
				</li>

				<li>
					<h4>Attributes</h4>
					<ul>
						<li>
							<A
								href="/props/:page"
								params={{ page: 'prop:__' }}
							>
								prop:__
							</A>
						</li>
						<li>
							<A
								href="/props/:page"
								params={{ page: 'setProperty' }}
							>
								setProperty
							</A>
						</li>
						<li>
							<A
								href="/props/:page"
								params={{ page: 'setAttribute' }}
							>
								setAttribute
							</A>
						</li>
					</ul>
				</li>

				<li>
					<h4>CSS</h4>
					<ul>
						<li>
							<A
								href="/props/:page"
								params={{ page: 'style:__' }}
							>
								style:__
							</A>
						</li>
						<li>
							<A
								href="/props/:page"
								params={{ page: 'class:__' }}
							>
								class:__
							</A>
						</li>
						<li>
							<A
								href="/props/:page"
								params={{ page: 'css' }}
							>
								css / use:css
							</A>
						</li>
						<li>
							<A
								href="/props/:page"
								params={{ page: 'setStyle' }}
							>
								setStyle
							</A>
						</li>
						<li>
							<A
								href="/props/:page"
								params={{ page: 'setClass' }}
							>
								setClass
							</A>
						</li>
					</ul>
				</li>

				<li>
					<h4>Events</h4>
					<ul>
						<li>
							<A
								href="/props/:page"
								params={{ page: 'on:__' }}
							>
								on:__
							</A>
						</li>
						<li>
							<A
								href="/props/:page"
								params={{
									page: 'EventListener',
								}}
							>
								add / remove
							</A>
						</li>
					</ul>
				</li>
				<li>
					<h4>API</h4>
					<ul>
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
							<a href="/Directory">Directory</a>
						</li>
					</ul>
				</li>
			</ul>
		</>
	)
}
