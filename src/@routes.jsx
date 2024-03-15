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
