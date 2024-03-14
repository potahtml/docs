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
