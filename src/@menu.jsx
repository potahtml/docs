import { A, navigate } from 'pota/router'

export default function Menu() {
	return (
		<>
			<a href="/">
				<h2 flair="cursor-hand">pota docs</h2>
			</a>
			<ul>
				<li>
					<a href="/usage">Usage</a>
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
					<a href="/Component">Component</a>
				</li>
				<li>
					<a href="/HTML">HTML</a>
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
					<a href="/Reactivity/Context">Context</a>
				</li>
				<li>
					<a href="/Directory/">Directory</a>
				</li>
			</ul>

			<h3>Components</h3>
			<ul>
				<li>
					<a href="/Classes">Classes</a>
				</li>
				<li>
					<a href="/lazy">lazy</a>
				</li>
				<li>
					<h4>Lifecycles</h4>
					<ul>
						<li>
							<a href="/onReady">onReady</a>
						</li>
						<li>
							<a href="/onCleanup">onCleanup</a>
						</li>
					</ul>
				</li>
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
						<li>
							<A
								href="/Components/:page"
								params={{ page: 'Promised' }}
								children="<Promised/>"
							/>
						</li>
					</ul>
					<h4>Router</h4>
					<ul>
						<li>
							<A
								href="/Components/Router/:page"
								params={{ page: 'Route' }}
								children="<Route/>"
							/>
						</li>
						<li>
							<A
								href="/Components/Router/:page"
								params={{ page: 'A' }}
								children="<A/>"
							/>
						</li>
						<li>
							<A
								href="/Components/Router/:page"
								params={{ page: 'Navigate' }}
							>
								navigate
							</A>
						</li>

						<li>
							<A
								href="/Components/Router/:page"
								params={{ page: 'useLocation' }}
							>
								useLocation
							</A>
						</li>
						{/*<li>
							<A
								href="/Components/Router/:page"
								params={{ page: 'useParams' }}
							>
								<s>useParams</s>
							</A>
						</li>*/}
						<li>
							<A
								href="/Components/Router/:page"
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
						params={{ page: 'attributes-properties' }}
					>
						attributes / properties
					</A>
				</li>

				<li>
					<h4>API</h4>
					<ul>
						<li>
							<A
								href="/props/:page"
								params={{ page: 'propsPlugin' }}
							>
								propsPlugin
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
					</ul>
				</li>

				<li>
					<h4>Plugins</h4>
					<ul>
						<li>
							<A
								href="/props/plugins/:page"
								params={{ page: 'bind' }}
							>
								bind
							</A>
						</li>
					</ul>
				</li>

				<li>
					<h4>Lifecycles</h4>
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
							<a href="/props/onMount">onMount</a>
						</li>
						<li>
							<a href="/props/onUnmount">onUnmount</a>
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
								params={{ page: 'attr:__' }}
							>
								attr:__
							</A>
						</li>
						<li>
							<A
								href="/props/:page"
								params={{ page: 'bool:__' }}
							>
								bool:__
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
						<li>
							<A
								href="/props/:page"
								params={{ page: 'setBool' }}
							>
								setBool
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
								params={{ page: 'setStyle' }}
							>
								setStyle
							</A>
						</li>
					</ul>
				</li>

				<li>
					<h4>Events</h4>
					<ul>
						<li>
							<a href="/props/on__">on__</a>
						</li>
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
			</ul>
		</>
	)
}