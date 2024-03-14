import { Route } from 'pota/router'
import { lazy } from 'pota'

import FourZeroFour from './404.jsx'
import Home from './pages/home.jsx'

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

			<Route path="articles/">
				<Route
					children={lazy(() => import('./pages/@articles/index.jsx'))}
				/>
				<Route
					path=":path$"
					params={{
						path: 'anatomy-of-a-signals-based-reactive-renderer',
					}}
					children={lazy(
						() =>
							import(
								'./pages/@articles/anatomy/anatomy-of-a-signals-based-reactive-renderer.jsx'
							),
					)}
				/>
			</Route>

			<Route path="CustomElement/">
				<Route
					children={lazy(
						() =>
							import('./pages/@components/custom-element/index.jsx'),
					)}
				/>
				<Route
					path="custom-elements-everywhere"
					params={{ path: '' }}
					children={lazy(
						() =>
							import(
								'./pages/@components/custom-element/custom-elements-everywhere/index.jsx'
							),
					)}
				/>
			</Route>

			<Route path="Components/">
				<NotFound />

				<Route
					path=":path$"
					params={{ path: 'Collapse' }}
					children={lazy(
						() => import('./pages/@components/collapse/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'Dynamic' }}
					children={lazy(
						() => import('./pages/@components/dynamic/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'For' }}
					children={lazy(
						() => import('./pages/@components/for/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'Head' }}
					children={lazy(
						() => import('./pages/@components/head/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'Portal' }}
					children={lazy(
						() => import('./pages/@components/portal/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'Promised' }}
					children={lazy(
						() => import('./pages/@components/promised/index.jsx'),
					)}
				/>

				<Route path="Router/">
					<NotFound />

					<Route
						path=":path$"
						params={{ path: 'Route' }}
						children={lazy(
							() =>
								import('./pages/@components/router/route/index.jsx'),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'A' }}
						children={lazy(
							() =>
								import('./pages/@components/router/link/index.jsx'),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'Navigate' }}
						children={lazy(
							() =>
								import(
									'./pages/@components/router/navigate/index.jsx'
								),
						)}
					/>

					<Route
						path=":path$"
						params={{ path: 'useLocation' }}
						children={lazy(
							() =>
								import(
									'./pages/@components/router/use-location/index.jsx'
								),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'useParams' }}
						children={lazy(
							() =>
								import(
									'./pages/@components/router/use-params/index.jsx'
								),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'useBeforeLeave' }}
						children={lazy(
							() =>
								import(
									'./pages/@components/router/use-before-leave/index.jsx'
								),
						)}
					/>
				</Route>

				<Route
					path=":path$"
					params={{ path: 'Show' }}
					children={lazy(
						() => import('./pages/@components/show/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'Switch' }}
					children={lazy(
						() => import('./pages/@components/switch/index.jsx'),
					)}
				/>

				<Route path="Library/">
					<Route
						children={lazy(
							() => import('./pages/@components/@library/index.jsx'),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'alert' }}
						children={lazy(
							() => import('./pages/@components/@library/alert.jsx'),
						)}
					/>
				</Route>
			</Route>

			<Route path="Directory/">
				<NotFound />

				<Route
					children={lazy(
						() => import('./pages/@directory/index.jsx'),
					)}
				/>
			</Route>

			<Route path="hooks/">
				<NotFound />

				<Route
					path=":path$"
					params={{ path: 'useSelector' }}
					children={lazy(
						() => import('./pages/@hooks/use-selector/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'useTimeout' }}
					children={lazy(
						() => import('./pages/@hooks/use-timeout/index.jsx'),
					)}
				/>
			</Route>

			<Route
				path=":path$"
				params={{ path: 'playground' }}
				children={lazy(() => import('./pages/@playground/index.jsx'))}
			/>

			<Route path="props/">
				<NotFound />

				<Route path="plugins/">
					<NotFound />

					<Route
						path=":path$"
						params={{ path: 'autofocus' }}
						children={lazy(
							() =>
								import('./pages/@props/@plugins/autofocus/index.jsx'),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'bind' }}
						children={lazy(
							() => import('./pages/@props/@plugins/bind/index.jsx'),
						)}
					/>

					<Route
						path=":path$"
						params={{ path: 'onClickOutside' }}
						children={lazy(
							() =>
								import(
									'./pages/@props/@plugins/onClickOutside/index.jsx'
								),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'pasteTextPlain' }}
						children={lazy(
							() =>
								import(
									'./pages/@props/@plugins/pasteTextPlain/index.jsx'
								),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'useClipboard' }}
						children={lazy(
							() =>
								import(
									'./pages/@props/@plugins/useClipboard/index.jsx'
								),
						)}
					/>
					<Route
						path=":path$"
						params={{ path: 'useFullscreen' }}
						children={lazy(
							() =>
								import(
									'./pages/@props/@plugins/useFullscreen/index.jsx'
								),
						)}
					/>
				</Route>

				<Route
					path=":path$"
					params={{ path: 'attr:__' }}
					children={lazy(
						() => import('./pages/@props/attr/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'attributes-properties' }}
					children={lazy(
						() =>
							import(
								'./pages/@props/attributes-properties/index.jsx'
							),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'bool:__' }}
					children={lazy(
						() => import('./pages/@props/bool/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'class:__' }}
					children={lazy(
						() => import('./pages/@props/class/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{
						path: 'EventListener',
					}}
					children={lazy(
						() => import('./pages/@props/event-listener/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'on__' }}
					children={lazy(
						() =>
							import(
								'./pages/@props/event-listener-window/index.jsx'
							),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'on:__' }}
					children={lazy(
						() =>
							import(
								'./pages/@props/event-listener-native/index.jsx'
							),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'onMount' }}
					children={lazy(
						() => import('./pages/@props/on-mount/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'onUnmount' }}
					children={lazy(
						() => import('./pages/@props/on-unmount/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'prop:__' }}
					children={lazy(
						() => import('./pages/@props/prop/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'propsPlugin' }}
					children={lazy(
						() => import('./pages/@props/props-plugin/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'propsProxy' }}
					children={lazy(
						() => import('./pages/@props/props-proxy/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'propsSplit' }}
					children={lazy(
						() => import('./pages/@props/props-split/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'ref' }}
					children={lazy(
						() => import('./pages/@props/ref/index.jsx'),
					)}
				/>

				<Route
					path=":path$"
					params={{ path: 'setAttribute' }}
					children={lazy(
						() => import('./pages/@props/set-attribute/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'setBool' }}
					children={lazy(
						() => import('./pages/@props/set-bool/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'setProperty' }}
					children={lazy(
						() => import('./pages/@props/set-property/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'setStyle' }}
					children={lazy(
						() => import('./pages/@props/set-style/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'style:__' }}
					children={lazy(
						() => import('./pages/@props/style/index.jsx'),
					)}
				/>
			</Route>

			<Route path="Reactivity/">
				<NotFound />

				<Route
					children={lazy(
						() => import('./pages/@reactivity/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'memo' }}
					children={lazy(
						() => import('./pages/@reactivity/memo/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'map' }}
					children={lazy(
						() => import('./pages/@reactivity/map/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'Context' }}
					children={lazy(
						() => import('./pages/@reactivity/context/index.jsx'),
					)}
				/>
				<Route
					path=":path$"
					params={{ path: 'mutable-tests' }}
					children={() => {
						window.location.href =
							'https://pota.quack.uy/playground#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'
					}}
				/>
			</Route>

			<Route
				path=":path$"
				params={{ path: 'Classes' }}
				children={lazy(() => import('./pages/classes/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'Component' }}
				children={lazy(() => import('./pages/component/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'HTML' }}
				children={lazy(() => import('./pages/html/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'lazy' }}
				children={lazy(() => import('./pages/lazy/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'cleanup' }}
				children={lazy(() => import('./pages/cleanup/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'ready' }}
				children={lazy(() => import('./pages/ready/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'render' }}
				children={lazy(() => import('./pages/render/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'resolve' }}
				children={lazy(() => import('./pages/resolve/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'toHTML' }}
				children={lazy(() => import('./pages/to-html/index.jsx'))}
			/>
			<Route
				path=":path$"
				params={{ path: 'usage' }}
				children={lazy(() => import('./pages/usage/index.jsx'))}
			/>
		</Route>
	)
}
