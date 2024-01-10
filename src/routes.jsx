import { Route } from 'pota/router'
import { lazy } from 'pota'

import FourZeroFour from './pages/404.jsx'
import Home from './pages/home/index.jsx'

function NotFound() {
	return (
		<Route.Default>
			<FourZeroFour />
		</Route.Default>
	)
}
export default function Routes() {
	return (
		<Route
			path="/"
			scrolls={['#content']}
		>
			<NotFound />

			<Route>
				<Home />
			</Route>

			<Route path="docs/">
				<NotFound />

				<Route
					path="usage$"
					children={lazy(() => import('./pages/docs/usage.jsx'))}
				/>
			</Route>

			<Route
				path="playground$"
				children={lazy(
					() => import('./pages/playground/playground.jsx'),
				)}
			/>

			<Route path="rendering/">
				<NotFound />

				<Route
					path="render$"
					children={lazy(
						() => import('./pages/rendering/render.jsx'),
					)}
				/>
				<Route
					path="create$"
					children={lazy(
						() => import('./pages/rendering/create.jsx'),
					)}
				/>
				<Route
					path="html$"
					children={lazy(() => import('./pages/rendering/html.jsx'))}
				/>

				<Route path="children/">
					<NotFound />

					<Route
						path="resolve$"
						children={lazy(
							() => import('./pages/rendering/resolve.jsx'),
						)}
					/>
					<Route
						path="toHTML$"
						children={lazy(
							() => import('./pages/rendering/toHTML.jsx'),
						)}
					/>
				</Route>
			</Route>

			<Route path="api/">
				<NotFound />

				<Route
					path="reactivity$"
					children={lazy(() => import('./pages/api/reactivity.jsx'))}
				/>

				<Route
					path="Context$"
					children={lazy(() => import('./pages/api/context.jsx'))}
				/>

				<Route path="directory/?">
					<NotFound />

					<Route
						children={lazy(() => import('./pages/api/directory.jsx'))}
					></Route>

					<Route path="hooks/">
						<NotFound />

						<Route
							path="useSelector$"
							children={lazy(
								() => import('./pages/api/hooks/use-selector.jsx'),
							)}
						/>
					</Route>
				</Route>

				<Route
					path="memo$"
					children={lazy(() => import('./pages/api/lib/memo.jsx'))}
				/>
				<Route
					path="map$"
					children={lazy(() => import('./pages/api/lib/map.jsx'))}
				/>
			</Route>

			<Route path="components/">
				<NotFound />

				<Route
					path="Classes$"
					children={lazy(
						() => import('./pages/components/classes.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'lazy' }}
					children={lazy(() => import('./pages/components/lazy.jsx'))}
				/>
				<Route path="lifecycles/">
					<NotFound />

					<Route
						path="onReady$"
						children={lazy(
							() =>
								import('./pages/components/lifecycles/on-ready.jsx'),
						)}
					/>
					<Route
						path="onCleanup$"
						children={lazy(
							() =>
								import(
									'./pages/components/lifecycles/on-cleanup.jsx'
								),
						)}
					/>
				</Route>
			</Route>

			<Route path="flow/">
				<NotFound />

				<Route
					path=":path$"
					params={{ path: '<Show/>' }}
					children={lazy(() => import('./pages/flow/show.jsx'))}
				/>
				<Route
					path=":path$"
					params={{ path: '<Collapse/>' }}
					children={lazy(() => import('./pages/flow/collapse.jsx'))}
				/>
				<Route
					path=":path$"
					params={{ path: '<Switch/>' }}
					children={lazy(() => import('./pages/flow/switch.jsx'))}
				/>
				<Route
					path=":path$"
					params={{ path: '<For/>' }}
					children={lazy(() => import('./pages/flow/for.jsx'))}
				/>
				<Route
					path=":path$"
					params={{ path: '<Portal/>' }}
					children={lazy(() => import('./pages/flow/portal.jsx'))}
				/>
				<Route
					path=":path$"
					params={{ path: '<Head/>' }}
					children={lazy(() => import('./pages/flow/head.jsx'))}
				/>
				<Route
					path=":path$"
					params={{ path: '<Dynamic/>' }}
					children={lazy(() => import('./pages/flow/dynamic.jsx'))}
				/>
				<Route
					path=":path$"
					params={{ path: '<Promised/>' }}
					children={lazy(() => import('./pages/flow/promised.jsx'))}
				/>
			</Route>

			<Route path="router/">
				<NotFound />

				<Route
					path=":path$"
					params={{ path: '<Route/>' }}
					children={lazy(() => import('./pages/router/route.jsx'))}
				/>
				<Route
					path=":path$"
					params={{ path: '<A/>' }}
					children={lazy(() => import('./pages/router/link.jsx'))}
				/>
				<Route
					path=":path$"
					params={{ path: 'navigate / <Navigate/>' }}
					children={lazy(() => import('./pages/router/navigate.jsx'))}
				/>

				<Route
					path="useLocation$"
					children={lazy(
						() => import('./pages/router/use-location.jsx'),
					)}
				/>
				<Route
					path="useParams$"
					children={lazy(
						() => import('./pages/router/use-params.jsx'),
					)}
				/>
				<Route
					path="useBeforeLeave$"
					children={lazy(
						() => import('./pages/router/use-before-leave.jsx'),
					)}
				/>
			</Route>

			<Route path="props/">
				<NotFound />

				<Route
					path=":path$"
					params={{ path: 'ref' }}
					children={lazy(() => import('./pages/props/ref.jsx'))}
				/>

				<Route
					path=":path$"
					params={{ path: 'setElementAttribute' }}
					children={lazy(
						() => import('./pages/props/set-element-attribute.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'setElementProperty' }}
					children={lazy(
						() => import('./pages/props/set-element-property.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'setElementStyle' }}
					children={lazy(
						() => import('./pages/props/set-element-style.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'ns:__ / xmlns' }}
					children={lazy(() => import('./pages/props/ns-xlmns.jsx'))}
				/>

				<Route
					path=":path$"
					params={{ path: 'propsSplit' }}
					children={lazy(() => import('./pages/props/split.jsx'))}
				/>
				<Route path="plugins/">
					<Route
						path=":path$"
						params={{ path: 'propsPlugin' }}
						children={lazy(
							() => import('./pages/props/plugins/propsPlugin.jsx'),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'bind' }}
						children={lazy(
							() => import('./pages/props/plugins/bind.jsx'),
						)}
					/>
				</Route>
				<Route path="attributes/">
					<NotFound />

					<Route
						path=":path$"
						params={{ path: 'prop:__' }}
						children={lazy(
							() => import('./pages/props/attributes/prop.jsx'),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'attr:__' }}
						children={lazy(
							() => import('./pages/props/attributes/attr.jsx'),
						)}
					/>
				</Route>

				<Route path="css/">
					<NotFound />

					<Route
						path=":path$"
						params={{ path: 'style:__' }}
						children={lazy(
							() => import('./pages/props/css/style.jsx'),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'class:__' }}
						children={lazy(
							() => import('./pages/props/css/class.jsx'),
						)}
					/>
				</Route>

				<Route path="lifecycles/">
					<NotFound />

					<Route
						path="onMount$"
						children={lazy(
							() => import('./pages/props/lifecycles/on-mount.jsx'),
						)}
					/>
					<Route
						path="onUnmount$"
						children={lazy(
							() => import('./pages/props/lifecycles/on-unmount.jsx'),
						)}
					/>
				</Route>

				<Route path="events/">
					<NotFound />

					<Route
						path="on__$"
						children={lazy(
							() => import('./pages/props/events/delegated.jsx'),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'on:__' }}
						children={lazy(
							() => import('./pages/props/events/native.jsx'),
						)}
					/>
					<Route
						path=":path$"
						params={{
							path: 'addEventListener / removeEventListener',
						}}
						children={lazy(
							() => import('./pages/props/events/add-remove.jsx'),
						)}
					/>
				</Route>
			</Route>
		</Route>
	)
}
